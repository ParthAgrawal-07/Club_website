// src/data/projects.ts
// AI Club Member Projects — generated from club form responses

export interface Project {
  id: number;
  title: string;
  author: string;
  authorId: number; // matches Member.id
  description: string;
  tags: string[];
  githubLink: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "F1-Prediction-Hub",
    author: "Saumya Shah",
    authorId: 1,
    description:
      "A full-stack Formula 1 website featuring live standings, driver and team information, and ML-powered race predictions.",
    tags: ["Machine Learning", "Full Stack", "Data Science", "Sports Analytics", "Python"],
    githubLink: "https://github.com/saumyashah0510/F1-Prediction-Hub",
  },
  {
    id: 2,
    title: "ShelfMind-AI",
    author: "Kush Ashvinbhai Patel",
    authorId: 6,
    description:
      "An end-to-end computer-vision-driven retail intelligence app that automatically monitors shelves, detects products with high precision, generates planograms, and flags out-of-stock or compliance issues in real time.",
    tags: [
      "Computer Vision",
      "Object Detection",
      "Retail AI",
      "Deep Learning",
      "OpenCV",
      "Python",
    ],
    githubLink: "https://github.com/Kush5699/ShelfMind-AI",
  },
  {
    id: 3,
    title: "Renewable-Energy-Solar-and-Wind-Prediction",
    author: "Vasani Sahil Rajeshbhai",
    authorId: 9,
    description:
      "Predicts the optimal location and potential output for solar panels by analysing sunlight data, helping users decide where to install renewable energy systems.",
    tags: [
      "Machine Learning",
      "Renewable Energy",
      "Regression",
      "Data Science",
      "Python",
    ],
    githubLink:
      "https://github.com/sahil-vasani/Renewable-Energy-Solar-and-Wind-Prediction",
  },
  {
    id: 4,
    title: "Electricity-Bill-Prediction-ML",
    author: "Vasani Sahil Rajeshbhai",
    authorId: 9,
    description:
      "A machine-learning model that forecasts next month's electricity bill based on historical usage patterns, helping households plan energy consumption.",
    tags: [
      "Machine Learning",
      "Regression",
      "Forecasting",
      "Energy",
      "Python",
    ],
    githubLink:
      "https://github.com/sahil-vasani/Electricity-bill-prediction-ML",
  },
];
