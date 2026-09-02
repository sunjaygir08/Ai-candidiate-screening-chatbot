/**
 * RecruitFlow AI™ - Mock Data & Default Role Criteria
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
      minScoreQualified: 75,
      minScoreReview: 50
    },
    {
      title: "AI / ML Engineer",
      minExperience: 3,
      requiredSkills: ["Python", "PyTorch", "TensorFlow", "LLMs", "Scikit-Learn"],
      preferredLocations: ["Remote", "San Francisco", "Hybrid", "Boston"],
      minScoreQualified: 75,
      minScoreReview: 50
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

// Initial candidate array MUST start completely empty for authentic MVP
const INITIAL_CANDIDATES = [];

window.DEFAULT_CRITERIA = DEFAULT_CRITERIA;
window.INITIAL_CANDIDATES = INITIAL_CANDIDATES;
