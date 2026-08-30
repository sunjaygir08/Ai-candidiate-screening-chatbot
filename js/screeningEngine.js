/**
 * RecruitFlow AI™ - Screening Engine
 * Evaluates candidates based on role criteria, experience, skills, and resume text.
 */

const ScreeningEngine = {
  evaluateCandidate(candidateData, criteriaConfig = null) {
    const criteria = criteriaConfig || StorageService.getCriteria();
    const targetRoleName = candidateData.targetRole || "Senior Frontend Engineer";
    
    // Find matching role criteria or default to first role
    let roleRule = criteria.roles.find(r => 
      r.title.toLowerCase().includes(targetRoleName.toLowerCase()) || 
      targetRoleName.toLowerCase().includes(r.title.toLowerCase())
    );

    if (!roleRule) {
      roleRule = criteria.roles[0] || {
        title: targetRoleName,
        minExperience: 3,
        requiredSkills: ["JavaScript", "React", "Git"],
        preferredLocations: ["Remote", "Hybrid"],
        minScoreQualified: 75,
        minScoreReview: 50
      };
    }

    const expYears = Number(candidateData.experienceYears) || 0;
    const candidateSkills = Array.isArray(candidateData.skills) 
      ? candidateData.skills 
      : (typeof candidateData.skills === 'string' ? candidateData.skills.split(',').map(s => s.trim()) : []);

    const resumeText = (candidateData.resumeText || "").toLowerCase();
    const candidateLocation = candidateData.location || "";
    const workMode = candidateData.workMode || "Hybrid";

    let score = 0;
    const strengths = [];
    const concerns = [];
    const matchingSkills = [];
    const missingSkills = [];

    // 1. Experience Evaluation (35% weight)
    const minExp = roleRule.minExperience || 3;
    if (expYears >= minExp + 2) {
      score += 35;
      strengths.push(`Significantly exceeds experience requirement (${expYears} years vs ${minExp} required)`);
    } else if (expYears >= minExp) {
      score += 30;
      strengths.push(`Meets minimum experience requirement (${expYears} years vs ${minExp} required)`);
    } else if (expYears >= minExp - 1) {
      score += 18;
      concerns.push(`Slightly below minimum required experience (${expYears} years vs ${minExp} required)`);
    } else {
      score += 5;
      concerns.push(`Experience gap (${expYears} years vs ${minExp} required)`);
    }

    // 2. Skill Evaluation (45% weight)
    const reqSkills = roleRule.requiredSkills || [];
    let skillMatchesCount = 0;

    reqSkills.forEach(reqSkill => {
      const normalizedSkill = reqSkill.toLowerCase();
      const isDirectMatch = candidateSkills.some(cs => cs.toLowerCase().includes(normalizedSkill));
      const isResumeMatch = resumeText.includes(normalizedSkill);

      if (isDirectMatch || isResumeMatch) {
        matchingSkills.push(reqSkill);
        skillMatchesCount++;
      } else {
        missingSkills.push(reqSkill);
      }
    });

    if (reqSkills.length > 0) {
      const skillMatchRatio = skillMatchesCount / reqSkills.length;
      score += Math.round(skillMatchRatio * 45);

      if (skillMatchRatio === 1) {
        strengths.push(`100% core skill match (${matchingSkills.join(', ')})`);
      } else if (skillMatchRatio >= 0.6) {
        strengths.push(`Strong core skill overlap (${matchingSkills.length}/${reqSkills.length} matches)`);
        concerns.push(`Missing core skills: ${missingSkills.join(', ')}`);
      } else {
        concerns.push(`Substantial skill gap. Missing: ${missingSkills.join(', ')}`);
      }
    } else {
      score += 35; // Default if no specific skills listed
    }

    // 3. Location & Work Mode Evaluation (10% weight)
    const prefLocations = roleRule.preferredLocations || ["Remote", "Hybrid"];
    const isRemote = workMode.toLowerCase().includes('remote') || candidateLocation.toLowerCase().includes('remote');
    const matchesLocation = prefLocations.some(loc => 
      candidateLocation.toLowerCase().includes(loc.toLowerCase()) || 
      isRemote
    );

    if (matchesLocation) {
      score += 10;
      strengths.push(`Location / Work mode aligns with position setup (${workMode})`);
    } else {
      score += 5;
      concerns.push(`Location check: Candidate is in ${candidateLocation || 'Unspecified'}, target mode is ${workMode}`);
    }

    // 4. Resume Depth / Quality Check (10% weight)
    if (resumeText.length > 150) {
      score += 10;
      // Extract keywords for extra boost
      const keywords = ["led", "managed", "built", "designed", "scaled", "optimized", "developed", "architected"];
      const matchedKeywords = keywords.filter(kw => resumeText.includes(kw));
      if (matchedKeywords.length >= 2) {
        strengths.push(`Resume demonstrates leadership & impact (${matchedKeywords.slice(0, 3).join(', ')})`);
      }
    } else if (candidateData.resumeText) {
      score += 5;
    } else {
      concerns.push("Resume details minimal or missing");
    }

    // Cap score at 100
    score = Math.min(100, Math.max(10, score));

    // Determine Status
    let status = "Not a Fit";
    const qualifiedThreshold = roleRule.minScoreQualified || 75;
    const reviewThreshold = roleRule.minScoreReview || 50;

    if (score >= qualifiedThreshold && expYears >= minExp - 1) {
      status = "Qualified";
    } else if (score >= reviewThreshold) {
      status = "Needs Review";
    } else {
      status = "Not a Fit";
    }

    // Generate recommendation text
    let recommendation = "";
    if (status === "Qualified") {
      recommendation = `Qualified candidate for ${targetRoleName}. Strong alignment on skills (${matchingSkills.length} matches) and ${expYears} years experience.`;
    } else if (status === "Needs Review") {
      recommendation = `Needs Recruiter Review. Partial match for ${targetRoleName} (Score: ${score}%). ${concerns[0] || 'Requires manual resume verification'}.`;
    } else {
      recommendation = `Not a Fit for ${targetRoleName}. Score: ${score}%. ${concerns.join('. ') || 'Does not meet basic role criteria'}.`;
    }

    return {
      status,
      matchScore: score,
      matchingSkills,
      missingSkills,
      strengths,
      concerns,
      recommendation,
      targetRoleName
    };
  }
};

window.ScreeningEngine = ScreeningEngine;
