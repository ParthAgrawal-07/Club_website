// src/data/members.ts
// AI Club Members Data — generated from club form responses

export interface Member {
  id: number;
  name: string;
  photo: string; // ← add your photo URL here
  description: string;
  github?: string;
  linkedin?: string;
  events: string[];
  internship?: string;
  blog?: string;
}

export const members: Member[] = [
  {
    id: 1,
    name: "Saumya Shah",
    photo: "", // TODO: add photo URL
    description:
      "Passionate about AI/ML and full-stack development. Built an F1 prediction platform combining live standings with machine-learning-powered race forecasts.",
    github: "https://github.com/saumyashah0510",
    linkedin: "https://www.linkedin.com/in/saumya-shah-5bb8602b4/",
    events: ["EDA Session", "Linear Regression", "Wearable AI"],
  },
  {
    id: 2,
    name: "Sanket Agarwal",
    photo: "", // TODO: add photo URL
    description:
      "Strong interest in problem-solving and competitive programming, now extending that mindset into AI. Excited to explore how AI can be used to build intelligent and impactful solutions.",
    linkedin:
      "https://www.linkedin.com/in/sanket-agarwal-2b606b3a3",
    events: ["Worldquant"],
  },
  {
    id: 3,
    name: "Parth Garg",
    photo: "", // TODO: add photo URL
    description:
      "Enthusiastic learner with interests across AI, mathematics, and programming. Active participant in a wide range of club events and competitions.",
    github: "https://github.com/gargparth2406-creator",
    linkedin:
      "https://www.linkedin.com/in/parth-garg-024b40379",
    events: [
      "Worldquant",
      "Integration Bee",
      "EDA Session",
      "Intro To Python",
      "Linear Regression",
      "Wearable AI",
    ],
  },
  {
    id: 4,
    name: "Manal Patel",
    photo: "", // TODO: add photo URL
    description:
      "Keen learner actively involved in club activities spanning data analysis, Python, and emerging AI applications.",
    github: "https://github.com/manalPatel2557",
    linkedin: "https://www.linkedin.com/in/manal-patel-a87b11382/",
    events: [
      "Worldquant",
      "Integration Bee",
      "EDA Session",
      "Intro To Python",
      "Linear Regression",
      "Wearable AI",
    ],
  },
  {
    id: 5,
    name: "Makavana Axit",
    photo: "", // TODO: add photo URL
    description:
      "Curious about AI and its real-world applications. Engaged with foundational club sessions in data science and programming.",
    events: ["EDA Session", "Intro To Python", "Linear Regression", "Wearable AI"],
  },
  {
    id: 6,
    name: "Kush Ashvinbhai Patel",
    photo: "", // TODO: add photo URL
    description:
      "Focused on computer vision and retail AI. Built ShelfMind AI — a real-time shelf monitoring system that detects products, generates planograms, and flags out-of-stock issues.",
    github: "https://github.com/Kush5699",
    linkedin: "https://www.linkedin.com/in/kush-patel-6a074b258",
    events: ["Linear Regression"],
  },
  {
    id: 7,
    name: "Rushil Dangar",
    photo: "", // TODO: add photo URL
    description:
      "B.Tech ICT student with a strong interest in AI, Robotics, and programming. Experienced in C, C++, and Python, and committed to continuous learning in the field.",
    github: "https://github.com/Cybernyte-31",
    linkedin:
      "https://www.linkedin.com/in/rushil-dangar-42304632b",
    events: ["Integration Bee", "Intro To Python", "Wearable AI"],
  },
  {
    id: 8,
    name: "Aaditya Sarda",
    photo: "", // TODO: add photo URL
    description:
      "Turns complex math, messy data, and a lot of curiosity into working AI systems.",
    github: "https://github.com/Aadityasarda-25",
    linkedin:
      "https://www.linkedin.com/in/aaditya-sarda-426357371",
    events: [
      "Worldquant",
      "Integration Bee",
      "EDA Session",
      "Intro To Python",
      "Linear Regression",
      "Wearable AI",
    ],
  },
  {
    id: 9,
    name: "Vasani Sahil Rajeshbhai",
    photo: "", // TODO: add photo URL
    description:
      "Interested in applying ML to real-world energy problems. Built models to predict solar/wind generation potential and forecast electricity bills.",
    github: "https://github.com/sahil-vasani",
    linkedin: "https://www.linkedin.com/in/sahil-vasani/",
    events: ["Linear Regression", "Wearable AI"],
  },
];
