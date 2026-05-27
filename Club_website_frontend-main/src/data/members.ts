// src/data/members.ts
// AI Club Members Data — generated from club form responses

export type MemberRole = 'Convenor' | 'Deputy Convenor' | 'Core Member' | 'Extended Core Member' | 'Member';

export interface Member {
  id: number;
  name: string;
  role: MemberRole;
  photo: string;
  description: string;
  github?: string;
  linkedin?: string;
  events: string[];
  internship?: string;
  blog?: string;
}

// Helper to build a Google Drive thumbnail URL (no public sharing required)
const driveImg = (id: string) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w400-h400`;

export const members: Member[] = [
  {
    id: 1,
    name: "Saumya Shah",
    role: "Member",
    photo: driveImg("1kHcVHLCWTm5KfsO7rxtL7Hi-t4oAtAyY"),
    description:
      "Passionate about AI/ML and full-stack development. Built an F1 prediction platform combining live standings with machine-learning-powered race forecasts.",
    github: "https://github.com/saumyashah0510",
    linkedin: "https://www.linkedin.com/in/saumya-shah-5bb8602b4/",
    events: ["EDA Session", "Linear Regression", "Wearable AI"],
  },
  {
    id: 2,
    name: "Sanket Agarwal",
    role: "Member",
    photo: driveImg("1-9NLV4J-Vb_gPlB6DKQFKeF6UmWkILfs"),
    description:
      "Strong interest in problem-solving and competitive programming, now extending that mindset into AI. Excited to explore how AI can be used to build intelligent and impactful solutions.",
    linkedin: "https://www.linkedin.com/in/sanket-agarwal-2b606b3a3",
    events: ["Worldquant"],
  },
  {
    id: 3,
    name: "Parth Garg",
    role: "Member",
    photo: driveImg("14wJzfJ9thbBxZ5mKUCCFI5ouG_QmTQ2R"),
    description:
      "Enthusiastic learner with interests across AI, mathematics, and programming. Active participant in a wide range of club events and competitions.",
    github: "https://github.com/gargparth2406-creator",
    linkedin: "https://www.linkedin.com/in/parth-garg-024b40379",
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
    role: "Core Member",
    photo: driveImg("1SIbjNc7hzjt7sYUAUcZNALAYCR3jG1Vq"),
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
    role: "Member",
    photo: "", // No photo submitted
    description:
      "Curious about AI and its real-world applications. Engaged with foundational club sessions in data science and programming.",
    events: ["EDA Session", "Intro To Python", "Linear Regression", "Wearable AI"],
  },
  {
    id: 6,
    name: "Kush Ashvinbhai Patel",
    role: "Member",
    photo: "", // No photo submitted
    description:
      "Focused on computer vision and retail AI. Built ShelfMind AI — a real-time shelf monitoring system that detects products, generates planograms, and flags out-of-stock issues.",
    github: "https://github.com/Kush5699",
    linkedin: "https://www.linkedin.com/in/kush-patel-6a074b258",
    events: ["Linear Regression"],
  },
  {
    id: 7,
    name: "Rushil Dangar",
    role: "Member",
    photo: driveImg("1dwvTHcgTlgdKJZLJCcrpu3-SwrjN-yQQ"),
    description:
      "B.Tech ICT student with a strong interest in AI, Robotics, and programming. Experienced in C, C++, and Python, and committed to continuous learning in the field.",
    github: "https://github.com/Cybernyte-31",
    linkedin: "https://www.linkedin.com/in/rushil-dangar-42304632b",
    events: ["Integration Bee", "Intro To Python", "Wearable AI"],
  },
  {
    id: 8,
    name: "Aaditya Sarda",
    role: "Core Member",
    photo: driveImg("1JNdHeervqQcR3F1YxM5_5mH_RSgceBVv"),
    description:
      "Turns complex math, messy data, and a lot of curiosity into working AI systems.",
    github: "https://github.com/Aadityasarda-25",
    linkedin: "https://www.linkedin.com/in/aaditya-sarda-426357371",
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
    role: "Member",
    photo: driveImg("18F16o3BL8rTeK-i2fOXfQ7sfXR7_GcSR"),
    description:
      "Interested in applying ML to real-world energy problems. Built models to predict solar/wind generation potential and forecast electricity bills.",
    github: "https://github.com/sahil-vasani",
    linkedin: "https://www.linkedin.com/in/sahil-vasani/",
    events: ["Linear Regression", "Wearable AI"],
  },
  {
    id: 10,
    name: "Vedant Shah",
    role: "Convenor",
    photo: driveImg("1w-YzI438YZQ4TxCk0xP4g_VswuyaiW3i"),
    description:
      "Convenor of the AI Club DAIICT. Builds multi-agent RL environments, edge AI systems, and blockchain backends — driven by a passion for research and real-world AI impact.",
    github: "https://github.com/Vedant-1016",
    linkedin: "https://www.linkedin.com/in/vedant-shah-07a87331a/",
    events: ["Worldquant", "Integration Bee", "EDA Session", "Intro To Python", "Linear Regression", "Wearable AI"],
  },
  {
    id: 11,
    name: "Parth Agrawal",
    role: "Core Member",
    photo: driveImg("1cpqcCEhL-421d93Pms15ZEcpzAYAe6Ns"),
    description:
      "Core member of the AI Club with a strong interest in AI-powered career guidance and data-driven problem solving. Built CareerPilot-AI, a conversational platform for personalized career recommendations.",
    github: "https://github.com/ParthAgrawal-07",
    linkedin: "https://www.linkedin.com/in/parth-agrawal-368869325/",
    events: ["Worldquant", "Integration Bee", "EDA Session", "Intro To Python", "Linear Regression", "Wearable AI"],
  },
  {
    id: 12,
    name: "Jugal Nirav Shah",
    role: "Extended Core Member",
    photo: driveImg("1eWzxCETb_20BuzqBfLODuPkOb44dtZGz"),
    description:
      "Extended core member of the AI Club. Builds AI-powered dashboards and intelligent email triage systems, with a cyberpunk-inspired design sensibility and a love for vibe coding.",
    github: "https://github.com/jugalshahh",
    linkedin: "https://www.linkedin.com/in/jugal-shah-a493b3368/",
    events: ["Worldquant", "Integration Bee"],
  },
  {
    id: 13,
    name: "Bhagyashree Khemwani",
    role: "Core Member",
    photo: driveImg("1k-3MwbfpE2I_1yPo76ikT5Bd5F7rQA3L"),
    description:
      "Core member of the AI Club, actively participating in events and building foundational skills in Python, data science, and emerging AI applications.",
    github: "https://github.com/bhagy-shr",
    linkedin: "https://www.linkedin.com/in/bhagyashree-khemwani",
    events: ["Worldquant", "Intro To Python"],
  },
  {
    id: 14,
    name: "Anmol Ghogare",
    role: "Core Member",
    photo: driveImg("1QWs1UunTZomhZfPxHPHMhuoF4OVQPvGJ"),
    description:
      "Passionate about AI/ML and competitive programming. Has built real-world projects including a talent assessment tool, real estate price predictor, and eco-drive analyzer. Experienced in hackathons and AI-driven development.",
    github: "https://github.com/anmolghogare",
    linkedin: "https://www.linkedin.com/in/anmol-ghogare-407244381",
    events: ["Worldquant", "Integration Bee", "EDA Session", "Intro To Python", "Linear Regression", "Wearable AI"],
  },
];
