import { Skill, Education, Certification, ContactInfo, ResearchInterest } from "../types";

export const skills: Skill[] = [
  {
    category: "Programming Languages",
    skills: [
      "TypeScript/JavaScript",
      "Python",
      "C/C++",
      "Golang",
      "SQL",
      "Shell Scripting",
    ],
    proficiency: "advanced",
  },
  {
    category: "Frontend Development",
    skills: [
      "Next.js",
      "React.js",
      "Redux.js",
      "HTML5",
      "CSS/Tailwind CSS",
      "Responsive Design",
      "UI/UX",
    ],
    proficiency: "advanced",
  },
  {
    category: "Backend Development",
    skills: [
      "NestJS",
      "Express.js",
      "tRPC",
      "Django",
      "Django REST Framework",
      "Node.js",
      "API Design",
      "Microservices",
    ],
    proficiency: "advanced",
  },
  {
    category: "Databases & Data",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "SQL",
      "Data Modeling",
      "ODK Collect",
      "ODK Central",
      "Data Visualization",
    ],
    proficiency: "advanced",
  },
  {
    category: "DevOps & Cloud",
    skills: [
      "Docker",
      "Kubernetes",
      "Jenkins",
      "Kafka",
      "AWS (EC2, S3, Lambda)",
      "CI/CD",
      "Nginx",
      "PM2",
      "Coolify",
    ],
    proficiency: "advanced",
  },
  {
    category: "AI & Embedded Systems",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "Embedded Systems",
      "UAVs",
      "Avionics",
      "IoT",
    ],
    proficiency: "intermediate",
  },
];

export const education: Education[] = [
  {
    id: "ioe-bachelor",
    institution: "Tribhuvan University, IOE, Pulchowk Campus",
    degree: "Bachelor of Engineering (B.E.)",
    field: "Electronics, Communication and Information Engineering",
    startDate: "2021-05",
    endDate: "2025-05",
    gpa: "",
    location: "Pulchowk Campus, Lalitpur, Nepal",
    description:
      "Comprehensive engineering program with focus on electronics, communication systems, information theory, and signal processing. Strong foundation in mathematics, algorithms, and systems design.",
    relevantCoursework: [
      "Data Structures & Algorithms",
      "Digital Signal Processing",
      "Communication Systems",
      "Computer Networks",
      "Machine Learning",
      "Operating Systems",
      "Microprocessor Systems",
      "Information Theory",
      "Probability & Statistics",
      "Network Programming",
    ],
    achievements: [
      "Active member of IEEE Student Branch (Chair 2023-2024)",
      "Creative Director at IEEE Pulchowk Student Branch",
      "Executive Committee Member at Pulchowk Music Club",
    ],
  },
  {
    id: "sos-plus2",
    institution: "SOS Hermann Gmeiner School, Sanothimi, Bhaktapur, Nepal",
    degree: "+2 Science",
    field: "Physics and Mathematics",
    startDate: "2019",
    endDate: "2021",
    gpa: "A+",
    location: "Sanothimi, Bhaktapur, Nepal",
    description:
      "Higher secondary education with strong foundation in science and mathematics. Grade 11: Physics, Chemistry, Mathematics, English, Biology (Minor). Grade 12: Physics, Chemistry, Mathematics (Major), English, Nepali.",
    achievements: [
      "Achieved Grade A+",
      "Bestmanship Awardee 2019",
      "Music Club President",
    ],
  },
];

export const certifications: Certification[] = [
  // Add certifications here if available
];

export const contactInfo: ContactInfo = {
  email: "sarbagyaghoshrestha@gmail.com",
  phone: "+977 9851402011",
  linkedin: "https://linkedin.com/in/sarbagyashrestha",
  github: "https://github.com/fernsky",
  location: "Kathmandu, Nepal",
  website: "https://sarbagyaghoshrestha.dev",
  cv: "/build/resume/sarbagya-gho-shrestha-cv.pdf",
};

// Areas of Interest
export const researchInterests: ResearchInterest[] = [
  {
    id: "digital-governance",
    title: "Digital Governance & E-Government Solutions",
    description:
      "Architecting scalable, secure platforms for public administration and civic digitization. Building end-to-end systems that bridge field operations with cloud infrastructure, enabling data-driven decision making for local governments.",
    keywords: [
      "E-Governance",
      "Digital Transformation",
      "Civic Tech",
      "Full Stack Development",
      "Cloud Architecture",
      "Data Systems",
    ],
    relatedProjects: ["digital-epalika", "icms"],
  },
  {
    id: "ai-embedded",
    title: "AI & Embedded Systems",
    description:
      "Exploring the intersection of artificial intelligence and hardware design. Interest in embedded systems, UAVs, avionics, and IoT applications where software intelligence meets physical systems.",
    keywords: [
      "Machine Learning",
      "Embedded Systems",
      "UAVs",
      "Avionics",
      "IoT",
      "Edge Computing",
    ],
    relatedProjects: [],
  },
  {
    id: "scalable-systems",
    title: "Scalable Distributed Systems",
    description:
      "Designing and implementing high-performance distributed systems using modern technologies like Kafka, Kubernetes, and microservices architecture. Focus on building systems that can handle real-world scale and complexity.",
    keywords: [
      "Distributed Systems",
      "Microservices",
      "Kafka",
      "Kubernetes",
      "System Design",
      "DevOps",
    ],
    relatedProjects: [],
  },
];

// Languages
export const languages = [
  { name: "English", level: "Fluent (Proficient)" },
  { name: "Nepali", level: "Native" },
  { name: "Newari", level: "Native" },
  { name: "Hindi", level: "Intermediate" },
];

// Academic Skills & Competencies
export const academicSkills = [
  "Research Design & Methodology",
  "Technical Writing",
  "Data Analysis & Visualization",
  "Literature Review",
  "Experimental Design",
  "Performance Analysis",
  "Mathematical Modeling",
  "Scientific Programming",
  "Presentation & Communication",
  "Collaborative Research",
];

// Helper functions
export const getAllSkills = (): string[] => {
  return skills.reduce((allSkills, skillCategory) => {
    return [...allSkills, ...skillCategory.skills];
  }, [] as string[]);
};

export const getSkillsByProficiency = (
  proficiency: Skill["proficiency"]
): Skill[] => {
  return skills.filter((skill) => skill.proficiency === proficiency);
};

export const getSkillCount = (): number => {
  return skills.reduce((count, skillCategory) => {
    return count + skillCategory.skills.length;
  }, 0);
};

export const getEducationById = (id: string): Education | undefined => {
  return education.find((edu) => edu.id === id);
};

export const getResearchInterestById = (id: string): ResearchInterest | undefined => {
  return researchInterests.find((ri) => ri.id === id);
};