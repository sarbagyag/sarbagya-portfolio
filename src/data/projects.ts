import { Project } from "../types";

export const projects: Project[] = [
  {
    id: "eshasan",
    title: "eShasan: The OS for Digital Governance",
    description:
      "The comprehensive digital ecosystem driving the modernization of Nepal's public sector. A Multi-Tenant Digital Governance Platform unifying internal office automation, public service delivery, and citizen engagement.",
    longDescription:
      "Architected by Ninja Infosys, eShasan represents the cutting edge of GovTech engineering. It transforms complex bureaucratic processes into a streamlined, reactive digital experience using a Cloud-Native Microservices Architecture. The platform integrates Office Automation (Darta Chalani) with a robust Integrated Content Management System (ICMS), breaking down administrative silos. Features a modular Microfrontend architecture (Module Federation), polyglot backend services (Go, NestJS), and event-driven consistency via Apache Kafka. Containerized on Docker and orchestrated via Kubernetes for national-scale resilience.",
    technologies: [
      "Next.js",
      "Module Federation",
      "Go",
      "NestJS",
      "Kafka",
      "Kubernetes",
      "Docker",
      "Microservices",
    ],
    featured: true,
    category: "systems",
    startDate: "2024-01",
    status: "ongoing",
    impact: "Future-proof digital infrastructure for national-scale governance",
    metrics: [
      "Multi-Tenant Architecture",
      "Unified Command & Control (C2)",
      "Digital Office Automation",
      "100+ Government Portals",
    ],
  },
  {
    id: "8bit-breadboard-computer",
    title: "8-bit Breadboard Computer (Ben Eater Inspired)",
    description:
      "Built a complete 8-bit computer from scratch on breadboards inspired by Ben Eater's design. 6th semester minor project at IOE Pulchowk Campus featuring custom-built 128-bit RAM due to IC unavailability.",
    longDescription:
      "Designed and constructed a fully functional 8-bit computer from the ground up using discrete logic ICs, inspired by Ben Eater's architecture. As BEI students passionate about the intricate dance between hardware and software, Rohit Joshi, Yugal Pariyar, and I delved deep into computer architecture, building every component manually on breadboards. Faced with IC unavailability challenges, we innovatively created a homemade 128-bit RAM module, demonstrating our problem-solving abilities and determination. The project encompasses the complete architecture: ALU, control unit, registers, program counter, instruction decoder, clock module, and output display. This hardware-focused project exemplifies our passion for deep understanding of technology from first principles.",
    technologies: [
      "Digital Logic",
      "Computer Architecture",
      "74-series Logic ICs",
      "Breadboard Design",
      "Hardware Engineering",
      "ALU Design",
      "Control Unit",
      "Custom RAM",
    ],
    liveUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7199849262543749120/",
    featured: true,
    category: "systems",
    startDate: "2024-01",
    endDate: "2024-05",
    status: "completed",
    impact: "Deep understanding of computer architecture from first principles",
    metrics: [
      "Custom 128-bit RAM module",
      "Complete 8-bit CPU implementation",
      "Hardware-only design",
      "3-person team achievement",
    ],
  },
  {
    id: "municipal-digital-profiles",
    title: "Municipal Digital Profile Platform",
    description:
      "Architected and deployed comprehensive digital profile systems for 10+ municipalities across Nepal, including Pokhara Metropolitan City. Built end-to-end platform transforming civic data into accessible, analytics-ready systems for local governance.",
    longDescription:
      "Led the design and implementation of digital profile platforms for over 10 municipalities in just 4 months with a 2-person team (Sarbagya & Trilochan Bhusal). Built complete full-stack systems featuring real-time data visualization, interactive dashboards, and citizen information portals. The platform integrates field data collection (ODK), automated data processing pipelines, and responsive web interfaces serving thousands of citizens. Deployed on scalable cloud infrastructure with CI/CD pipelines ensuring 99.9% uptime.",
    technologies: [
      "Next.js",
      "NestJS",
      "tRPC",
      "PostgreSQL",
      "TypeScript",
      "Docker",
      "Vercel",
      "ODK Central",
      "Data Visualization",
      "Responsive Design",
    ],
    liveUrl: "https://pokhara.digprofile.com/en",
    featured: true,
    category: "systems",
    startDate: "2024-09",
    endDate: "2025-01",
    status: "completed",
    impact: "Digitized 10+ municipalities, serving 100,000+ citizens",
    metrics: [
      "10+ municipalities digitized in 4 months",
      "2-person team achievement",
      "100,000+ citizen records processed",
      "99.9% platform uptime",
    ],
  },
  {
    id: "survey-management-system",
    title: "Survey Management System (SMS)",
    description:
      "Full-scale web platform for live monitoring, analytics, and visualization of municipal field surveys. Real-time dashboards enabling data-driven decisions for local administrations before survey completion.",
    longDescription:
      "Engineered a comprehensive Survey Management System integrating field data collection with cloud-based analytics. Built custom ODK Fetcher (NestJS-based parser) to automate data flow from ODK Collect mobile app to centralized PostgreSQL database. Created real-time dashboards using Next.js and tRPC showing live survey progress, building counts, demographic analytics, and geographic visualizations. Enabled local governments to monitor enumeration teams, track survey completion rates, and identify data quality issues in real-time. System processed 100,000+ survey responses across multiple municipalities.",
    technologies: [
      "Next.js",
      "NestJS",
      "tRPC",
      "PostgreSQL",
      "TypeScript",
      "ODK Collect",
      "ODK Central",
      "Data Visualization",
      "Real-time Analytics",
      "Chart.js",
      "Docker",
    ],
    liveUrl: "https://duduwa-admin.vercel.app/",
    featured: true,
    category: "systems",
    startDate: "2024-09",
    endDate: "2025-01",
    status: "completed",
    impact: "Enabled real-time field survey monitoring for 10+ municipalities",
    metrics: [
      "100,000+ survey responses processed",
      "Real-time monitoring for 10+ municipalities",
      "Custom ODK integration pipeline",
      "Live analytics dashboards",
    ],
  },
  {
    id: "icms-platform",
    title: "Integrated Content Management System (ICMS)",
    description:
      "Enterprise-scale CMS platform powering 100+ government websites across Nepal. Designed and engineered at Ninja Infosys for unified digital governance at national scale.",
    longDescription:
      "Architected and led development of ICMS, a comprehensive content management system now serving 100+ government institutions across Nepal. The platform provides unified website management, content publishing workflows, document management, citizen service portals, and analytics dashboards. Built with modern tech stack incorporating Kafka for event streaming, Kubernetes for orchestration, and microservices architecture for scalability. Enables municipalities and government agencies to maintain professional web presence with minimal technical expertise while ensuring security, compliance, and performance at scale.",
    technologies: [
      "Next.js",
      "NestJS",
      "Kafka",
      "Kubernetes",
      "PostgreSQL",
      "Docker",
      "Microservices",
      "TypeScript",
      "Redis",
      "CI/CD",
    ],
    liveUrl: "http://sddodang.lumbini.gov.np/ne",
    featured: true,
    category: "systems",
    startDate: "2025-06",
    status: "ongoing",
    impact: "Powering 100+ government websites nationwide",
    metrics: [
      "100+ government sites live",
      "National-scale deployment",
      "Microservices architecture",
      "Event-driven with Kafka",
    ],
  },
];

// Helper functions
export const getFeaturedProjects = (): Project[] => {
  return projects.filter((project) => project.featured);
};

export const getProjectsByCategory = (
  category: Project["category"]
): Project[] => {
  return projects.filter((project) => project.category === category);
};

export const getProjectById = (id: string): Project | undefined => {
  return projects.find((project) => project.id === id);
};

export const getProjectStats = () => {
  const total = projects.length;
  const featured = projects.filter((p) => p.featured).length;
  const withPapers = projects.filter((p) => p.paperUrl).length;
  const withMetrics = projects.filter((p) => p.metrics && p.metrics.length > 0).length;

  return {
    total,
    featured,
    withPapers,
    withMetrics,
    byCategory: {
      ml: getProjectsByCategory("ml").length,
      systems: getProjectsByCategory("systems").length,
      networks: getProjectsByCategory("networks").length,
    },
  };
};