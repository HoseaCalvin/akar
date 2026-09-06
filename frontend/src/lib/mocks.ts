import type {
  DashboardSummary,
  DirectoryPage,
  IncidentQueue,
  IncidentTimeline,
  Investigation,
  InventoryItem,
  NodeItem,
  PodItem,
  ResourceDetail,
  ServiceItem,
  TimelineEventDetail,
} from "./types";

export const MOCK_INCIDENT_ID = "inc-4082";
export const MOCK_EVENT_ID = "evt-config-change";
export const MOCK_RESOURCE_ID = "postgresql-primary";

export const mockDashboard: DashboardSummary = {
  greetingName: "Zick",
  counts: { nodes: 12, pods: 84, deployments: 24, services: 18, namespaces: 3 },
  health: {
    critical: 20,
    high: 30,
    medium: 10,
    low: 40,
    healthyPercent: 64.24,
    label: "Healthy",
  },
  performance: {
    mttdMinutes: 2.4,
    mttrMinutes: 47,
    rcaMinutes: 47,
    series: [
      { time: "10:00", cpu: 42, ram: 65 },
      { time: "11:00", cpu: 55, ram: 68 },
      { time: "12:00", cpu: 48, ram: 72 },
      { time: "13:00", cpu: 67, ram: 78 },
      { time: "14:00", cpu: 73, ram: 81 },
      { time: "15:00", cpu: 61, ram: 76 },
    ],
  },
  recentIncidents: [
    { id: MOCK_INCIDENT_ID, title: "Spiking storage usage", service: "payment-service", severity: "Critical" },
    { id: "inc-4081", title: "Checkout latency", service: "checkout-svc", severity: "High" },
    { id: "inc-4079", title: "Replica lag", service: "postgresql-primary", severity: "Critical" },
    { id: "inc-4074", title: "Ingress 5xx burst", service: "nginx-ingress", severity: "Low" },
  ],
  activeInvestigations: 2,
};

export const mockIncidentQueue: IncidentQueue = {
  workers: ["worker-01", "worker-02"],
  selectedWorker: "worker-01",
  kind: "pods",
  activeCount: 2,
  incidents: [
    {
      id: MOCK_INCIDENT_ID,
      code: "INC-4082",
      title: "Storage & DB Conn Failure",
      namespace: "production-db",
      rootCauseLabel: "postgresql-primary (Root Cause)",
      severity: "Critical",
      status: "In Progress",
      isActive: true,
      summary: "High error rate",
      occurredAgo: "4 mins ago",
      metrics: { cpu: 92, memory: 89, restarts: 6, confidence: 85 },
      workflowStatus: "In Progress",
    },
    {
      id: "inc-4081",
      code: "INC-4081",
      title: "Checkout latency",
      namespace: "production-api",
      rootCauseLabel: "api-server",
      severity: "High",
      status: "Open",
      isActive: false,
      summary: "P95 latency above SLO",
      occurredAgo: "18 mins ago",
      metrics: { cpu: 71, memory: 64, restarts: 1, confidence: 72 },
      workflowStatus: "Open",
    },
    {
      id: "inc-4074",
      code: "INC-4074",
      title: "Ingress 5xx burst",
      namespace: "ingress-nginx",
      rootCauseLabel: "nginx-ingress",
      severity: "Low",
      status: "Resolved",
      isActive: false,
      summary: "Transient 5xx",
      occurredAgo: "2 hours ago",
      metrics: { cpu: 31, memory: 54, restarts: 0, confidence: 61 },
      workflowStatus: "Resolved",
    },
  ],
  preview: {
    name: "order-svc-4082",
    namespace: "default",
    node: "worker-01",
    createdAt: "May 16, 2025 10:24:17",
    isActive: true,
  },
};

const incidentDetail = {
  id: MOCK_INCIDENT_ID,
  code: "INC-4082",
  title: "Storage & DB Conn Failure",
  status: "Recovered" as const,
  severity: "Critical" as const,
  duration: "23m 14s",
  startTime: "Aug 22, 2026 15:15:08",
  endTime: "Aug 22, 2026 15:41:56",
  affectedService: "pymt-svc",
  environment: "production",
  owner: "xyz-team",
  sinceLabel: "Since 15:18 (32m)",
};

