import { Research } from "../types";

export const research: Research[] = [
  {
    id: "earthquake-ml-duke",
    title: "Deep Learning Models for Earthquake Early Warning Systems",
    description:
      "Developed novel neural network architectures for real-time earthquake prediction and early warning systems under Prof. Dr. Henri Gavin at Duke University. Focus on improving prediction accuracy and reducing false positives in seismic event detection.",
    institution: "Duke University & IOE, Pulchowk Campus (KtmGeo Lab)",
    supervisor: ["Prof. Dr. Henri Gavin (Duke University)"],
    status: "completed",
    startDate: "2024-10",
    endDate: "2025-05",
    paperStatus: "In Preparation",
    technologies: [
      "Python",
      "PyTorch",
      "Deep Learning",
      "NumPy",
      "Pandas",
      "Scikit-learn",
    ],
    contributions: [
      "Designed and implemented neural network architectures achieving 80% accuracy",
      "Developed preprocessing pipelines for large-scale seismic datasets with advanced noise reduction techniques",
      "Created feature engineering methods for temporal seismic pattern recognition",
    ],
    metrics: [
    ],
    collaborators: ["Duke University Civil Engineering", "IOE Research Lab"],
    keywords: [
      "Earthquake Prediction",
      "Deep Learning",
      "Seismic Analysis",
      "Neural Networks",
      "Time Series Analysis",
    ],
  },
  {
    id: "v2x-5g-communication",
    title: "IoT Communication Protocols for 5G Vehicular Networks",
    description:
      "Research fellowship at LICT focusing on implementation and performance analysis of MQTT and ZeroMQ protocols for Vehicle-to-Everything (V2X) communication over 5G infrastructure. Collaboration with Universidad Politécnica de Valencia, Spain.",
    institution: "Laboratory for ICT Research and Development (LICT), IOE",
    supervisor: ["Dr. Babu R. Dawadi (IOE)", "Prof. Dr. Pietro Manzoni (UPV)"],
    status: "completed",
    startDate: "2024-04",
    endDate: "2025-04",
    paperStatus: "Accepted",
    technologies: [
      "C++",
      "OMNET++",
      "MQTT",
      "ZeroMQ",
      "5G NR",
      "IoT Protocols",
      "Network Simulation",
      "Protocol Design",
      "Linux",
    ],
    contributions: [
      "Implemented MQTT and ZeroMQ communication protocols from scratch in OMNET++ simulation environment",
      "Designed realistic 5G network topologies for urban and highway vehicular scenarios",
      "Developed performance analysis framework measuring latency, throughput, and reliability",
      "Conducted comparative analysis of protocol performance in high-mobility scenarios",
    ],
    metrics: [
    ],
    collaborators: ["Universidad Politécnica de Valencia, Spain", "LICT IOE"],
    keywords: [
      "5G Networks",
      "V2X Communication",
      "IoT Protocols",
      "MQTT",
      "ZeroMQ",
      "Network Simulation",
      "Vehicular Networks",
      "Protocol Optimization",
      "Wireless Communication",
    ],
  },
];

// Professor/Advisor information
export const advisors = [
  {
    name: "Prof. Dr. Henri Gavin",
    affiliation: "Duke University",
    position: "Professor of Civil & Environmental Engineering",
    website: "https://cee.duke.edu/faculty/henri-gavin",
    researchAreas: ["Structural Dynamics", "Earthquake Engineering"],
  },
  {
    name: "Dr. Babu R. Dawadi",
    affiliation: "IOE, Tribhuvan University",
    position: "Associate Professor",
    website: "http://baburd.com.np/",
    researchAreas: ["IoT Systems", "Network Protocols"],
  },
  {
    name: "Prof. Dr. Pietro Manzoni",
    affiliation: "Universidad Politécnica de Valencia",
    position: "Full Professor",
    website: "https://pmanzoni.notion.site/Pietro-Manzoni-s-web-page-9e8aa06b0dbb4bb38cf190d9a2e6a842",
    researchAreas: ["Vehicular Networks", "5G/6G Systems"],
  },
];

// Research interests for PhD applications
export const researchInterests = [
  {
    id: "ml-safety-critical",
    title: "Machine Learning for Safety-Critical Systems",
    description:
      "Developing robust and reliable ML models for real-time safety-critical applications such as earthquake early warning, autonomous systems, and infrastructure monitoring.",
    keywords: [
      "Deep Learning",
      "Real-time ML",
      "Safety-Critical Systems",
      "Edge Computing",
      "Robust AI",
    ],
    relatedProjects: ["earthquake-ml-duke", "distributed-neural-network"],
  },
  {
    id: "next-gen-networks",
    title: "Next-Generation Network Protocols",
    description:
      "Research in 5G/6G network protocols, IoT communication systems, and low-latency networking for vehicular and edge computing applications.",
    keywords: [
      "5G/6G",
      "V2X Communication",
      "IoT Protocols",
      "Network Optimization",
      "Edge Computing",
    ],
    relatedProjects: ["v2x-5g-communication"],
  },
  {
    id: "distributed-ml",
    title: "Distributed Machine Learning Systems",
    description:
      "Building scalable distributed ML frameworks for training and inference across heterogeneous computing resources.",
    keywords: [
      "Distributed Systems",
      "Federated Learning",
      "Edge ML",
      "Systems for ML",
    ],
    relatedProjects: ["distributed-neural-network"],
  },
];

// Helper functions
export const getOngoingResearch = (): Research[] => {
  return research.filter((r) => r.status === "ongoing");
};

export const getCompletedResearch = (): Research[] => {
  return research.filter((r) => r.status === "completed");
};

export const getPublishedResearch = (): Research[] => {
  return research.filter((r) => r.status === "published");
};

export const getResearchByKeyword = (keyword: string): Research[] => {
  return research.filter((r) =>
    r.keywords?.some((k) => k.toLowerCase().includes(keyword.toLowerCase()))
  );
};

export const getResearchStats = () => {
  const total = research.length;
  const completed = getCompletedResearch().length;
  const published = getPublishedResearch().length;
  const accepted = research.filter((r) => r.paperStatus === "Accepted").length;

  return {
    total,
    completed,
    published,
    accepted,
    collaborations: 2, // Duke + Spain
    totalMetrics: research.reduce((acc, r) => acc + (r.metrics?.length || 0), 0),
  };
};