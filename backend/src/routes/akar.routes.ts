import { Router } from "express";

const router = Router();
async function get(path: string) {
	const core = (process.env.AKAR_CORE_URL || "http://localhost:8088").replace(/\/$/, "");
  const response = await fetch(`${core}${path}`, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`AKAR Core ${response.status}`);
  return response.json() as Promise<any>;
}

function severity(status = "") {
  const value = status.toUpperCase();
  if (value.includes("FAIL") || value.includes("NOT_READY")) return "Critical";
  if (value.includes("UNKNOWN") || value.includes("DEGRADED")) return "Medium";
  return "Low";
}

function incidentStatus(status = "") {
  if (status === "RESOLVED") return "Resolved";
  if (status === "VERIFIED" || status === "RECOVERED") return "Recovered";
  return status === "OPEN" ? "Open" : "In Progress";
}

function counts(topology: any) {
  const entities = topology.entities || [];
  const count = (kind: string) => entities.filter((x: any) => x.kind === kind).length;
  return { inventory: entities.length, pods: count("POD"), services: count("SERVICE"), nodes: count("NODE"), deployments: count("DEPLOYMENT"), namespaces: new Set(entities.map((x: any) => x.namespace).filter(Boolean)).size };
}

router.get("/dashboard", async (_req, res) => {
  try {
    const [topology, incidents] = await Promise.all([get("/api/v1/topology"), get("/api/v1/incidents")]);
    const entities = topology.entities || [];
    const nodes = entities.filter((x: any) => x.kind === "NODE");
    const pods = entities.filter((x: any) => x.kind === "POD");
    const services = entities.filter((x: any) => x.kind === "SERVICE");
    const deployments = entities.filter((x: any) => x.kind === "DEPLOYMENT");
    const namespaces = new Set(entities.map((x: any) => x.namespace).filter(Boolean));
    const active = incidents.filter((x: any) => !["RESOLVED", "ESCALATED", "FAILED"].includes(x.status));
    const critical = entities.filter((x: any) => severity(x.status) === "Critical").length;
    const medium = entities.filter((x: any) => severity(x.status) === "Medium").length;
    res.json({ greetingName: "Engineer", counts: { nodes: nodes.length, pods: pods.length, deployments: deployments.length, services: services.length, namespaces: namespaces.size }, health: { critical, high: 0, medium, low: 0, healthyPercent: entities.length ? Math.round(((entities.length - critical - medium) / entities.length) * 100) : 0, label: critical ? "Attention required" : medium ? "Degraded" : "Healthy" }, performance: { mttdMinutes: 0, mttrMinutes: 0, rcaMinutes: 0, series: [] }, recentIncidents: incidents.slice(-4).reverse().map((x: any) => ({ id: x.id, title: `Incident ${x.id}`, service: x.affected_entities?.[0] || x.namespace, severity: x.status === "ESCALATED" ? "High" : "Low" })), activeInvestigations: active.length });
  } catch (error) { res.status(502).json({ error: error instanceof Error ? error.message : "AKAR Core unavailable" }); }
});

router.get("/monitor/inventory", async (req, res) => {
  try {
    const topology = await get("/api/v1/topology");
    const q = String(req.query.q || "").toLowerCase();
    const items = (topology.entities || []).filter((x: any) => `${x.name} ${x.namespace || ""} ${x.kind}`.toLowerCase().includes(q)).map((x: any) => ({ id: x.id, name: x.name, description: x.status || "UNKNOWN", type: x.kind, namespace: x.namespace || "cluster", cpuRam: "N/A", status: severity(x.status) }));
    res.json({ counts: counts(topology), highlights: [{ title: "Resources", value: String(items.length), description: "Live AKAR topology", tone: "neutral" }], items });
  } catch (error) { res.status(502).json({ error: error instanceof Error ? error.message : "AKAR Core unavailable" }); }
});

router.get("/monitor/pods", async (req, res) => {
  try {
    const topology = await get("/api/v1/topology"); const q = String(req.query.q || "").toLowerCase();
    const items = (topology.entities || []).filter((x: any) => x.kind === "POD" && `${x.name} ${x.namespace || ""}`.toLowerCase().includes(q)).map((x: any) => ({ id: x.id, name: x.name, description: x.status || "UNKNOWN", nodeHost: x.attributes?.node_host || "not scheduled", namespace: x.namespace || "demo", restarts: Number(x.attributes?.restarts || 0), cpuRam: x.attributes?.requests || "not requested", status: severity(x.status) }));
    res.json({ counts: counts(topology), highlights: [{ title: "Pods", value: String(items.length), description: "Live AKAR topology", tone: "neutral" }], items });
  } catch (error) { res.status(502).json({ error: error instanceof Error ? error.message : "AKAR Core unavailable" }); }
});