export const mockIncidentTimeline: IncidentTimeline = {
  incident: incidentDetail,
  events: [
    {
      id: MOCK_EVENT_ID,
      time: "15:15:08",
      title: "Deployment / Config Change",
      description: ["Connection pool size changed", "From 50→75 in pymt-svc"],
      color: "#FF0000",
      details: [
        { label: "Change by", value: "Jane Doe" },
        { label: "Type", value: "Config Change" },
        { label: "Resource", value: "config/checkout-db.yaml" },
      ],
    },
    {
      id: "evt-first-anomaly",
      time: "15:18:42",
      title: "First Anomaly Detected",
      description: ["PostgreSQL timeout errors increased", "Error rate raised to 2.3% (threshold: 1%)"],
      color: "#F1272D",
      details: [
        { label: "Metric", value: "postgresql.timeout" },
        { label: "Value", value: "2.3%" },
        { label: "Threshold", value: ">1%" },
      ],
    },
    {
      id: "evt-downstream",
      time: "15:19:02",
      title: "Downstream Anomalies",
      description: ["Payment latency increased", "3 Pods affected, error rate 2.8%"],
      color: "#F45B1B",
      details: [
        { label: "Affected Pods", value: "3" },
        { label: "Latency", value: "3.6s (259%)" },
        { label: "Error Rate", value: "2.8%" },
      ],
    },
    {
      id: "evt-detected",
      time: "15:19:27",
      title: "Incident Detected",
      description: ["AKAR detected an incident and", "created INC-4082"],
      color: "#F39A18",
      details: [
        { label: "Severity", value: "Critical", valueColor: "text-red-500" },
        { label: "Impact", value: "High" },
        { label: "Status", value: "Open" },
      ],
    },
    {
      id: "evt-rca",
      time: "15:27:13",
      title: "RCA Identified",
      description: ["PostgreSQL connection pool exhaustion", "confidence 94%"],
      color: "#F2C318",
      details: [
        { label: "Root Cause", value: "Connection pool exhaustion" },
        { label: "Confidence", value: "94%" },
        { label: "Signals", value: "4 supporting, 1 contradicting" },
      ],
    },
    {
      id: "evt-remediation",
      time: "15:30:02",
      title: "Remediation Executed",
      description: ["Rollback config change", "Connection pool size reverted to 50"],
      color: "#E9EE13",
      details: [
        { label: "Action", value: "rollback configuration" },
        { label: "By", value: "John Doe" },
        { label: "Status", value: "Success", valueColor: "text-green-600" },
      ],
    },
    {
      id: "evt-recovered",
      time: "15:41:56",
      title: "Service Recovered",
      description: ["Rollback config change", "Connection pool size reverted to 50"],
      color: "#36E51F",
      details: [
        { label: "Error Rate", value: "0%" },
        { label: "Latency", value: "240ms" },
        { label: "Status", value: "Recovered", valueColor: "text-green-600" },
      ],
    },
  ],
};

export const mockTimelineEventDetail: TimelineEventDetail = {
  event: mockIncidentTimeline.events[0],
  incident: {
    ...incidentDetail,
    title: "Storage & DB Conn Failure",
  },
  windowLabel: "May 22, 2026 15:15 - 15:41 (26m 14s)",
  changeBy: "Jane Doe",
  type: "Config Change",
  resource: "config/checkout-db.yaml",
  changeId: "CFG-93217",
  leadTimeLabel: "3m 34s before first anomaly detected",
  summary: "Connection pool size changed from 50 → 70 in pymt-svc deployment",
  configDiff: {
    file: "config/checkout-db.yaml",
    lines: [
      { number: "12", text: "database:", kind: "key" },
      { number: "13", text: "host: postgres-primary.checkout.svc.cluster.local", kind: "normal" },
      { number: "14", text: "port: 5432", kind: "normal" },
      { number: "15", text: "pool:", kind: "key" },
      { number: "16", text: "maxOpenConns: 75", kind: "removed" },
      { number: "17", text: "maxIdleConns: 20", kind: "added" },
      { number: "18", text: "connMaxLifetime: 30m", kind: "normal" },
    ],
  },
  signals: [
    { title: "Database Connections (active)", value: "56", suffix: "connections", type: "database", sparkline: [18, 22, 20, 28, 24, 35, 48, 44, 70, 58, 82, 56, 60, 58, 72, 80, 64, 74, 60, 80] },
    { title: "Checkout Error Rate", value: "0.2%", suffix: "", type: "error", sparkline: [18, 20, 19, 30, 22, 38, 50, 44, 72, 68, 58, 78, 55, 74, 52, 55, 62, 52, 62, 78] },
  ],
  aiImpact: {
    headline: "This change increased the database connection pool size",
    body: "Higher pool size may increase database load and connection if not matched with database capacity",
    riskLevel: "Medium",
    potentialImpact: "Performance Degradation",
    likelihood: "Possible (42%)",
    whyItMatters: "Increasing the connection pool may lead to connection exhaustion, timeouts and cascading failures if the database cannot handle the additional connections",
  },
  relatedEvents: [
    {
      id: "evt-first-anomaly",
      time: "15:18:42",
      title: "First Anomaly Detected",
      color: "red",
      description: "PostgreSQL timeout errors increased\nError rate raised to 2.3% (threshold: 1%)",
      metric: "postgresql.timeout",
    },
    {
      id: "evt-downstream",
      time: "15:19:02",
      title: "Downstream Anomalies",
      color: "orange",
      description: "Payment latency increased\n3 Pods affected, error rate 2.8%",
      metric: "3",
      metricLabel: "Affected Pods",
    },
  ],
  correlationNote:
    "This change occurred 3m 34s before the first anomaly and is correlated with the incidents AKAR identified it as a potential contributing factor",
};

