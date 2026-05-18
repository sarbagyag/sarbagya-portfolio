import { Experience } from "../types";

export const experience: Experience[] = [
  {
    id: "isrc-ninja-combined",
    title: "Full Stack Engineer & DevOps Lead → Tech Lead",
    company: "Intensive Study and Research Center (ISRC), later Ninja Infosys",
    location: "Kathmandu, Nepal",
    type: "job",
    startDate: "2024-01",
    endDate: "2026-02",
    description:
      "Drove large-scale digital transformation across Nepal's municipal governance ecosystem — from building survey and digital profile infrastructure for 10+ municipalities, to leading architecture for platforms serving 50+ municipalities and 100+ government websites.",
    responsibilities: [
      "Deployed digital profile systems for 10+ municipalities including Pokhara Metropolitan City in 4 months with a 2-person team, serving 100,000+ citizens",
      "Built a Survey Management System with custom ODK Fetcher processing 100,000+ survey responses with real-time analytics and live monitoring",
      "Managed end-to-end DevOps pipelines (CI/CD, Docker, AWS EC2/S3, MinIO, Jenkins) ensuring 99.9% uptime for resource-constrained regions",
      "Trained 300+ local officials and enumerators in digital tools for sustainable civic digitization",
    ],
    technologies: [
      "Next.js",
      "NestJS",
      "tRPC",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "AWS",
      "MinIO",
      "ODK Collect/Central",
      "Nginx",
    ],
    achievements: [
      "10+ municipal digital profiles deployed in 4 months with a 2-person team",
      "100,000+ survey responses processed with real-time analytics",
      "300+ local officials trained in digital tools",
    ],
    subRoles: [
      {
        title: "Tech Lead",
        company: "Ninja Infosys",
        startDate: "2025-02",
        endDate: "2026-02",
        description:
          "Led technical architecture for Digital e-Palika and the Integrated Content Management System — a distributed, event-driven microservices platform powering national-scale governance infrastructure.",
        responsibilities: [
          "Led technical architecture for Digital e-Palika platform serving 50+ municipalities, streamlining citizen services, revenue collection, and grievance handling",
          "Architected the ICMS powering 100+ government websites nationwide on a distributed, event-driven microservices architecture built for high availability",
          "Coordinated cross-functional teams to deliver governance solutions while maintaining scalability, resilience, and security across containerised deployments",
        ],
        technologies: [
          "Next.js",
          "NestJS",
          "Kafka",
          "Kubernetes",
          "PostgreSQL",
          "Docker",
          "Redis",
          "CI/CD",
        ],
        achievements: [
          "100+ government websites powered by the ICMS platform",
          "Digital e-Palika platform serving 50+ municipalities",
        ],
      },
    ],
  },
  {
    id: "mandala-foods-consultant",
    title: "AI & Automation Consultant",
    company: "Mandala Foods",
    location: "Remote, Nepal",
    type: "job",
    startDate: "2026-01",
    description:
      "Sole technical architect for a purpose-driven fruit upcycling startup, building AI and automation infrastructure from the ground up. Designed conversational AI systems and self-hosted production infrastructure to streamline operations and enable intelligent commerce.",
    responsibilities: [
      "Designed and deployed Maya — an internal RAG-based knowledge chatbot for querying SOPs and operational documentation through natural language",
      "Architected Maya Genie, a multi-channel conversational commerce platform (WhatsApp, Viber, Messenger) with a Go-based message orchestration gateway, LangChain RAG core, and Nepal payment integrations (Khalti, eSewa)",
      "Built a public-facing product chatbot on a loosely coupled microservices architecture with independently deployable channels, orchestration, and cognitive core",
      "Engineered a Go document sync service processing Vikunja task attachments (XLSX, CSV, DOCX) and auto-uploading to Google Drive to feed the n8n RAG embedding pipeline",
      "Self-hosted and maintained a production VPS (Ubuntu 24.04, 12-core AMD EPYC, 48 GB RAM) running 10+ Dockerised services including n8n, Supabase, Traefik, Open WebUI, and a Claude API proxy",
      "Built n8n automation workflows for document ingestion, Gemini-powered embedding pipelines, operational reporting, and industry news digests",
    ],
    technologies: [
      "Go",
      "Python",
      "LangChain",
      "n8n",
      "Docker",
      "Supabase (pgvector)",
      "Anthropic Claude API",
      "Redis",
      "RAG Architecture",
      "Microservices",
      "Traefik",
      "Open WebUI",
    ],
    achievements: [
      "Maya Genie submitted to the AI by HER: Global Impact Challenge",
      "10+ Dockerised production services self-hosted on a single VPS with full observability",
      "Multi-channel commerce platform spanning WhatsApp, Viber, and Messenger",
    ],
  },
  {
    id: "ibtidaa-fullstack",
    title: "Full Stack Developer",
    company: "Ibtidaa Softwares Pvt. Ltd.",
    location: "Nepal",
    type: "job",
    startDate: "2023-10",
    endDate: "2024-12",
    description:
      "Developed and maintained full-stack applications including 'Bidesh' App and Website for RP Srijan Way To Success using Next.js, and an Event Management and Visualization Tool using Django and JavaScript for Shramik Sanjal.",
    responsibilities: [
      "Developed and maintained 'Bidesh' App and Website using Next.js",
      "Built Event Management and Visualization Tool using Django and JavaScript",
      "Served as Tech Lead for development projects",
      "Implemented data visualization features using Chart.js",
    ],
    technologies: [
      "Next.js",
      "PostgreSQL",
      "NestJS",
      "Express.js",
      "MongoDB",
      "Jenkins",
      "Redux.js",
      "Node.js",
      "JavaScript",
      "React.js",
      "Django REST Framework",
      "Python",
      "Chart.js",
    ],
    achievements: [
      "Successfully delivered multiple full-stack applications",
      "Led technical development as Tech Lead",
    ],
  },
  {
    id: "ieee-chair",
    title: "Chair",
    company: "IEEE Pulchowk Student Branch",
    location: "Lalitpur District, Nepal",
    type: "internship",
    startDate: "2023-04",
    endDate: "2024-06",
    description:
      "Led IEEE Pulchowk Student Branch as Chair, organizing technical events, workshops, and coordinating student activities.",
    responsibilities: [
      "Led the IEEE Pulchowk Student Branch as Chair",
      "Organized technical events and workshops",
      "Coordinated student activities and initiatives",
      "Managed branch operations and member engagement",
    ],
    technologies: [
      "Leadership",
      "Event Management",
      "Team Coordination",
      "Technical Workshops",
    ],
    achievements: [
      "Successfully led the student branch for over a year",
      "Organized multiple technical events and workshops",
    ],
  },
  {
    id: "ieee-creative",
    title: "Creative Director",
    company: "IEEE Pulchowk Student Branch",
    location: "Pulchowk",
    type: "internship",
    startDate: "2023-03",
    endDate: "2024-05",
    description:
      "Served as Creative Director for IEEE Pulchowk Student Branch, managing creative content and visual communications for the branch.",
    responsibilities: [
      "Managed creative content for IEEE Pulchowk Student Branch",
      "Designed visual communications and promotional materials",
      "Coordinated creative initiatives and campaigns",
    ],
    technologies: [
      "Creative Design",
      "Visual Communications",
      "Content Management",
    ],
    achievements: [
      "Enhanced branch visibility through creative initiatives",
    ],
  },
  {
    id: "pulchowk-music",
    title: "Executive Committee Member",
    company: "Pulchowk Music Club And Research Center",
    location: "Pulchowk, Lalitpur, Nepal",
    type: "internship",
    startDate: "2022-05",
    endDate: "2023-07",
    description:
      "Served as Executive Committee Member at Pulchowk Music Club And Research Center, contributing to music-related activities and events.",
    responsibilities: [
      "Participated in executive committee decisions",
      "Organized music events and activities",
      "Contributed to club operations and management",
    ],
    technologies: [
      "Music",
      "Event Organization",
      "Committee Management",
    ],
    achievements: [],
  },
  {
    id: "pointzeroo-frontend",
    title: "Frontend Developer",
    company: "PointZeroo",
    location: "Nepal",
    type: "job",
    startDate: "2022-03",
    endDate: "2022-09",
    description:
      "Maintained an e-commerce website and developed a web application for SSoChe, Pulchowk Campus, focusing on frontend development with modern web technologies.",
    responsibilities: [
      "Maintained an e-commerce website",
      "Developed a web application for SSoChe, Pulchowk Campus",
      "Implemented frontend features using HTML5, CSS, and JavaScript",
      "Worked with SQL databases for data management",
    ],
    technologies: [
      "JavaScript",
      "HTML5",
      "CSS",
      "SQL",
      "Front-End Development",
    ],
    achievements: [
      "Successfully maintained and enhanced e-commerce platform",
      "Delivered web application for educational institution",
    ],
  },
  {
    id: "ryc-global-officer",
    title: "Officer",
    company: "RYC Global",
    location: "",
    type: "job",
    startDate: "2020-03",
    endDate: "2022-08",
    description:
      "Served as an Officer at RYC Global, contributing to organizational operations and initiatives.",
    responsibilities: [
      "Managed organizational operations",
      "Coordinated with team members on various initiatives",
      "Contributed to organizational growth and development",
    ],
    technologies: [
      "Operations Management",
      "Team Coordination",
    ],
    achievements: [],
  },
];

// Helper functions
export const getCurrentExperience = (): Experience[] => {
  return experience.filter(
    (exp) => !exp.endDate || new Date(exp.endDate) > new Date()
  );
};

export const getResearchExperience = (): Experience[] => {
  return experience.filter((exp) => exp.type === "research");
};

export const getExperienceById = (id: string): Experience | undefined => {
  return experience.find((exp) => exp.id === id);
};

export const getExperienceDuration = (exp: Experience): string => {
  const start = new Date(exp.startDate);
  const end = exp.endDate ? new Date(exp.endDate) : new Date();

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));

  if (diffMonths < 1) {
    return "< 1 month";
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    if (remainingMonths === 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    } else {
      return `${years} yr${years > 1 ? "s" : ""} ${remainingMonths} mo`;
    }
  }
};

export const getTotalResearchMonths = (): number => {
  return getResearchExperience().reduce((total, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    return total + diffMonths;
  }, 0);
};

export const getExperienceStats = () => {
  const total = experience.length;
  const research = getResearchExperience().length;
  const current = getCurrentExperience().length;
  const totalResearchMonths = getTotalResearchMonths();

  return {
    total,
    research,
    current,
    totalResearchMonths,
    internationalCollaborations: 2, // Duke + Spain
  };
};