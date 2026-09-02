export type Severity = "Critical" | "High" | "Medium" | "Low";
export type IncidentStatus = "Open" | "In Progress" | "Recovered" | "Resolved";
export type ResourceKind = "pods" | "services";
export type HighlightTone = "neutral" | "ok" | "warning" | "critical";
export type LogLevel = "info" | "error" | "warn" | "debug";
export type TopologyKind = "web" | "gateway" | "service" | "db";

export type HighlightStat = {
  title: string;
  value: string;
  description: string;
  tone: HighlightTone;
};

export type DirectoryCounts = {
  inventory: number;
  pods: number;
  services: number;
  nodes: number;
};

export type TimeSeriesPoint = {
  time: string;
  cpu: number;
  ram: number;
};

export type DashboardSummary = {
  greetingName: string;
  counts: {
    nodes: number;
    pods: number;
    containers: number;
    services: number;
  };
  health: {
    critical: number;
    high: number;
    low: number;
    healthyPercent: number;
    label: string;
  };
  performance: {
    mttdMinutes: number;
    mttrMinutes: number;
    rcaMinutes: number;
    series: TimeSeriesPoint[];
  };
  recentIncidents: {
    id: string;
    title: string;
    service: string;
    severity: Severity;
  }[];
  activeInvestigations: number;
};

export type IncidentListItem = {
  id: string;
  code: string;
  title: string;
  namespace: string;
  rootCauseLabel: string;
  severity: Severity;
  status: IncidentStatus;
  isActive: boolean;
  summary: string;
  occurredAgo: string;
  metrics: {
    cpu: number;
    memory: number;
    restarts: number;
    confidence: number;
  };
  workflowStatus: string;
};

export type IncidentPreview = {
  name: string;
  namespace: string;
  node: string;
  createdAt: string;
  isActive: boolean;
};

export type IncidentQueue = {
  workers: string[];
  selectedWorker: string;
  kind: ResourceKind;
  activeCount: number;
  incidents: IncidentListItem[];
  preview: IncidentPreview | null;
};

export type IncidentDetail = {
  id: string;
  code: string;
  title: string;
  status: IncidentStatus;
  severity: Severity;
  duration: string;
  startTime: string;
  endTime: string | null;
  affectedService: string;
  environment: string;
  owner: string;
  sinceLabel: string;
};

export type TimelineDetailField = {
  label: string;
  value: string;
  valueColor?: string;
};

export type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  description: string[];
  color: string;
  details: TimelineDetailField[];
};

export type IncidentTimeline = {
  incident: IncidentDetail;
  events: TimelineEvent[];
};

export type ConfigLine = {
  number: string;
  text: string;
  kind: "normal" | "added" | "removed" | "key";
};

export type RelatedSignal = {
  title: string;
  value: string;
  suffix: string;
  type: "database" | "error";
  sparkline: number[];
};

export type RelatedTimelineEvent = {
  id: string;
  time: string;
  title: string;
  color: "red" | "orange";
  description: string;
  metric: string;
  metricLabel?: string;
};

export type TimelineEventDetail = {
  event: TimelineEvent;
  incident: IncidentDetail;
  windowLabel: string;
  changeBy?: string;
  type?: string;
  resource?: string;
  changeId?: string;
  leadTimeLabel: string;
  summary: string;
  configDiff?: {
    file: string;
    lines: ConfigLine[];
  };
  signals: RelatedSignal[];
  aiImpact: {
    headline: string;
    body: string;
    riskLevel: string;
    potentialImpact: string;
    likelihood: string;
    whyItMatters: string;
  };
  relatedEvents: RelatedTimelineEvent[];
  correlationNote: string;
};

export type TopologyNode = {
  id: string;
  title: string;
  status: string;
  subtitle?: string;
  critical: boolean;
  kind: TopologyKind;
  position: {
    left: string;
    top: string;
    width: string;
  };
};

export type TopologyEdge = {
  from: string;
  to: string;
  critical: boolean;
  path: string;
};

export type EvidenceItem = {
  id: string;
  time: string;
  ago: string;
  title: string;
  type: string;
  relevance: string;
  source: string;
  component: string;
  sparkline?: number[];
  sparklineColor?: "red" | "orange";
};

export type Investigation = {
  incident: IncidentDetail;
  rootCause: {
    prediction: string;
    confidence: number;
  };
  impact: {
    description: string;
    percent: number;
    label: string;
  };
  userImpact: {
    description: string;
    percent: number;
    label: string;
  };
  mttr: {
    value: string;
    label: string;
    target: string;
  };
  rcaDetection: {
    value: string;
    label: string;
    target: string;
  };
  topology: {
    nodes: TopologyNode[];
    edges: TopologyEdge[];
  };
  analysisReasons: string[];
  alternatives: {
    label: string;
    value: string;
  }[];
  evidence: EvidenceItem[];
  recommendedAction: {
    id: string;
    title: string;
    description: string;
    expectedImpact: string;
    confidence: string;
    riskLevel: string;
    manualOnly: boolean;
  };
};

export type ApplyActionResult = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  type: string;
  namespace: string;
  cpuRam: string;
  status: Severity;
};

export type PodItem = {
  id: string;
  name: string;
  description: string;
  nodeHost: string;
  namespace: string;
  restarts: number;
  cpuRam: string;
  status: Severity;
};

export type NodeItem = {
  id: string;
  hostname: string;
  role: string;
  versionOs: string;
  activePods: number;
  cpuRam: string;
  status: Severity;
};

export type ServiceItem = {
  id: string;
  name: string;
  typeProtocol: string;
  namespace: string;
  targetPods: number;
  latencyP95: string;
  status: Severity;
};

export type DirectoryPage<T> = {
  counts: DirectoryCounts;
  highlights: HighlightStat[];
  items: T[];
};

export type ResourceMetric = {
  id: string;
  title: string;
  centerText?: string;
  status: string;
  tone: "critical" | "ok" | "muted";
  sparkline: number[];
  color: string;
};

export type ResourceLog = {
  time: string;
  level: LogLevel;
  message: string;
};

export type ResourceTrace = {
  id: string;
  name: string;
  duration: string;
  status: string;
  ok: boolean;
};

export type ResourceDetail = {
  id: string;
  name: string;
  namespace: string;
  cluster: string;
  nodeHost: string;
  ip: string;
  image: string;
  uptime: string;
  linkedIncident?: {
    id: string;
    code: string;
    label: string;
  };
  window: string;
  metrics: ResourceMetric[];
  logs: ResourceLog[];
  traces: ResourceTrace[];
};