export const mockInvestigation: Investigation = {
  incident: {
    ...incidentDetail,
    title: "PostgreSQL Connection Timeout Errors",
    status: "Open",
    endTime: null,
  },
  rootCause: {
    prediction: "PostgreSQL connection pool exhaustion",
    confidence: 94,
  },
  impact: {
    description: "3 services, 2 pods, 1 datastore",
    percent: 95,
    label: "Critical",
  },
  userImpact: {
    description: "Payment failures -2.3% requests failed",
    percent: 80,
    label: "Critical",
  },
  mttr: { value: "12m", label: "Ongoing", target: "Target <30m" },
  rcaDetection: { value: "4m 14s", label: "Current", target: "Target <5m" },
  topology: {
    nodes: [
      { id: "web", title: "Web App", status: "Healthy", kind: "web", critical: false, position: { left: "18.5%", top: "5%", width: "23%" } },
      { id: "gateway", title: "API Gtw", status: "Healthy", kind: "gateway", critical: false, position: { left: "3%", top: "47%", width: "20%" } },
      { id: "payment", title: "Payment Service", status: "Critical", subtitle: "12 pods affected", kind: "service", critical: true, position: { left: "33%", top: "43%", width: "28%" } },
      { id: "pg-primary", title: "PostgreSQL primary", status: "Critical", subtitle: "Connection pod exhausted", kind: "db", critical: true, position: { left: "66%", top: "5%", width: "30%" } },
      { id: "pg-replica", title: "PostgreSQL replica", status: "Healthy", kind: "db", critical: false, position: { left: "68.5%", top: "78%", width: "30%" } },
    ],
    edges: [
      { from: "web", to: "payment", critical: false, path: "M 415 47 L 475 47 L 475 123" },
      { from: "gateway", to: "payment", critical: false, path: "M 230 158 L 330 158" },
      { from: "payment", to: "pg-primary", critical: true, path: "M 540 128 C 525 100, 645 50, 650 48" },
      { from: "payment", to: "pg-replica", critical: false, path: "M 510 160 C 530 220, 560 245, 685 250" },
    ],
  },
  analysisReasons: [
    "Connection pool utilization > 95% for 4m",
    "Spike in connection timeout errors (2.3k/min)",
    "Checkout service errors correlated (r = 0.92)",
    "Started right after pool size change (50 → 75)",
    "No abnormality in network, CPU, or memory",
  ],
  alternatives: [
    { label: "Database slow query", value: "18%" },
    { label: "Network latency to DB", value: "8%" },
    { label: "Pod resource exhaustion", value: "5%" },
  ],
  evidence: [
    { id: "ev-1", time: "15:24:10", ago: "4 mins ago", title: "Database Connection Errors Spiked", type: "Metric", relevance: "98%", source: "Prometheus", component: "postgresql-primary", sparkline: [20, 24, 18, 32, 26, 40, 52, 48, 78, 62, 82, 55, 58, 54, 68, 78], sparklineColor: "red" },
    { id: "ev-2", time: "15:24:05", ago: "4 mins ago", title: "PostgreSQL Connection Timeout Errors", type: "Log", relevance: "95%", source: "app-logs", component: "pymt-svc" },
    { id: "ev-3", time: "15:23:58", ago: "5 mins ago", title: "Database Response Time Increased", type: "Metric", relevance: "90%", source: "Prometheus", component: "postgresql-primary", sparkline: [20, 22, 22, 28, 34, 42, 50, 46, 74, 58, 76, 52, 55, 42, 32, 36], sparklineColor: "orange" },
  ],
  recommendedAction: {
    id: "act-increase-pool",
    title: "Increase connection pool size",
    description: "Increase PostgreSQL connection pool size to 100 or rollback to previous configuration.",
    expectedImpact: "Restore connections and reduce timeout errors",
    confidence: "High (91%)",
    riskLevel: "Medium",
    manualOnly: true,
  },
};