router.get("/monitor/nodes", async (req, res) => {
  try {
    const topology = await get("/api/v1/topology"); const q = String(req.query.q || "").toLowerCase();
    const items = (topology.entities || []).filter((x: any) => x.kind === "NODE" && x.name.toLowerCase().includes(q)).map((x: any) => ({ id: x.id, hostname: x.name, role: x.attributes?.role || "not reported", versionOs: x.attributes?.version_os || "not reported", activePods: Number(x.attributes?.active_pods || 0), cpuRam: x.attributes?.capacity || "not reported", status: severity(x.status) }));
    res.json({ counts: counts(topology), highlights: [{ title: "Nodes", value: String(items.length), description: "Live AKAR topology", tone: "neutral" }], items });
  } catch (error) { res.status(502).json({ error: error instanceof Error ? error.message : "AKAR Core unavailable" }); }
});

router.get("/monitor/services", async (req, res) => {
  try {
    const topology = await get("/api/v1/topology"); const q = String(req.query.q || "").toLowerCase();
    const items = (topology.entities || []).filter((x: any) => x.kind === "SERVICE" && `${x.name} ${x.namespace || ""}`.toLowerCase().includes(q)).map((x: any) => ({ id: x.id, name: x.name, typeProtocol: x.attributes?.type_protocol || "not reported", namespace: x.namespace || "demo", targetPods: (topology.edges || []).filter((e: any) => e.source === x.id && e.relationship_type === "ROUTES_TO").length, latencyP95: x.attributes?.latency_p95 || "not observed", status: severity(x.status) }));
    res.json({ counts: counts(topology), highlights: [{ title: "Services", value: String(items.length), description: "Live AKAR topology", tone: "neutral" }], items });
  } catch (error) { res.status(502).json({ error: error instanceof Error ? error.message : "AKAR Core unavailable" }); }
});

router.get("/monitor/deployments", async (req, res) => {
  try {
    const topology = await get("/api/v1/topology"); const q = String(req.query.q || "").toLowerCase();
    const items = (topology.entities || []).filter((x: any) => x.kind === "DEPLOYMENT" && `${x.name} ${x.namespace || ""}`.toLowerCase().includes(q)).map((x: any) => ({ id: x.id, name: x.name, description: x.attributes?.replicas || x.status || "UNKNOWN", type: "DEPLOYMENT", namespace: x.namespace || "demo", cpuRam: "not reported", status: severity(x.status) }));
    res.json({ counts: counts(topology), highlights: [{ title: "Deployments", value: String(items.length), description: "Live AKAR topology", tone: "neutral" }], items });
  } catch (error) { res.status(502).json({ error: error instanceof Error ? error.message : "AKAR Core unavailable" }); }
});

router.get("/monitor/namespaces", async (req, res) => {
  try {
    const topology = await get("/api/v1/topology"); const q = String(req.query.q || "").toLowerCase(); const entities = topology.entities || [];
    const names = [...new Set(entities.map((x: any) => x.namespace).filter(Boolean) as string[])].filter((name) => name.toLowerCase().includes(q));
    const items = names.map((name) => { const members = entities.filter((x: any) => x.namespace === name); return { id: `namespace/${name}`, name, description: `${members.filter((x: any) => x.kind === "DEPLOYMENT").length} deployments, ${members.filter((x: any) => x.kind === "POD").length} pods`, type: "NAMESPACE", namespace: "cluster", cpuRam: "N/A", status: severity(members.some((x: any) => x.status !== "HEALTHY") ? "UNKNOWN" : "HEALTHY") }; });
    res.json({ counts: counts(topology), highlights: [{ title: "Namespaces", value: String(items.length), description: "Live AKAR topology", tone: "neutral" }], items });
  } catch (error) { res.status(502).json({ error: error instanceof Error ? error.message : "AKAR Core unavailable" }); }
});

router.get("/monitor/topology", async (_req, res) => {
  try {
    res.json(await get("/api/v1/topology"));
  } catch (error) { res.status(502).json({ error: error instanceof Error ? error.message : "AKAR Core unavailable" }); }
});

router.get("/incidents", async (_req, res) => {
  try {
    const incidents = await get("/api/v1/incidents");
    const mapped = incidents.map((x: any) => ({ id: x.id, code: x.id, title: `Incident ${x.id}`, namespace: x.namespace, rootCauseLabel: x.rca_result?.candidates?.[0]?.entity || "Pending RCA", severity: x.status === "ESCALATED" ? "High" : "Low", status: incidentStatus(x.status), isActive: !["RESOLVED", "ESCALATED", "FAILED"].includes(x.status), summary: x.recovery_status?.reasons?.[0] || x.investigation_result?.summary || "Awaiting investigation", occurredAgo: new Date(x.created_at).toLocaleString(), metrics: { cpu: 0, memory: 0, restarts: 0, confidence: x.rca_result?.candidates?.[0]?.model_score || 0 }, workflowStatus: x.status }));
    res.json({ workers: ["akar-core"], selectedWorker: "akar-core", kind: "pods", activeCount: mapped.filter((x: any) => x.isActive).length, incidents: mapped, preview: null });
  } catch (error) { res.status(502).json({ error: error instanceof Error ? error.message : "AKAR Core unavailable" }); }
});

export default router;
