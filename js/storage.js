/**
 * RecruitFlow AI™ - Storage Service (Safe Migration & Data Persistence)
 * Manages LocalStorage for Candidate Pipeline & Criteria configuration.
 */

const STORAGE_KEYS = {
  CANDIDATES: 'recruitflow_candidates_v1',
  CRITERIA: 'recruitflow_criteria_v1',
  VERSION: 'recruitflow_data_version_v2'
};

const StorageService = {
  // Initialize storage with one-time safe migration
  init() {
    const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);

    if (!currentVersion) {
      // One-time legacy cleanup to ensure zero fake candidate records in final MVP
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.VERSION, '2.0.0');
    }

    if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
      this.saveCandidates([]);
    }

    if (!localStorage.getItem(STORAGE_KEYS.CRITERIA)) {
      this.saveCriteria(window.DEFAULT_CRITERIA || {});
    }
  },

  getCandidates() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse candidate data from localStorage", e);
      return [];
    }
  },

  saveCandidates(candidates) {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    } catch (e) {
      console.error("Failed to save candidates to localStorage", e);
    }
  },

  addCandidate(newCandidate) {
    const candidates = this.getCandidates();
    candidates.unshift(newCandidate);
    this.saveCandidates(candidates);
    return newCandidate;
  },

  updateCandidateStatus(candidateId, newStatus, notes = null) {
    const candidates = this.getCandidates();
    const index = candidates.findIndex(c => c.id === candidateId);
    if (index !== -1) {
      candidates[index].status = newStatus;
      if (notes !== null) {
        candidates[index].notes = notes;
      }
      this.saveCandidates(candidates);
      return candidates[index];
    }
    return null;
  },

  updateCandidateNotes(candidateId, notes) {
    const candidates = this.getCandidates();
    const index = candidates.findIndex(c => c.id === candidateId);
    if (index !== -1) {
      candidates[index].notes = notes;
      this.saveCandidates(candidates);
      return candidates[index];
    }
    return null;
  },

  resolveHandoff(candidateId) {
    const candidates = this.getCandidates();
    const index = candidates.findIndex(c => c.id === candidateId);
    if (index !== -1) {
      candidates[index].handoffRequested = false;
      candidates[index].handoffResolvedAt = new Date().toISOString();
      this.saveCandidates(candidates);
      return candidates[index];
    }
    return null;
  },

  deleteCandidate(candidateId) {
    const candidates = this.getCandidates();
    const filtered = candidates.filter(c => c.id !== candidateId);
    this.saveCandidates(filtered);
  },

  getCriteria() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CRITERIA);
      return data ? JSON.parse(data) : window.DEFAULT_CRITERIA;
    } catch (e) {
      return window.DEFAULT_CRITERIA;
    }
  },

  saveCriteria(criteria) {
    try {
      localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(criteria));
    } catch (e) {
      console.error("Failed to save criteria to localStorage", e);
    }
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(window.DEFAULT_CRITERIA));
    localStorage.setItem(STORAGE_KEYS.VERSION, '2.0.0');
  }
};

window.StorageService = StorageService;