const directoryCounts = { inventory: 114, pods: 84, services: 18, nodes: 12, deployments: 24, namespaces: 3 };

export const mockInventory: DirectoryPage<InventoryItem> = {
  counts: directoryCounts,
  highlights: [
    { title: "Kubernetes Nodes", value: "12", description: "12/12 Ready", tone: "ok" },
    { title: "Running Pods", value: "84", description: "2 Anomalous", tone: "critical" },
    { title: "Microservices", value: "18", description: "4 Degraded", tone: "warning" },
    { title: "Namespaces", value: "6", description: "production, staging...", tone: "neutral" },
  ],
  items: [
    { id: MOCK_RESOURCE_ID, name: "postgresql-primary-0", description: "Port: 8080/TCP", type: "StatefulSet Pod", namespace: "production-db", cpuRam: "42% / 99.8%", status: "Critical" },
    { id: "redis-cache", name: "redis-cache-0", description: "Port: 6379/TCP", type: "StatefulSet Pod", namespace: "production-cache", cpuRam: "78% / 91.4%", status: "High" },
    { id: "nginx-ingress", name: "nginx-ingress-controller", description: "Port: 443/TCP", type: "Deployment Pod", namespace: "ingress-nginx", cpuRam: "31% / 64.2%", status: "Low" },
    { id: "api-server", name: "api-server-7d9f8c6b5", description: "Port: 8080/TCP", type: "Deployment Pod", namespace: "production-api", cpuRam: "86% / 94.7%", status: "Critical" },
    { id: "worker-node-01", name: "worker-node-01", description: "Port: 9090/TCP", type: "DaemonSet Pod", namespace: "production-worker", cpuRam: "67% / 82.3%", status: "High" },
    { id: "frontend-web", name: "frontend-web-5c8d7f9b", description: "Port: 3000/TCP", type: "Deployment Pod", namespace: "production-web", cpuRam: "24% / 51.6%", status: "Low" },
  ],
};

export const mockPods: DirectoryPage<PodItem> = {
  counts: directoryCounts,
  highlights: [
    { title: "Total Pods", value: "84", description: "across 6 namespaces", tone: "neutral" },
    { title: "Healthy Pods", value: "81", description: "96.4% Operational", tone: "ok" },
    { title: "Anomalous / Restart", value: "3", description: "Attention Required", tone: "critical" },
    { title: "Crash Loop Detected", value: "1", description: "xyz-service-pod-02", tone: "warning" },
  ],
  items: [
    { id: MOCK_RESOURCE_ID, name: "postgresql-primary-0", description: "Port: 5432/TCP", nodeHost: "worker-node-01", namespace: "production-db", restarts: 2, cpuRam: "42% / 78.4%", status: "Critical" },
    { id: "redis-cache", name: "redis-cache-0", description: "Port: 6379/TCP", nodeHost: "worker-node-02", namespace: "production-cache", restarts: 0, cpuRam: "68% / 82.1%", status: "High" },
    { id: "nginx-ingress", name: "nginx-ingress-7d9f8c6b5", description: "Port: 443/TCP", nodeHost: "worker-node-03", namespace: "ingress-nginx", restarts: 1, cpuRam: "31% / 54.6%", status: "Low" },
    { id: "api-server", name: "api-server-6f4d8c7b9", description: "Port: 8080/TCP", nodeHost: "worker-node-01", namespace: "production-api", restarts: 7, cpuRam: "89% / 93.7%", status: "Critical" },
  ],
};

