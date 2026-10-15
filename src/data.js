/*
  BACKEND HANDOFF:
  Replace the values in APP_DATA with API responses.
  Keep the same object shape and the UI does not need to change.
  No user-specific data is required by the frontend.
*/

export const APP_DATA = {
  user: {
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210"
  },

  resume: {
    fileName: "Aarav_Sharma_Resume.pdf",
    score: 78,
    atsScore: 82,
    contentQuality: 81,
    skillRelevance: 76,
    roleAlignment: 79,
    clarity: 84,
    insights: [
      "Strong technical project section with measurable outcomes.",
      "Add more role-specific keywords to the experience section.",
      "Quantify internship and project impact where possible.",
      "Keep bullet points concise and action-oriented."
    ],
    technicalSkills: ["Python", "SQL", "React", "Git"],
    softSkills: ["Communication", "Problem Solving", "Teamwork"],
    otherSkills: ["Agile", "Documentation"],
    matchedKeywords: ["Python", "SQL", "REST APIs", "Git"],
    missingKeywords: ["Docker", "AWS", "Testing"],
    suggestedKeywords: ["CI/CD", "Cloud", "Unit Testing"],
    roleAlignment: [
      { role: "Software Engineer", score: 84, skills: "Python, React, SQL" },
      { role: "Data Analyst", score: 77, skills: "Python, SQL, Analytics" },
      { role: "Backend Developer", score: 73, skills: "Python, APIs, SQL" }
    ],
    suggestions: [
      "Add two quantified achievements to your project section.",
      "Move your strongest technical skills closer to the top.",
      "Add one cloud or deployment project if relevant.",
      "Tailor the summary for the role you are targeting."
    ]
  },

  dashboard: {
    readiness: 78,
    skillsIdentified: 9,
    recommendedRoles: 3,
    preparationStatus: 62,
    skillAnalysis: [
      ["Technical Skills", 82],
      ["Problem Solving", 76],
      ["Domain Knowledge", 68],
      ["Communication", 72],
      ["Leadership", 61],
      ["Other Skills", 58]
    ],
    roleMatches: [
      ["Software Engineer", 84],
      ["Data Analyst", 77],
      ["Backend Developer", 73]
    ],
    strengths: ["Technical foundation", "Project experience", "Learning mindset"],
    areasToImprove: ["System design", "Cloud fundamentals", "Interview speed"],
    nextSteps: [
      "Complete 20 technical questions this week.",
      "Take one company-specific mock test.",
      "Practice a 30-minute behavioral interview."
    ]
  },

  preparation: {
    readiness: 72,
    technicalKnowledge: 75,
    problemSolving: 68,
    communication: 70,
    systemDesign: 55,
    categories: [
      { name: "Data Structures & Algorithms", count: 150 },
      { name: "Operating Systems", count: 80 },
      { name: "Database Management", count: 100 },
      { name: "Computer Networks", count: 70 },
      { name: "System Design", count: 60 },
      { name: "Aptitude & CS Fundamentals", count: 90 }
    ],
    companies: [
      { name: "Google", count: 250 },
      { name: "Microsoft", count: 200 },
      { name: "Amazon", count: 220 },
      { name: "Infosys", count: 120 },
      { name: "TCS", count: 150 },
      { name: "Accenture", count: 140 }
    ],
    mockTests: [
      { name: "Full Length Mock Test", meta: "60 questions • 90 mins" },
      { name: "Company-specific Test", meta: "50 questions • 75 mins" },
      { name: "Topic-wise Test", meta: "20 questions • 30 mins" }
    ],
    recentActivity: [
      ["Arrays", "Easy", 20, "85%", "Oct 2"],
      ["Linked Lists", "Medium", 15, "67%", "Oct 1"],
      ["OS - Processes", "Medium", 20, "70%", "Sep 30"],
      ["Mock Test - Amazon", "Mixed", 50, "62%", "Sep 28"]
    ],
    progress: [
      { week: "Week 1", accuracy: 42, attempted: 25, time: 18 },
      { week: "Week 2", accuracy: 61, attempted: 49, time: 15 },
      { week: "Week 3", accuracy: 72, attempted: 68, time: 13 },
      { week: "Week 4", accuracy: 78, attempted: 91, time: 11 }
    ]
  },

  interview: {
    category: "Resume-based",
    difficulty: "Medium",
    topic: "Projects & Technical Skills",
    question: "Tell me about one project you are most proud of. What problem did it solve, and what was your contribution?",
    totalQuestions: 10
  }
};

export const EMPTY_BACKEND_SHAPE = {
  user: { name: "", email: "", phone: "" },
  resume: { score: null, atsScore: null, insights: [], technicalSkills: [], softSkills: [], otherSkills: [] },
  dashboard: { readiness: null, skillsIdentified: null, recommendedRoles: null, preparationStatus: null },
  preparation: { readiness: null, categories: [], companies: [], mockTests: [], recentActivity: [], progress: [] },
  interview: { category: "", difficulty: "", topic: "", question: "", totalQuestions: null }
};