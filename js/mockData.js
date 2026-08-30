/**
 * RecruitFlow AI™ - Mock Data & Initial State
 */

const DEFAULT_CRITERIA = {
  roles: [
    {
      title: "Senior Frontend Engineer",
      minExperience: 4,
      requiredSkills: ["React", "TypeScript", "CSS", "JavaScript", "REST APIs"],
      preferredLocations: ["Remote", "New York", "San Francisco", "Austin", "Hybrid"],
      minScoreQualified: 75,
      minScoreReview: 50
    },
    {
      title: "Full Stack Developer",
      minExperience: 3,
      requiredSkills: ["Node.js", "React", "Python", "SQL", "Git"],
      preferredLocations: ["Remote", "Hybrid", "London", "Chicago"],
      minScoreQualified: 70,
      minScoreReview: 50
    },
    {
      title: "AI / ML Engineer",
      minExperience: 3,
      requiredSkills: ["Python", "PyTorch", "TensorFlow", "LLMs", "Scikit-Learn"],
      preferredLocations: ["Remote", "San Francisco", "Hybrid", "Boston"],
      minScoreQualified: 80,
      minScoreReview: 60
    },
    {
      title: "Product Manager",
      minExperience: 3,
      requiredSkills: ["Product Roadmap", "Agile", "User Research", "Data Analytics", "Jira"],
      preferredLocations: ["Remote", "Hybrid", "New York", "Seattle"],
      minScoreQualified: 75,
      minScoreReview: 50
    }
  ],
  generalRequirements: {
    maxNoticePeriodWeeks: 6,
    workModesAccepted: ["Remote", "Hybrid", "Onsite"]
  }
};

const INITIAL_CANDIDATES = [
  {
    id: "cand-101",
    fullName: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+1 (555) 234-5678",
    targetRole: "Senior Frontend Engineer",
    experienceYears: 5,
    skills: ["React", "TypeScript", "JavaScript", "CSS", "REST APIs", "Next.js", "Tailwind"],
    location: "San Francisco, CA",
    workMode: "Hybrid",
    availability: "2 weeks notice",
    salaryExpectation: "$145,000 - $160,000 / year",
    resumeText: "Senior Frontend Developer with 5 years of hands-on experience building scalable web applications with React, TypeScript, and modern JavaScript ecosystem. Led frontend team of 4 engineers at TechCorp. Reduced page load times by 40% using performance optimizations.",
    resumeFileName: "Sarah_Jenkins_Resume_2026.pdf",
    appliedAt: "2026-08-29T14:30:00.000Z",
    status: "Qualified",
    matchScore: 92,
    screeningResult: {
      status: "Qualified",
      matchScore: 92,
      matchingSkills: ["React", "TypeScript", "JavaScript", "CSS", "REST APIs"],
      missingSkills: [],
      strengths: ["Exceeds required 4 years experience", "100% core skill match", "Location aligns with team hybrid hubs"],
      concerns: ["Higher end of salary budget"],
      recommendation: "Strongly Qualified. Excellent technical alignment for Senior Frontend Engineer role."
    },
    notes: "Outstanding candidate background. Scheduled initial recruiter screening call.",
    handoffRequested: false
  },
  {
    id: "cand-102",
    fullName: "Marcus Chen",
    email: "marcus.c@example.com",
    phone: "+1 (555) 876-5432",
    targetRole: "Senior Frontend Engineer",
    experienceYears: 3,
    skills: ["JavaScript", "HTML/CSS", "React", "Vue.js"],
    location: "Austin, TX",
    workMode: "Remote",
    availability: "Immediate",
    salaryExpectation: "$120,000 / year",
    resumeText: "Frontend Developer with 3 years experience crafting UI components with Vue and React. Passionate about web accessibility and user interface design.",
    resumeFileName: "Marcus_Chen_CV.pdf",
    appliedAt: "2026-08-30T09:15:00.000Z",
    status: "Needs Review",
    matchScore: 68,
    screeningResult: {
      status: "Needs Review",
      matchScore: 68,
      matchingSkills: ["React", "JavaScript", "CSS"],
      missingSkills: ["TypeScript", "REST APIs"],
      strengths: ["Solid React foundation", "Immediate availability"],
      concerns: ["Slightly under 4 years minimum experience requirement", "Lacks TypeScript experience"],
      recommendation: "Needs Review. Potential mid-level candidate or trainable frontend role."
    },
    notes: "Review with hiring manager regarding experience requirement flexibility.",
    handoffRequested: true,
    handoffMessage: "Candidate asked: 'Can I speak directly to the hiring manager about equity options?'"
  },
  {
    id: "cand-103",
    fullName: "Alex Taylor",
    email: "alex.t@example.com",
    phone: "+1 (555) 432-1098",
    targetRole: "AI / ML Engineer",
    experienceYears: 1,
    skills: ["Python", "SQL", "Excel", "HTML"],
    location: "Miami, FL",
    workMode: "Onsite",
    availability: "1 month notice",
    salaryExpectation: "$95,000 / year",
    resumeText: "Junior Data Analyst with 1 year experience writing SQL queries, basic Python scripts, and building Excel reporting dashboards.",
    resumeFileName: "Alex_Taylor_Resume.docx",
    appliedAt: "2026-08-28T16:45:00.000Z",
    status: "Not a Fit",
    matchScore: 35,
    screeningResult: {
      status: "Not a Fit",
      matchScore: 35,
      matchingSkills: ["Python"],
      missingSkills: ["PyTorch", "TensorFlow", "LLMs", "Scikit-Learn"],
      strengths: ["Basic Python knowledge"],
      concerns: ["Does not meet 3 years minimum ML engineering experience", "Missing core frameworks PyTorch/TensorFlow"],
      recommendation: "Not a Fit. Experience gap for AI / ML Engineer position."
    },
    notes: "Sent automated friendly rejection email with suggestion to check entry-level analyst roles.",
    handoffRequested: false
  },
  {
    id: "cand-104",
    fullName: "Elena Rostova",
    email: "elena.rostova@example.com",
    phone: "+1 (555) 987-6543",
    targetRole: "AI / ML Engineer",
    experienceYears: 6,
    skills: ["Python", "PyTorch", "TensorFlow", "LLMs", "Scikit-Learn", "FastAPI", "Docker", "LangChain"],
    location: "Seattle, WA",
    workMode: "Remote",
    availability: "3 weeks notice",
    salaryExpectation: "$170,000 / year",
    resumeText: "Staff ML Research Engineer with 6 years experience deploying production LLM pipelines, fine-tuning PyTorch models, and scaling NLP inference architectures. Speaker at PyData 2025.",
    resumeFileName: "Elena_Rostova_Staff_ML_Resume.pdf",
    appliedAt: "2026-08-30T11:20:00.000Z",
    status: "Qualified",
    matchScore: 98,
    screeningResult: {
      status: "Qualified",
      matchScore: 98,
      matchingSkills: ["Python", "PyTorch", "TensorFlow", "LLMs", "Scikit-Learn"],
      missingSkills: [],
      strengths: ["6 years heavy machine learning background", "Full core ML framework match + LangChain & Docker", "Remote ready"],
      concerns: [],
      recommendation: "Top Tier Candidate. Immediate high-priority interview recommendation."
    },
    notes: "Recruiter initiated expedited technical interview process.",
    handoffRequested: false
  }
];

window.DEFAULT_CRITERIA = DEFAULT_CRITERIA;
window.INITIAL_CANDIDATES = INITIAL_CANDIDATES;