export const mockServices: DirectoryPage<ServiceItem> = {
  counts: directoryCounts,
  highlights: [
    { title: "Total Services", value: "18", description: "ClusterIP & Ingress", tone: "neutral" },
    { title: "Normal Traffic", value: "15", description: "83.3% Nominal", tone: "ok" },
    { title: "Degraded / 5XX Spikes", value: "3", description: "Cascading Latency", tone: "critical" },
    { title: "Avg Services Latency", value: "180ms", description: "Spike (P95)", tone: "warning" },
  ],
  items: [
    { id: "pymt-svc", name: "pymt-svc", typeProtocol: "ClusterIP / TCP", namespace: "production-payment", targetPods: 12, latencyP95: "3.6s", status: "Critical" },
    { id: "checkout-svc", name: "checkout-svc", typeProtocol: "ClusterIP / TCP", namespace: "production-api", targetPods: 6, latencyP95: "420ms", status: "High" },
    { id: "web-svc", name: "web-svc", typeProtocol: "Ingress / HTTPS", namespace: "production-web", targetPods: 4, latencyP95: "84ms", status: "Low" },
  ],
};

export const mockNodes: DirectoryPage<NodeItem> = {
  counts: directoryCounts,
  highlights: [
    { title: "Total Nodes", value: "12", description: "12/12 Ready", tone: "ok" },
    { title: "Healthy Nodes", value: "10", description: "83.3% Nominal", tone: "ok" },
    { title: "Pressure / NotReady", value: "2", description: "Memory pressure", tone: "critical" },
    { title: "Avg Node CPU", value: "61%", description: "Cluster wide", tone: "warning" },
  ],
  items: [
    { id: "worker-node-01", hostname: "worker-node-01", role: "worker", versionOs: "v1.29 / Ubuntu 22.04", activePods: 18, cpuRam: "71% / 82%", status: "High" },
    { id: "worker-node-02", hostname: "worker-node-02", role: "worker", versionOs: "v1.29 / Ubuntu 22.04", activePods: 14, cpuRam: "42% / 99%", status: "Critical" },
    { id: "control-plane-01", hostname: "control-plane-01", role: "control-plane", versionOs: "v1.29 / Ubuntu 22.04", activePods: 8, cpuRam: "24% / 41%", status: "Low" },
  ],
};

export const mockResourceDetail: ResourceDetail = {
  id: MOCK_RESOURCE_ID,
  name: "postgresql-primary (StatefulSet DB)",
  namespace: "production-db",
  cluster: "k8s-prod-01",
  nodeHost: "worker-node-02",
  ip: "10.244.2.18",
  image: "postgres:15.3-alpine",
  uptime: "14d 6h",
  linkedIncident: { id: MOCK_INCIDENT_ID, code: "INC-4082", label: "Root Cause" },
  window: "Last 30m",
  metrics: [
    { id: "connections", title: "Active Connections vs Max Limit", centerText: "Max Limit: 100 conns", status: "99.8% (Exhausted)", tone: "critical", color: "#FF3B3B", sparkline: [12, 14, 15, 16, 18, 22, 40, 78, 96, 99] },
    { id: "cpu-ram", title: "CPU Usage & Memory Allocation", status: "CPU 42% • RAM 68%", tone: "ok", color: "#2D9B81", sparkline: [48, 50, 52, 51, 55, 53, 58, 56, 62, 64] },
    { id: "disk", title: "Disk Read/Write Latency (ms)", status: "Avg. 3.4ms", tone: "muted", color: "#6E42D5", sparkline: [40, 40, 41, 42, 38, 32, 48, 36, 60, 44] },
  ],
  logs: [
    { time: "14:07:20", level: "info", message: "LOG: database system is ready" },
    { time: "14:07:22", level: "error", message: "FATAL: remaining connection slots are reserved for non-superuser connections" },
    { time: "14:07:24", level: "warn", message: "pg_stat_activity: active=99, idle=1" },
    { time: "14:07:26", level: "error", message: "ERROR: conn pool rejected client" },
    { time: "14:07:29", level: "debug", message: "otel-collector: metric pushed" },
    { time: "14:07:35", level: "warn", message: "healthcheck probe failed: 500 error" },
  ],
  traces: [
    { id: "8f21bc90a", name: "POST /checkout", duration: "4,821ms", status: "504 Timeout", ok: false },
    { id: "2a77cc01d", name: "GET /inventory", duration: "34ms", status: "200 OK", ok: true },
  ],
};
