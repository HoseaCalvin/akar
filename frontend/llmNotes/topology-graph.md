# AKAR topology graph handoff

## Purpose

`/private/monitor/inventory` renders a live, interactive Kubernetes topology graph. It is not mock data. The browser calls the product backend, and the backend proxies AKAR Core's topology contract:

```text
Next frontend -> GET /api/monitor/topology -> GET Core /api/v1/topology
```

Relevant files:

| Responsibility                 | File                                           |
| ------------------------------ | ---------------------------------------------- |
| Graph UI, zoom, pan, selection | `src/app/private/monitor/inventory/page.tsx` |
| Frontend Core adapter call     | `src/lib/api.ts`                             |
| Live topology types            | `src/lib/types.ts`                           |
| Product-backend topology proxy | `../backend/src/routes/akar.routes.ts`       |
| Core topology producer         | `../../core/internal/akar/topology.go`       |

## Core input contract

Core returns `akar.topology.v1` with:

```ts
type TopologyEntity = {
  id: string;
  name: string;
  kind: "NODE" | "DEPLOYMENT" | "SERVICE" | "POD" | string;
  namespace?: string;
  status: string;
};

type TopologyEdge = {
  source: string;
  target: string;
  relationship_type: "HOSTS" | "OWNS" | "ROUTES_TO" | string;
};
```

Do not fabricate entities, resource health, CPU/RAM, latency, or service dependencies in the graph. If Core omits a property, show `N/A` or omit it.

## Presentation graph

The raw Core edges are pod-centric:

```text
Node --HOSTS--> Pod
Deployment --OWNS--> Pod
Service --ROUTES_TO--> Pod
```

`presentationEdges()` in the inventory page derives a cleaner visual flow from shared pod IDs:

```text
Node -> Deployment -> Service -> Pod
Deployment -> Pod     # only when no Service routes to that pod
```

This is a visual correlation projection, not a replacement Core API. Keep the raw Core payload available for inspection and debugging. When changing the projection, preserve these rules:

1. Only connect entities that share a real pod target from Core edges.
2. Deduplicate projected edges with a stable source/target key.
3. Keep the direct Deployment-to-Pod fallback only when that pod has no Service connector.
4. Do not invent node-to-service or service-to-service links.

## Layout and SVG rendering

The graph uses no graph library. `TopologyGraph` calculates fixed lanes and renders:

- HTML buttons for cards, positioned absolutely.
- An SVG behind those cards for curved paths and arrow markers.
- Four ordered lanes: `NODE`, `DEPLOYMENT`, `SERVICE`, `POD`.

For a new entity kind, add it to `lanes`, then decide whether it belongs in the presentation projection. Do not add a lane merely because Core exposes an entity if it has no useful relationship semantics.

Edges should begin/end at card sides, not their centers. Current source/target X offsets use half the card width (`104`). Keep source, target, card width, and SVG viewbox coordinates synchronized if changing card dimensions.

## Interaction behavior

Implemented behavior:

- Mouse wheel: zooms from 65% to 150%.
- Drag blank canvas: pans.
- Click an entity: highlights direct related entities and links; unrelated cards/links dim.
- Click blank canvas or Reset: clears selection; Reset also restores pan and zoom.
- `select-none` and pointer prevention on the canvas avoid accidental text selection while panning.

Do not start pan behavior from a card button. The pointer handler deliberately exits when the target is inside a button so clicks still select entities.

## Safe improvements

Good next improvements, in order:

1. Fit-to-view: compute pan/zoom from bounding extents after the graph is mounted.
2. Edge labels or a legend for `HOSTS_DEPLOYMENT`, `SERVES`, and `ROUTES_TO`.
3. Keyboard support: arrow-key pan, `+`/`-` zoom, Escape clears selection.
4. Stable topology snapshots or Kubernetes watch-driven refresh, so large clusters do not refetch on every navigation.
5. A graph library only if layout requirements exceed fixed lanes; retain Core IDs and the projection tests if doing so.

Avoid rendering all raw Core containment edges in the canvas. At medium cluster sizes they create unreadable edge density.

## Validation

From `akar/frontend`:

```powershell
npx eslint src/app/private/monitor/inventory/page.tsx
npx tsc --noEmit
```

The repository may have unrelated existing TypeScript or lint errors. Verify at minimum that no errors mention the graph file or its direct API/types files.

For live data, the product backend must be running on port `9000` and AKAR Core must be reachable on port `8088`:

```powershell
Invoke-RestMethod http://localhost:9000/api/monitor/topology
```

The response must contain live `entities` and `edges`; do not claim the graph is live if the backend falls back to mock data.
