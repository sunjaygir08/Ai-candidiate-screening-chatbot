/**
 * RecruitFlow AI™ - Storage Service
 * Handles persistence for Candidate Pipeline & Criteria configuration via LocalStorage.
 */

const STORAGE_KEYS = {
  CANDIDATES: 'recruitflow_candidates_v1',
  CRITERIA: 'recruitflow_criteria_v1'
};

const StorageService = {
  // Initialize storage with defaults if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
      this.saveCandidates(window.INITIAL_CANDIDATES || []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CRITERIA)) {
      this.saveCriteria(window.DEFAULT_CRITERIA || {});
    }
  },

  // Candidate CRUD operations
  getCandidates() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse candidate data from localStorage", e);
      return window.INITIAL_CANDIDATES || [];
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
    // Add to top of list
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

  deleteCandidate(candidateId) {
    const candidates = this.getCandidates();
    const filtered = candidates.filter(c => c.id !== candidateId);
    this.saveCandidates(filtered);
  },

  // Criteria management
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
    localStorage.removeItem(STORAGE_KEYS.CANDIDATES);
    localStorage.removeItem(STORAGE_KEYS.CRITERIA);
    this.init();
  }
};

window.StorageService = StorageService;
