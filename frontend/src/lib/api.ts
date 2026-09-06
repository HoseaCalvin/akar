import {
  MOCK_EVENT_ID,
  MOCK_INCIDENT_ID,
  MOCK_RESOURCE_ID,
  mockDashboard,
  mockIncidentQueue,
  mockIncidentTimeline,
  mockInvestigation,
  mockInventory,
  mockNodes,
  mockPods,
  mockResourceDetail,
  mockServices,
  mockTimelineEventDetail,
} from "./mocks";
import type {
  ApplyActionResult,
  DashboardSummary,
  DirectoryPage,
  IncidentDetail,
  IncidentQueue,
  IncidentTimeline,
  InventoryItem,
  Investigation,
  LiveTopology,
  NodeItem,
  PodItem,
  ResourceDetail,
  ResourceKind,
  ServiceItem,
  TimelineEventDetail,
} from "./types";

/**
 * Backend contract (Express, cookie session via better-auth):
 *
 * GET  /api/dashboard
 * GET  /api/incidents?worker=&kind=pods|services
 * GET  /api/incidents/:id
 * GET  /api/incidents/:id/timeline
 * GET  /api/incidents/:id/timeline/:eventId
 * GET  /api/incidents/:id/investigation
 * POST /api/incidents/:id/actions/:actionId/apply
 * GET  /api/monitor/inventory?q=
 * GET  /api/monitor/pods?q=
 * GET  /api/monitor/nodes?q=
 * GET  /api/monitor/services?q=
 * GET  /api/monitor/topology
 * GET  /api/monitor/resources/:id
 *
 * Responses should match the TypeScript types in ./types.ts.
 * Auth cookie must be sent: credentials: "include".
 *
 * NEXT_PUBLIC_BACKEND_URL   default http://localhost:5001
 * NEXT_PUBLIC_USE_MOCK=true always use mocks (UI demo without API)
 * NEXT_PUBLIC_USE_MOCK=false never fall back; fail if API is down
 * unset                     try API, then mock (hackathon default)
 */


const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ??
  "http://localhost:5001";

const MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCK;

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(value)), ms);
  });
}

async function request<T>(
  path: string,
  init: RequestInit | undefined,
  fallback: T | undefined,
): Promise<T> {
  if (MOCK_MODE === "true") {
    if (fallback === undefined) {
      throw new ApiError(`No mock for ${path}`, 501);
    }
    return delay(fallback);
  }

  try {
    const headers = new Headers(init?.headers);
    if (init?.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${BACKEND_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const text = await response.text();
      let body: unknown = text;
      try { body = JSON.parse(text); } catch { /* non-JSON error body */ }

      if (fallback !== undefined && MOCK_MODE !== "false") {
        return delay(fallback);
      }

      const message =
        typeof body === "object" && body && "error" in body
          ? String((body as { error: unknown }).error)
          : `Request failed (${response.status})`;
      throw new ApiError(message, response.status, body);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (fallback !== undefined && MOCK_MODE !== "false") {
      return delay(fallback);
    }
    throw error;
  }
}

function query(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  dashboard: {
    get: () =>
      request<DashboardSummary>("/api/dashboard", { method: "GET" }, mockDashboard),
  },

  incidents: {
    list: (params?: { worker?: string; kind?: ResourceKind }) =>
      request<IncidentQueue>(
        `/api/incidents${query({ worker: params?.worker, kind: params?.kind })}`,
        { method: "GET" },
        {
          ...mockIncidentQueue,
          selectedWorker: params?.worker ?? mockIncidentQueue.selectedWorker,
          kind: params?.kind ?? mockIncidentQueue.kind,
        },
      ),

    get: (id: string) =>
      request<IncidentDetail>(
        `/api/incidents/${id}`,
        { method: "GET" },
        { ...mockIncidentTimeline.incident, id },
      ),

    timeline: (id: string) =>
      request<IncidentTimeline>(
        `/api/incidents/${id}/timeline`,
        { method: "GET" },
        {
          ...mockIncidentTimeline,
          incident: { ...mockIncidentTimeline.incident, id },
        },
      ),

    timelineEvent: (id: string, eventId: string) =>
      request<TimelineEventDetail>(
        `/api/incidents/${id}/timeline/${eventId}`,
        { method: "GET" },
        {
          ...mockTimelineEventDetail,
          incident: { ...mockTimelineEventDetail.incident, id },
          event: {
            ...mockTimelineEventDetail.event,
            id: eventId || MOCK_EVENT_ID,
          },
        },
      ),

    investigation: (id: string) =>
      request<Investigation>(
        `/api/incidents/${id}/investigation`,
        { method: "GET" },
        {
          ...mockInvestigation,
          incident: { ...mockInvestigation.incident, id },
        },
      ),

    applyAction: (id: string, actionId: string) =>
      request<ApplyActionResult>(
        `/api/incidents/${id}/actions/${actionId}/apply`,
        { method: "POST", body: JSON.stringify({ actionId }) },
        {
          ok: true,
          message: "Action recorded (mock)",
          redirectTo: `/private/incidents/${id}`,
        },
      ),
  },

  monitor: {
    inventory: (search?: string) =>
      request<DirectoryPage<InventoryItem>>(
        `/api/monitor/inventory${query({ q: search })}`,
        { method: "GET" },
        mockInventory,
      ),

    pods: (search?: string) =>
      request<DirectoryPage<PodItem>>(
        `/api/monitor/pods${query({ q: search })}`,
        { method: "GET" },
        mockPods,
      ),

    nodes: (search?: string) =>
      request<DirectoryPage<NodeItem>>(
        `/api/monitor/nodes${query({ q: search })}`,
        { method: "GET" },
        mockNodes,
      ),

    services: (search?: string) =>
      request<DirectoryPage<ServiceItem>>(
        `/api/monitor/services${query({ q: search })}`,
        { method: "GET" },
        mockServices,
      ),

    deployments: (search?: string) => request<DirectoryPage<InventoryItem>>(`/api/monitor/deployments${query({ q: search })}`, { method: "GET" }, undefined),

    namespaces: (search?: string) => request<DirectoryPage<InventoryItem>>(`/api/monitor/namespaces${query({ q: search })}`, { method: "GET" }, undefined),

    topology: () => request<LiveTopology>("/api/monitor/topology", { method: "GET" }, undefined),

    resource: (id: string) =>
      request<ResourceDetail>(
        `/api/monitor/resources/${id}`,
        { method: "GET" },
        { ...mockResourceDetail, id: id || MOCK_RESOURCE_ID },
      ),
  },
};

export { BACKEND_URL, MOCK_INCIDENT_ID, MOCK_RESOURCE_ID };
