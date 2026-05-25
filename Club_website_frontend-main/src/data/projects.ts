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
  {
    id: 5,
    title: "GAIA Agent",
    author: "Jash Shah",
    authorId: 2,
    description:
      "A LangGraph-powered multi-agent system with a supervisor that delegates real-world GAIA benchmark questions to specialized sub-agents for web search, code execution, file processing, and video analysis.",
    tags: [
      "Machine Learning",
      "LangGraph",
      "Multi-Agent",
      "Python",
    ],
    githubLink: "https://github.com/jash0803/gaia-agent",
  },
  {
    id: 6,
    title: "Financial Asset Recommender",
    author: "Jash Shah",
    authorId: 2,
    description:
      "A modular hybrid recommender system for financial assets combining 5 algorithms and 11 evaluation metrics with cold-start handling and an interactive Streamlit UI for personalized investment suggestions.",
    tags: [
      "Machine Learning",
      "Recommender System",
      "Data Science",
      "Python",
    ],
    githubLink: "https://github.com/jash0803/financial-asset-recommendation",
  },
  {
    id: 8,
    title: "NaFO RL Environment",
    author: "Vedant Shah",
    authorId: 10,
    description:
      "A multi-agent reinforcement learning environment built on OpenEnv's framework that simulates an economy, optimizing profits for a shopkeeper by accounting for dynamic market factors.",
    tags: ["Machine Learning", "Reinforcement Learning", "Multi-Agent", "Python"],
    githubLink: "https://github.com/Vedant-1016",
  },
  {
    id: 9,
    title: "ConcourMeet",
    author: "Vedant Shah",
    authorId: 10,
    description:
      "A backend implementation of a video-conferencing platform inspired by Google Meet, built with a system-programming-oriented approach focusing on concurrency and backend architecture.",
    tags: ["Full Stack", "Backend", "Systems", "Python"],
    githubLink: "https://github.com/Vedant-1016",
  },
  {
    id: 10,
    title: "AI-Powered Personal Command Centre",
    author: "Jugal Nirav Shah",
    authorId: 12,
    description:
      "A highly customized, fully responsive personal dashboard centralizing academic, technical, and lifestyle tracking. Built with React and a cyberpunk aesthetic as a single pane of glass for developer workflows.",
    tags: ["Full Stack", "Machine Learning", "Data Science", "Python"],
    githubLink: "https://github.com/jugalshahh",
  },
  {
    id: 11,
    title: "AI Email Classifier",
    author: "Jugal Nirav Shah",
    authorId: 12,
    description:
      "A real-world OpenEnv environment simulating email triage — classifying incoming emails by spam status, category, and priority level, benchmarking AI agent capabilities on a practical knowledge-worker task.",
    tags: ["Machine Learning", "NLP", "Multi-Agent", "Python"],
    githubLink: "https://github.com/jugalshahh",
  },
  {
    id: 12,
    title: "CareerPilot-AI",
    author: "Parth Agrawal",
    authorId: 11,
    description:
      "A fully developed AI-powered career guidance platform that uses conversational AI to analyze student interests and deliver personalized career recommendations with financial and professional insights.",
    tags: ["Machine Learning", "Full Stack", "Data Science", "Python"],
    githubLink: "https://github.com/ParthAgrawal-07",
  },
  {
    id: 13,
    title: "TalentLens",
    author: "Anmol Ghogare",
    authorId: 14,
    description:
      "An AI-powered talent assessment tool that evaluates candidate skills and potential using machine learning models, helping organizations make data-driven hiring decisions.",
    tags: ["Machine Learning", "Data Science", "Python"],
    githubLink: "https://github.com/anmolghogare",
  },
  {
    id: 14,
    title: "Real Estate Price Predictor",
    author: "Anmol Ghogare",
    authorId: 14,
    description:
      "A machine learning model that predicts real estate property prices based on location, amenities, and market factors, enabling smarter investment and buying decisions.",
    tags: ["Machine Learning", "Regression", "Data Science", "Python"],
    githubLink: "https://github.com/anmolghogare",
  },
];
