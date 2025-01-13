const resume: Resume = {
  name: "Blake Sanie",
  occupation: "Software Engineer",
  email: "blake@sanie.com",
  website: "blakesanie.com",
  location: "Chicago, IL",
  phone: 6509245614,
  education: [
    {
      school: "Georgia Institute of Technology",
      city: "Atlanta",
      stateAbbreviation: "GA",
      degrees: [
        {
          type: "Masters of Science",
          typeAbbreviation: "M.S.",
          startMonth: "Dec",
          startYear: 2022,
          gradMonth: "Dec",
          gradYear: 2023,
          majors: [{ name: "Computer Science", focus: "Machine Learning" }],
          gpa: 4,
          notes: "Machine Learning Concentration",
        },
        {
          type: "Bachelors of Science",
          typeAbbreviation: "B.S.",
          startMonth: "Aug",
          startYear: 2019,
          gradMonth: "Dec",
          gradYear: 2022,
          gpa: 4,
          majors: [
            {
              name: "Computer Science",
            },
          ],
          notes: "Artificial Intelligence and Information Networks",
        },
      ],
    },
  ],
  employment: [
    {
      company: "Capital One Financial",
      positions: [
        {
          title: "Senior Software Engineer",
          team: "Core Processing Abstraction Layer (Card Accounts)",
          city: "Chicago",
          stateAbbreviation: "IL",
          startMonth: "Jan",
          startYear: 2025,
          bullets: [
            "Tripled streaming throughput by socializing Kafka & GoLang concurrency patterns, yielding landmark framework contribution.",
            "Emerged as SME of Change Data Capture, applying in-depth DynamoDB & Lambda grasp toward reconciliation data lake archive.",
            "Solidified platform reliability through serverless retry layer, circuit breaker mechanism, seamless emulation for component tests.",
            "Bridged architectural gaps with Transactions teams by pioneering code generation utility, hosting weekly knowledge transfers.",
          ],
        },
        {
          title: "Associate Software Engineer",
          team: "Core Processing Abstraction Layer (Card Accounts)",
          city: "Chicago",
          stateAbbreviation: "IL",
          startMonth: "Feb",
          startYear: 2024,
          endMonth: "Dec",
          endYear: 2024,
          bullets: [
            "Drove standardized monitoring workflow consensus among senior leadership and architects, following high-severity incident.",
            "Uncovered 3K account-level attribute discrepancies and updated code-level derivations, amidst source-of-record migration.",
            "Exceeded team scope by inner-sourcing critical API features, advising interns, fabricating domain-knowledge chrome extension.",
          ],
        },
      ],
    },
    {
      company: "College of Computing, Georgia Institute of Technology",
      positions: [
        {
          title: "Head Graduate Teaching Assistant",
          team: "Artificial Intelligence (CS 3600) with Dr. Mark Riedl, Dr. Thad Starner",
          city: "Atlanta",
          stateAbbreviation: "GA",
          startMonth: "Aug",
          startYear: 2021,
          endMonth: "Dec",
          endYear: 2023,
          bullets: [
            "Facilitated hybrid lectures for 1700+ students by providing first-hand presentation aid to professor, coordinating specialized content among staff, preparing stimulating exercises, moderating student discussions, and integrating weekly feedback.",
            "Eliminated 90% of plagiarism by adopting project watermarking initiative and Stanford's MOSS tool alongside AI research lab",
          ],
        },
      ],
    },
    // {
    //   company: "Capital One Financial",
    //   positions: [
    //     {
    //       title: "Software Engineering Intern",
    //       team: "CML",
    //       city: "New York",
    //       stateAbbreviation: "NY",
    //       startMonth: "Jun",
    //       startYear: 2023,
    //       endMonth: "Aug",
    //       endYear: 2023,
    //       bullets: [
    //         "Informed hundred-million-dollar loan decisions by achieving 80x data sync speedup between decentralized underwriter databases.",
    //         "Evolved data sync mechanism into debut enterprise platform with native streaming, background validation, self-onboarding.",
    //         "Awarded first-place hackathon project among 700 competitors: todo-focused generative AI Slack channel summarization.",
    //       ],
    //     },
    //     {
    //       title: "Software Engineering Intern",
    //       team: "Core Data & Machine Learning",
    //       city: "Chicago",
    //       stateAbbreviation: "IL",
    //       startMonth: "Jun",
    //       startYear: 2022,
    //       endMonth: "Aug",
    //       endYear: 2022,
    //       bullets: [
    //         "Amplified petabyte-scale PII detection accuracy from 50% to 99% with transformer networks, NLP tokenization schemes.",
    //         "Established continuous training pipeline to strengthen inference from real-world misclassifications & client feedback.",
    //       ],
    //     },
    //   ],
    // },
    // {
    //   company: "Schonfeld Strategic Advisors",
    //   positions: [
    //     {
    //       title: "Software Engineering Intern",
    //       team: "Treasury Technology",
    //       city: "New York",
    //       stateAbbreviation: "NewYork",
    //       startMonth: "Jun",
    //       startYear: 2021,
    //       endMonth: "Aug",
    //       endYear: 2021,
    //       bullets: [
    //         "Oversaw creation of broker simulation microservice, modeling multi billion-dollar short allocation system with 150K daily volume.",
    //         "Coordinated between MS, GS, and JPM to integrate locates services alongside admin dashboards with overriding broker controls.",
    //       ],
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Learned Early Exit Network (LeeNet)",
      team: "Georgia Institute of Technology",
      bullets: [
        "A novel Deep Learning architecture with dynamic exiting at intermediate layers based on self-learned confidence thresholds.",
        "Awarded project of the year in Georgia Tech's graduate Big Data course, highlighting the demonstrated potential in model efficiency.",
      ],
    },
    {
      name: "Distal Radius Object Identification (DROID)",
      team: "Emory Department of Orthopaedics",
      bullets: [
        "Realtime iOS wrist implant manufacturer detection from X-Ray imaging, aiming to reduce emergency extraction complications.",
        "Presented to top-industry surgeons to align use cases and unravel underlying K-means, PCA, RANSAC, transfer learning methods",
      ],
    },
  ],
  interests: [
    "Ironman triathlon",
    "French cuisine",
    "landscape photography",
    "chess",
    "blues guitar",
    "hydroponic gardening",
    "graphic design",
  ],
  skills: [
    {
      domain: "Advanced AWS",
      skills: ["Fargate", "Lambda", "DynamoDB"],
    },
    {
      domain: "Monitoring",
      skills: ["CloudWatch", "NewRelic", "Splunk"],
    },
    {
      domain: "Machine Learning",
      skills: ["PyTorch", "NumPy", "Spark"],
    },
    {
      domain: "Full Stack",
      skills: ["GoLang", "JavaScript", "React.js"],
    },
    {
      domain: "Streaming",
      skills: ["Kafka, SQS, gRPC"],
    },
    {
      domain: "Databases",
      skills: ["SQL", "Redis", "Firebase"],
    },
  ],
  competencies: [
    "Leadership",
    "critical thinking",
    "production support",
    "cost optimization",
    "dependency coordination",
    "French fluency",
  ],
  certifications: [
    {
      name: "AWS Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      notes: [
        "Deep intuition towards implementing scalable, available, durable, resilient, cost-effective cloud initiatives with 50+ AWS services",
      ],
    },
    {
      name: "Code Secure Software Engineer (CSSE)",
      issuer: "Capital One",
      notes: [
        "Defense against Code Injection, XSS, Access Control, and Session Handling vulnerabilities at both service and system-level",
      ],
    },
  ],
};

export default resume;

interface Resume {
  name: string;
  occupation: string;
  location: string;
  email: string;
  phone: number;
  website?: string;
  education?: Education[];
  employment?: Employer[];
  projects?: Project[];
  interests?: string[];
  skills?: SkillDomain[];
  competencies: string[];
  certifications: Certification[];
}

interface Education {
  school: string;
  city: string;
  stateAbbreviation: string;
  degrees: Degree[];
}

interface Degree {
  type: string;
  typeAbbreviation: string;
  startMonth: string;
  startYear: number;
  gradMonth: string;
  gradYear: number;
  majors: Major[];
  minors?: string[];
  notes?: string;
  gpa: number;
}

interface Employer {
  company: string;
  positions: Position[];
}

interface Position {
  title: string;
  city: string;
  team: string;
  stateAbbreviation: string;
  startMonth: string;
  startYear: number;
  endMonth?: string;
  endYear?: number;
  bullets: string[];
}

interface Project {
  name: string;
  team?: string;
  bullets: string[];
}

interface SkillDomain {
  domain: string;
  skills: string[];
}

interface Major {
  name: string;
  focus?: string;
}

interface Certification {
  name: string;
  issuer: string;
  notes: string[];
}
