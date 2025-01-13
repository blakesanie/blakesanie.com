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
          startMonth: 12,
          startYear: 2022,
          gradMonth: 12,
          gradYear: 2023,
          majors: ["Computer Science"],
          notes: "Machine Learning Concentration",
        },
        {
          type: "Bachelors of Science",
          typeAbbreviation: "B.S.",
          startMonth: 8,
          startYear: 2019,
          gradMonth: 12,
          gradYear: 2022,
          majors: ["Computer Science"],
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
      bullets: ["", "", ""],
    },
    {
      name: "Quantitative Research Platform",
      bullets: ["", "", ""],
    },
  ],
  interests: ["", "", ""],
  skillset: [
    {
      domain: "Machine Learning",
      skills: ["Pytorch", "NumPy", "Pandas"],
    },
    {
      domain: "Data Management",
      skills: ["SQL", "Databricks", "DynamoDB"],
    },
    {
      domain: "Cloud Engineering",
      skills: ["AWS", "Fargate", "Lambda"],
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
  skillset?: SkillDomain[];
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
  startMonth: number;
  startYear: number;
  gradMonth: number;
  gradYear: number;
  majors: string[];
  minors?: string[];
  notes?: string;
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
  bullets: string[];
}

interface SkillDomain {
  domain: string;
  skills: string[];
}
