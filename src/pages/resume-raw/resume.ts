const resume: Resume = {
  name: "Blake Sanie",
  occupation: "Software Engineer",
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
          title: "Associate Software Engineer",
          city: "Chicago",
          stateAbbreviation: "IL",
          startMonth: 2,
          startYear: 2024,
          bullets: ["", "", ""],
        },
        {
          title: "Software Engineering Intern",
          city: "New York",
          stateAbbreviation: "NY",
          startMonth: 6,
          startYear: 2023,
          endMonth: 8,
          endYear: 2023,
          bullets: ["", "", ""],
        },
        {
          title: "Software Engineering Intern",
          city: "Chicago",
          stateAbbreviation: "IL",
          startMonth: 6,
          startYear: 2022,
          endMonth: 8,
          endYear: 2022,
          bullets: ["", "", ""],
        },
      ],
    },
    {
      company: "Schonfeld Strategic Advisors",
      positions: [
        {
          title: "Software Engineering Intern",
          city: "New York",
          stateAbbreviation: "NewYork",
          startMonth: 6,
          startYear: 2021,
          endMonth: 8,
          endYear: 2021,
          bullets: ["", "", ""],
        },
      ],
    },
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
  stateAbbreviation: string;
  startMonth: number;
  startYear: number;
  endMonth?: number;
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
