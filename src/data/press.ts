import { pressItemSchema, type PressItem } from "../types/content";

export const pressItems: PressItem[] = pressItemSchema.array().parse([
  {
    link: "https://machronicle.com/elementor-81035/",
    image: "bsgrad.jpg",
    date: "August 28, 2023",
    title:
      "Tech Prodigy and Software Engineer Blake Sanie '19 Shares His Key to Success - M-A Chronicle",
  },
  {
    link: "https://www.capitalone.com/tech/culture/tech-internships-tackle-aws/",
    date: "October 18, 2023",
    image: "c1_aws.jpg",
    title: "Interns' Take on AWS Summit 2023 | Capital One",
  },
  {
    link: "https://www.cc.gatech.edu/news/professor-deploying-anti-plagiarism-detection-tool-900-student-course",
    date: "January 26, 2023",
    image: "3600.jpg",
    title:
      "Professor Deploying Anti-plagiarism Detection Tool on 900-student Course | College of Computing",
  },
  {
    link: "https://www.linkedin.com/feed/update/urn:li:activity:6833004016574840832/",
    date: "August 13 2021",
    image: "schon.jpg",
    title: "Schonfeld: Last week, we were fortunate enough to welcome our Schonfeld summer…",
  },
]);
