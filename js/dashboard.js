/**
 * RecruitFlow AI™ - Recruiter Pipeline Dashboard Renderer & Controller (Executive White & Brown Theme)
 */

class Dashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.candidates = [];
    this.filteredCandidates = [];
    this.selectedCandidate = null;
    this.currentViewMode = 'table';
    this.filters = {
      search: '',
      status: 'ALL',
      role: 'ALL'
    };

    this.init();
  }

  init() {
    if (!this.container) return;
    this.loadData();
    this.renderLayout();
    this.attachEventListeners();

    window.addEventListener("recruitflow_candidate_added", () => {
      this.refresh();
      this.showToast("✨ New candidate application screened and synced!");
    });
  }

  loadData() {
    this.candidates = StorageService.getCandidates();
    this.applyFilters();
  }

  refresh() {
    this.loadData();
    this.renderStats();
    this.renderCandidateContent();
  }

  applyFilters() {
    this.filteredCandidates = this.candidates.filter(c => {
      const q = this.filters.search.toLowerCase();
      const matchesSearch = !q || 
        c.fullName.toLowerCase().includes(q) ||
        c.targetRole.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.skills && c.skills.some(s => s.toLowerCase().includes(q)));

      let matchesStatus = true;
      if (this.filters.status === 'HANDOFF') {
        matchesStatus = c.handoffRequested === true;
      } else if (this.filters.status !== 'ALL') {
        matchesStatus = c.status === this.filters.status;
      }

      const matchesRole = this.filters.role === 'ALL' || c.targetRole === this.filters.role;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="space-y-6 animate-fade-in pb-12">
        <!-- Dashboard Top Header Bar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E0DA] p-6 rounded-2xl exec-shadow">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-2xl font-extrabold text-[#2C221E] tracking-tight">Candidate Pipeline Dashboard</h2>
              <span class="px-2.5 py-1 rounded-full bg-[#F4ECE4] text-[#5C4033] text-xs font-semibold border border-[#967259]/30">Live Sync</span>
            </div>
            <p class="text-[#6B5E55] text-sm mt-1">Screened candidates, AI match evaluations, and human handoff queue.</p>
          </div>
          
          <div class="flex items-center gap-3">
            <button id="open-criteria-modal-btn" class="bg-[#F0ECE6] hover:bg-[#E5E0DA] text-[#2C221E] px-4 py-2.5 rounded-xl border border-[#E5E0DA] text-sm font-semibold transition-all flex items-center gap-2">
              <i class="fa-solid fa-sliders text-[#967259]"></i>
              <span>Screening Rules</span>
            </button>

            <button id="export-candidates-btn" class="bg-[#F0ECE6] hover:bg-[#E5E0DA] text-[#2C221E] px-4 py-2.5 rounded-xl border border-[#E5E0DA] text-sm font-semibold transition-all flex items-center gap-2">
              <i class="fa-solid fa-download text-[#5C4033]"></i>
              <span>Export CSV</span>
            </button>

            <button id="reset-data-btn" title="Reset to Sample Data" class="bg-[#F0ECE6] hover:bg-rose-100 text-[#6B5E55] hover:text-rose-700 px-3 py-2.5 rounded-xl border border-[#E5E0DA] text-sm transition-all">
              <i class="fa-solid fa-rotate text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Metric Counter Cards -->
        <div id="dashboard-stats-container" class="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Rendered dynamically -->
        </div>

        <!-- Filter & Search Control Panel -->
        <div class="bg-white border border-[#E5E0DA] p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4 exec-shadow">
          <!-- Search Input -->
          <div class="relative w-full lg:w-80">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A3968C] text-sm"></i>
            <input 
              type="text" 
              id="dash-search-input" 
              placeholder="Search candidate, role, skill..." 
              value="${this.filters.search}"
              class="w-full bg-[#F8F6F2] border border-[#E5E0DA] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2C221E] focus:outline-none focus:border-[#5C4033] placeholder-[#A3968C]"
            />
          </div>

          <!-- Dropdown Filters & View Switcher -->
          <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <!-- Status Filter -->
            <select id="dash-status-filter" class="bg-[#F8F6F2] border border-[#E5E0DA] rounded-xl px-3 py-2.5 text-xs text-[#2C221E] font-medium focus:outline-none focus:border-[#5C4033]">
              <option value="ALL" ${this.filters.status === 'ALL' ? 'selected' : ''}>All Statuses</option>
              <option value="Qualified" ${this.filters.status === 'Qualified' ? 'selected' : ''}>✨ Qualified</option>
              <option value="Needs Review" ${this.filters.status === 'Needs Review' ? 'selected' : ''}>⚠️ Needs Review</option>
              <option value="Not a Fit" ${this.filters.status === 'Not a Fit' ? 'selected' : ''}>❌ Not a Fit</option>
              <option value="HANDOFF" ${this.filters.status === 'HANDOFF' ? 'selected' : ''}>🤝 Handoff Requested</option>
            </select>

            <!-- Role Filter -->
            <select id="dash-role-filter" class="bg-[#F8F6F2] border border-[#E5E0DA] rounded-xl px-3 py-2.5 text-xs text-[#2C221E] font-medium focus:outline-none focus:border-[#5C4033]">
              <option value="ALL">All Target Roles</option>
              <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="AI / ML Engineer">AI / ML Engineer</option>
              <option value="Product Manager">Product Manager</option>
            </select>

            <!-- View Switcher -->
            <div class="flex items-center bg-[#F0ECE6] border border-[#E5E0DA] p-1 rounded-xl">
              <button id="view-table-btn" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${this.currentViewMode === 'table' ? 'bg-[#5C4033] text-white shadow-sm' : 'text-[#6B5E55] hover:text-[#2C221E]'}">
                <i class="fa-solid fa-table-list mr-1.5"></i>Table
              </button>
              <button id="view-kanban-btn" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${this.currentViewMode === 'kanban' ? 'bg-[#5C4033] text-white shadow-sm' : 'text-[#6B5E55] hover:text-[#2C221E]'}">
                <i class="fa-solid fa-columns-3 mr-1.5"></i>Kanban
              </button>
            </div>
          </div>
        </div>

        <!-- Main Candidate Pipeline Output Container -->
        <div id="candidate-pipeline-content">
          <!-- Table or Kanban renders here -->
        </div>
      </div>

      <!-- Candidate Details Drawer / Modal Container -->
      <div id="candidate-detail-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-[#2C221E]/50 backdrop-blur-sm p-4 hidden">
        <div class="bg-white border border-[#E5E0DA] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          <!-- Modal content injected dynamically -->
        </div>
      </div>

      <!-- Screening Criteria Modal Container -->
      <div id="criteria-config-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-[#2C221E]/50 backdrop-blur-sm p-4 hidden">
        <div class="bg-white border border-[#E5E0DA] w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <!-- Criteria editor injected dynamically -->
        </div>
      </div>
    `;

    this.renderStats();
    this.renderCandidateContent();
  }

  renderStats() {
    const container = document.getElementById("dashboard-stats-container");
    if (!container) return;

    const total = this.candidates.length;
    const qualified = this.candidates.filter(c => c.status === 'Qualified').length;
    const review = this.candidates.filter(c => c.status === 'Needs Review').length;
    const notFit = this.candidates.filter(c => c.status === 'Not a Fit').length;
    const handoff = this.candidates.filter(c => c.handoffRequested).length;

    container.innerHTML = `
      <div class="bg-white border border-[#E5E0DA] p-4 rounded-2xl exec-shadow flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#F4ECE4] text-[#5C4033] flex items-center justify-center text-xl font-bold">
          <i class="fa-solid fa-users"></i>
        </div>
        <div>
          <div class="text-2xl font-extrabold text-[#2C221E]">${total}</div>
          <div class="text-xs text-[#6B5E55] font-semibold">Total Applicants</div>
        </div>
      </div>

      <div class="bg-white border border-emerald-200 p-4 rounded-2xl exec-shadow flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div>
          <div class="text-2xl font-extrabold text-emerald-800">${qualified}</div>
          <div class="text-xs text-slate-500 font-semibold">Qualified</div>
        </div>
      </div>

      <div class="bg-white border border-amber-200 p-4 rounded-2xl exec-shadow flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl font-bold">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
          <div class="text-2xl font-extrabold text-amber-800">${review}</div>
          <div class="text-xs text-slate-500 font-semibold">Needs Review</div>
        </div>
      </div>

      <div class="bg-white border border-rose-200 p-4 rounded-2xl exec-shadow flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center text-xl font-bold">
          <i class="fa-solid fa-circle-xmark"></i>
        </div>
        <div>
          <div class="text-2xl font-extrabold text-rose-800">${notFit}</div>
          <div class="text-xs text-slate-500 font-semibold">Not a Fit</div>
        </div>
      </div>

      <div class="bg-white border border-[#967259]/30 p-4 rounded-2xl exec-shadow flex items-center gap-4 col-span-2 lg:col-span-1">
        <div class="w-12 h-12 rounded-xl bg-[#F4ECE4] text-[#967259] flex items-center justify-center text-xl font-bold relative">
          <i class="fa-solid fa-headset"></i>
          ${handoff > 0 ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-[#5C4033] rounded-full animate-ping"></span>' : ''}
        </div>
        <div>
          <div class="text-2xl font-extrabold text-[#5C4033]">${handoff}</div>
          <div class="text-xs text-[#6B5E55] font-semibold">Handoff Pending</div>
        </div>
      </div>
    `;
  }

  renderCandidateContent() {
    const container = document.getElementById("candidate-pipeline-content");
    if (!container) return;

    if (this.filteredCandidates.length === 0) {
      container.innerHTML = `
        <div class="bg-white border border-[#E5E0DA] rounded-2xl p-12 text-center space-y-3 exec-shadow">
          <div class="w-16 h-16 rounded-full bg-[#F0ECE6] text-[#A3968C] flex items-center justify-center text-2xl mx-auto">
            <i class="fa-solid fa-folder-open"></i>
          </div>
          <h3 class="text-lg font-bold text-[#2C221E]">No candidates match filters</h3>
          <p class="text-[#6B5E55] text-xs max-w-sm mx-auto">Try clearing search filters or initiate a chatbot intake on the landing page.</p>
        </div>
      `;
      return;
    }

    if (this.currentViewMode === 'table') {
      this.renderTable(container);
    } else {
      this.renderKanban(container);
    }
  }

  renderTable(container) {
    const rowsHTML = this.filteredCandidates.map(c => {
      const statusBadge = this.getStatusBadge(c.status, c.handoffRequested);
      const appliedDate = new Date(c.appliedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      
      return `
        <tr class="border-b border-[#E5E0DA] hover:bg-[#F8F6F2] transition-colors group cursor-pointer" onclick="window.dashboardApp.openDetailModal('${c.id}')">
          <!-- Candidate Name & Email -->
          <td class="py-4 px-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#5C4033] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                ${c.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="font-bold text-[#2C221E] text-sm group-hover:text-[#967259] transition-colors flex items-center gap-2">
                  ${c.fullName}
                  ${c.handoffRequested ? '<span title="Human handoff requested" class="text-[#5C4033] text-xs"><i class="fa-solid fa-headset"></i></span>' : ''}
                </div>
                <div class="text-xs text-[#6B5E55]">${c.email}</div>
              </div>
            </div>
          </td>

          <!-- Target Role & Experience -->
          <td class="py-4 px-6">
            <div class="text-sm font-semibold text-[#2C221E]">${c.targetRole}</div>
            <div class="text-xs text-[#6B5E55]">${c.experienceYears} Yrs Exp • ${c.workMode || 'Hybrid'}</div>
          </td>

          <!-- Match Score -->
          <td class="py-4 px-6">
            <div class="flex items-center gap-2">
              <div class="w-12 bg-[#E5E0DA] h-2 rounded-full overflow-hidden">
                <div class="h-full ${c.matchScore >= 75 ? 'bg-emerald-600' : c.matchScore >= 50 ? 'bg-amber-600' : 'bg-rose-600'}" style="width: ${c.matchScore}%"></div>
              </div>
              <span class="text-xs font-bold ${c.matchScore >= 75 ? 'text-emerald-800' : c.matchScore >= 50 ? 'text-amber-800' : 'text-rose-800'}">${c.matchScore}%</span>
            </div>
          </td>

          <!-- Status Badge & Selector -->
          <td class="py-4 px-6" onclick="event.stopPropagation()">
            <div class="flex items-center gap-2">
              ${statusBadge}
              <select 
                onchange="window.dashboardApp.changeStatus('${c.id}', this.value)"
                class="bg-[#F8F6F2] text-[#2C221E] text-[11px] font-medium border border-[#E5E0DA] rounded-lg px-2 py-1 focus:outline-none hover:border-[#5C4033]"
              >
                <option value="Qualified" ${c.status === 'Qualified' ? 'selected' : ''}>Set Qualified</option>
                <option value="Needs Review" ${c.status === 'Needs Review' ? 'selected' : ''}>Set Review</option>
                <option value="Not a Fit" ${c.status === 'Not a Fit' ? 'selected' : ''}>Set Not Fit</option>
              </select>
            </div>
          </td>

          <!-- Resume Link -->
          <td class="py-4 px-6 text-xs text-[#6B5E55]">
            <span class="inline-flex items-center gap-1.5 text-[#5C4033] hover:underline font-semibold">
              <i class="fa-solid fa-file-pdf text-[#967259]"></i>
              ${c.resumeFileName || 'Resume.pdf'}
            </span>
          </td>

          <!-- Date & Action -->
          <td class="py-4 px-6 text-right">
            <div class="text-xs text-[#6B5E55] mb-1 font-medium">${appliedDate}</div>
            <button 
              onclick="event.stopPropagation(); window.dashboardApp.openDetailModal('${c.id}')"
              class="text-xs bg-[#F0ECE6] hover:bg-[#5C4033] text-[#2C221E] hover:text-white px-3 py-1 rounded-lg border border-[#E5E0DA] transition-all font-semibold"
            >
              View Profile
            </button>
          </td>
        </tr>
      `;
    }).join("");

    container.innerHTML = `
      <div class="bg-white border border-[#E5E0DA] rounded-2xl exec-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#F0ECE6] border-b border-[#E5E0DA] text-[#5C4033] text-xs font-bold uppercase tracking-wider">
                <th class="py-4 px-6">Candidate</th>
                <th class="py-4 px-6">Target Role</th>
                <th class="py-4 px-6">AI Score</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6">Resume</th>
                <th class="py-4 px-6 text-right">Applied</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5E0DA]">
              ${rowsHTML}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderKanban(container) {
    const statuses = ['Qualified', 'Needs Review', 'Not a Fit'];
    
    const columnsHTML = statuses.map(st => {
      const list = this.filteredCandidates.filter(c => c.status === st);
      
      const cardsHTML = list.map(c => `
        <div 
          onclick="window.dashboardApp.openDetailModal('${c.id}')"
          class="bg-white border border-[#E5E0DA] hover:border-[#5C4033] p-4 rounded-xl exec-shadow space-y-3 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-bold text-[#2C221E] text-sm group-hover:text-[#967259] transition-colors">${c.fullName}</h4>
              <p class="text-xs text-[#6B5E55]">${c.targetRole}</p>
            </div>
            <span class="text-xs font-bold px-2 py-0.5 rounded ${c.matchScore >= 75 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : c.matchScore >= 50 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}">
              ${c.matchScore}%
            </span>
          </div>

          <div class="flex flex-wrap gap-1 text-[10px]">
            ${(c.skills || []).slice(0, 3).map(s => `<span class="bg-[#F0ECE6] text-[#2C221E] px-2 py-0.5 rounded-md border border-[#E5E0DA] font-semibold">${s}</span>`).join("")}
          </div>

          <div class="flex items-center justify-between text-[11px] text-[#6B5E55] border-t border-[#E5E0DA] pt-2 font-medium">
            <span><i class="fa-solid fa-briefcase mr-1 text-[#967259]"></i>${c.experienceYears} Yrs Exp</span>
            <span><i class="fa-solid fa-location-dot mr-1 text-[#967259]"></i>${c.workMode || 'Remote'}</span>
          </div>

          ${c.handoffRequested ? `
            <div class="bg-[#F4ECE4] border border-[#967259]/40 rounded-lg p-2 text-[11px] text-[#5C4033] flex items-center gap-1.5 font-semibold">
              <i class="fa-solid fa-headset text-[#967259]"></i>
              <span>Handoff Requested</span>
            </div>
          ` : ''}
        </div>
      `).join("");

      return `
        <div class="bg-[#F0ECE6]/60 border border-[#E5E0DA] p-4 rounded-2xl space-y-4 flex flex-col">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-[#2C221E] text-sm flex items-center gap-2">
              <span>${st}</span>
              <span class="bg-white text-[#5C4033] px-2 py-0.5 rounded-full text-xs font-extrabold border border-[#E5E0DA]">${list.length}</span>
            </h3>
          </div>

          <div class="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
            ${list.length > 0 ? cardsHTML : '<div class="text-xs text-[#A3968C] p-4 text-center">No candidates</div>'}
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${columnsHTML}
      </div>
    `;
  }

  getStatusBadge(status, handoffRequested = false) {
    if (handoffRequested) {
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F4ECE4] text-[#5C4033] border border-[#967259]/30"><i class="fa-solid fa-headset"></i> Handoff Requested</span>`;
    }
    switch (status) {
      case 'Qualified':
        return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300"><i class="fa-solid fa-circle-check"></i> Qualified</span>`;
      case 'Needs Review':
        return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300"><i class="fa-solid fa-triangle-exclamation"></i> Needs Review</span>`;
      default:
        return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300"><i class="fa-solid fa-circle-xmark"></i> Not a Fit</span>`;
    }
  }

  openDetailModal(candidateId) {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    this.selectedCandidate = candidate;
    const modal = document.getElementById("candidate-detail-modal");
    const container = modal.querySelector(".bg-white");

    const evalResult = candidate.screeningResult || ScreeningEngine.evaluateCandidate(candidate);

    container.innerHTML = `
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-[#E5E0DA] bg-[#F0ECE6]/80">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[#5C4033] flex items-center justify-center text-white font-bold text-lg shadow-md">
            ${candidate.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="flex items-center gap-3">
              <h3 class="text-xl font-extrabold text-[#2C221E]">${candidate.fullName}</h3>
              ${this.getStatusBadge(candidate.status, candidate.handoffRequested)}
            </div>
            <p class="text-[#6B5E55] text-xs font-medium">${candidate.targetRole} • Applied ${new Date(candidate.appliedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <button onclick="window.dashboardApp.closeDetailModal()" class="text-[#6B5E55] hover:text-[#2C221E] p-2 rounded-lg hover:bg-[#E5E0DA]">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Modal Body (Two-Column Layout) -->
      <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Candidate Info & Resume -->
        <div class="lg:col-span-6 space-y-6">
          <!-- Overview Cards -->
          <div class="bg-[#F8F6F2] border border-[#E5E0DA] p-4 rounded-xl space-y-3">
            <h4 class="text-xs font-bold text-[#5C4033] uppercase tracking-wider">Candidate Contact & Overview</h4>
            
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-[#6B5E55] block font-medium">Email Address</span>
                <span class="text-[#2C221E] font-bold">${candidate.email}</span>
              </div>
              <div>
                <span class="text-[#6B5E55] block font-medium">Phone</span>
                <span class="text-[#2C221E] font-bold">${candidate.phone || 'N/A'}</span>
              </div>
              <div>
                <span class="text-[#6B5E55] block font-medium">Experience</span>
                <span class="text-[#2C221E] font-bold">${candidate.experienceYears} Years</span>
              </div>
              <div>
                <span class="text-[#6B5E55] block font-medium">Location / Mode</span>
                <span class="text-[#2C221E] font-bold">${candidate.location || 'Remote'} (${candidate.workMode})</span>
              </div>
              <div>
                <span class="text-[#6B5E55] block font-medium">Availability</span>
                <span class="text-[#2C221E] font-bold">${candidate.availability || 'Immediate'}</span>
              </div>
              <div>
                <span class="text-[#6B5E55] block font-medium">Salary Target</span>
                <span class="text-[#2C221E] font-bold">${candidate.salaryExpectation || 'Negotiable'}</span>
              </div>
            </div>
          </div>

          <!-- Skills Chips -->
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-[#6B5E55] uppercase tracking-wider">Skills & Technologies</h4>
            <div class="flex flex-wrap gap-1.5">
              ${(candidate.skills || []).map(s => `
                <span class="px-2.5 py-1 rounded-lg text-xs bg-[#F0ECE6] text-[#2C221E] border border-[#E5E0DA] font-semibold">${s}</span>
              `).join("")}
            </div>
          </div>

          <!-- Resume Text Preview -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-[#6B5E55] uppercase tracking-wider flex items-center gap-2">
                <i class="fa-solid fa-file-lines text-[#967259]"></i>
                Resume Content (${candidate.resumeFileName || 'Resume.pdf'})
              </h4>
            </div>
            <div class="bg-[#F8F6F2] p-4 rounded-xl border border-[#E5E0DA] text-[#2C221E] text-xs font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
              ${candidate.resumeText || 'No detailed resume text submitted.'}
            </div>
          </div>

          ${candidate.handoffRequested ? `
            <div class="bg-[#F4ECE4] border border-[#967259]/50 p-4 rounded-xl space-y-1">
              <h4 class="text-xs font-bold text-[#5C4033] flex items-center gap-2">
                <i class="fa-solid fa-headset text-[#967259]"></i> Human Recruiter Handoff Note
              </h4>
              <p class="text-xs text-[#2C221E] italic">"${candidate.handoffMessage || 'Candidate requested human follow up during screening.'}"</p>
            </div>
          ` : ''}
        </div>

        <!-- Right Column: AI Screening Insights & Recruiter Notes -->
        <div class="lg:col-span-6 space-y-6">
          <!-- AI Score & Rationale -->
          <div class="bg-[#F8F6F2] border border-[#E5E0DA] p-5 rounded-xl space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-[#5C4033] uppercase tracking-wider">AI Screening Breakdown</h4>
              <span class="text-xl font-extrabold ${evalResult.matchScore >= 75 ? 'text-emerald-800' : evalResult.matchScore >= 50 ? 'text-amber-800' : 'text-rose-800'}">
                ${evalResult.matchScore}% Match
              </span>
            </div>

            <div class="p-3 bg-white rounded-lg border border-[#E5E0DA] text-xs text-[#2C221E]">
              <strong class="text-[#5C4033] block mb-1">Recommendation Summary:</strong>
              ${evalResult.recommendation}
            </div>

            <!-- Strengths -->
            <div class="space-y-1">
              <span class="text-xs font-bold text-emerald-800">Matching Strengths:</span>
              <ul class="text-xs text-[#2C221E] space-y-1 pl-4 list-disc">
                ${(evalResult.strengths || []).map(st => `<li>${st}</li>`).join("")}
              </ul>
            </div>

            <!-- Concerns -->
            ${(evalResult.concerns && evalResult.concerns.length > 0) ? `
              <div class="space-y-1">
                <span class="text-xs font-bold text-rose-800">Gaps & Concerns:</span>
                <ul class="text-xs text-[#2C221E] space-y-1 pl-4 list-disc">
                  ${evalResult.concerns.map(c => `<li>${c}</li>`).join("")}
                </ul>
              </div>
            ` : ''}
          </div>

          <!-- Recruiter Notes & Quick Status Override -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-[#6B5E55] uppercase tracking-wider">Recruiter Decision & Notes</h4>
            
            <div class="flex items-center gap-2">
              <button 
                onclick="window.dashboardApp.updateModalStatus('${candidate.id}', 'Qualified')"
                class="flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${candidate.status === 'Qualified' ? 'bg-emerald-700 text-white border-emerald-700 shadow-md' : 'bg-white text-[#2C221E] border-[#E5E0DA] hover:bg-[#F0ECE6]'}"
              >
                Mark Qualified
              </button>

              <button 
                onclick="window.dashboardApp.updateModalStatus('${candidate.id}', 'Needs Review')"
                class="flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${candidate.status === 'Needs Review' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-[#2C221E] border-[#E5E0DA] hover:bg-[#F0ECE6]'}"
              >
                Needs Review
              </button>

              <button 
                onclick="window.dashboardApp.updateModalStatus('${candidate.id}', 'Not a Fit')"
                class="flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${candidate.status === 'Not a Fit' ? 'bg-rose-700 text-white border-rose-700 shadow-md' : 'bg-white text-[#2C221E] border-[#E5E0DA] hover:bg-[#F0ECE6]'}"
              >
                Not a Fit
              </button>
            </div>

            <textarea 
              id="recruiter-notes-input"
              rows="3" 
              placeholder="Add recruiter notes (e.g. interviewed on phone, salary flexible)..." 
              class="w-full bg-[#F8F6F2] border border-[#E5E0DA] rounded-xl p-3 text-xs text-[#2C221E] placeholder-[#A3968C] focus:outline-none focus:border-[#5C4033]"
            >${candidate.notes || ''}</textarea>

            <div class="flex items-center justify-between">
              <button 
                onclick="window.dashboardApp.saveModalNotes('${candidate.id}')"
                class="bg-[#5C4033] hover:bg-[#432E24] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md"
              >
                Save Recruiter Notes
              </button>

              <button 
                onclick="window.dashboardApp.deleteCandidate('${candidate.id}')"
                class="text-xs text-rose-700 hover:text-rose-900 hover:underline font-semibold"
              >
                Delete Candidate
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
  }

  closeDetailModal() {
    const modal = document.getElementById("candidate-detail-modal");
    if (modal) modal.classList.add("hidden");
    this.selectedCandidate = null;
  }

  changeStatus(candidateId, newStatus) {
    StorageService.updateCandidateStatus(candidateId, newStatus);
    this.refresh();
    this.showToast(`Updated candidate status to ${newStatus}`);
  }

  updateModalStatus(candidateId, newStatus) {
    this.changeStatus(candidateId, newStatus);
    this.openDetailModal(candidateId);
  }

  saveModalNotes(candidateId) {
    const input = document.getElementById("recruiter-notes-input");
    if (input) {
      StorageService.updateCandidateNotes(candidateId, input.value.trim());
      this.refresh();
      this.showToast("Recruiter notes saved!");
    }
  }

  deleteCandidate(candidateId) {
    if (confirm("Are you sure you want to remove this candidate from the pipeline?")) {
      StorageService.deleteCandidate(candidateId);
      this.closeDetailModal();
      this.refresh();
      this.showToast("Candidate removed from pipeline");
    }
  }

  openCriteriaModal() {
    const modal = document.getElementById("criteria-config-modal");
    const criteria = StorageService.getCriteria();

    const rolesHTML = (criteria.roles || []).map((r, idx) => `
      <div class="bg-[#F8F6F2] p-4 rounded-xl border border-[#E5E0DA] space-y-3">
        <h4 class="text-xs font-extrabold text-[#5C4033] uppercase tracking-wider">${r.title} Rules</h4>
        
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label class="text-[#6B5E55] block mb-1 font-semibold">Min Experience (Years)</label>
            <input type="number" value="${r.minExperience}" id="crit-exp-${idx}" class="w-full bg-white border border-[#E5E0DA] rounded px-2.5 py-1 text-[#2C221E] font-bold" />
          </div>
          <div>
            <label class="text-[#6B5E55] block mb-1 font-semibold">Min Score for Qualified (%)</label>
            <input type="number" value="${r.minScoreQualified}" id="crit-score-${idx}" class="w-full bg-white border border-[#E5E0DA] rounded px-2.5 py-1 text-[#2C221E] font-bold" />
          </div>
        </div>

        <div>
          <label class="text-[#6B5E55] block text-xs mb-1 font-semibold">Required Skills (Comma separated)</label>
          <input type="text" value="${(r.requiredSkills || []).join(', ')}" id="crit-skills-${idx}" class="w-full bg-white border border-[#E5E0DA] rounded px-2.5 py-1 text-xs text-[#2C221E] font-medium" />
        </div>
      </div>
    `).join("");

    modal.querySelector(".bg-white").innerHTML = `
      <div class="flex items-center justify-between p-5 border-b border-[#E5E0DA] bg-[#F0ECE6]">
        <h3 class="text-base font-extrabold text-[#2C221E] flex items-center gap-2">
          <i class="fa-solid fa-sliders text-[#967259]"></i> Configure Screening Rules
        </h3>
        <button onclick="document.getElementById('criteria-config-modal').classList.add('hidden')" class="text-[#6B5E55] hover:text-[#2C221E]">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="p-6 space-y-4 overflow-y-auto max-h-[65vh]">
        ${rolesHTML}
      </div>

      <div class="p-4 border-t border-[#E5E0DA] bg-[#F0ECE6] flex justify-end gap-3">
        <button onclick="document.getElementById('criteria-config-modal').classList.add('hidden')" class="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B5E55] hover:text-[#2C221E]">
          Cancel
        </button>
        <button id="save-criteria-btn" class="bg-[#5C4033] hover:bg-[#432E24] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md">
          Save Screening Criteria
        </button>
      </div>
    `;

    modal.classList.remove("hidden");

    document.getElementById("save-criteria-btn").addEventListener("click", () => {
      (criteria.roles || []).forEach((r, idx) => {
        const expEl = document.getElementById(`crit-exp-${idx}`);
        const scoreEl = document.getElementById(`crit-score-${idx}`);
        const skillsEl = document.getElementById(`crit-skills-${idx}`);

        if (expEl) r.minExperience = parseInt(expEl.value, 10) || 3;
        if (scoreEl) r.minScoreQualified = parseInt(scoreEl.value, 10) || 75;
        if (skillsEl) r.requiredSkills = skillsEl.value.split(',').map(s => s.trim()).filter(s => s);
      });

      StorageService.saveCriteria(criteria);
      modal.classList.add("hidden");
      this.showToast("Updated screening rules successfully!");
    });
  }

  exportCSV() {
    if (this.candidates.length === 0) {
      this.showToast("No candidates to export");
      return;
    }

    const headers = ["ID", "Name", "Email", "Role", "Experience (Yrs)", "Status", "AI Match Score", "Applied Date", "Skills"];
    const rows = this.candidates.map(c => [
      c.id,
      `"${c.fullName}"`,
      `"${c.email}"`,
      `"${c.targetRole}"`,
      c.experienceYears,
      c.status,
      `${c.matchScore}%`,
      `"${new Date(c.appliedAt).toLocaleDateString()}"`,
      `"${(c.skills || []).join(', ')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RecruitFlow_Candidates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("Exported candidate pipeline to CSV!");
  }

  attachEventListeners() {
    const searchInput = document.getElementById("dash-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value;
        this.applyFilters();
        this.renderCandidateContent();
      });
    }

    const statusFilter = document.getElementById("dash-status-filter");
    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => {
        this.filters.status = e.target.value;
        this.applyFilters();
        this.renderCandidateContent();
      });
    }

    const roleFilter = document.getElementById("dash-role-filter");
    if (roleFilter) {
      roleFilter.addEventListener("change", (e) => {
        this.filters.role = e.target.value;
        this.applyFilters();
        this.renderCandidateContent();
      });
    }

    const tableBtn = document.getElementById("view-table-btn");
    const kanbanBtn = document.getElementById("view-kanban-btn");

    if (tableBtn && kanbanBtn) {
      tableBtn.addEventListener("click", () => {
        this.currentViewMode = 'table';
        tableBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-[#5C4033] text-white shadow-sm";
        kanbanBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-[#6B5E55] hover:text-[#2C221E]";
        this.renderCandidateContent();
      });

      kanbanBtn.addEventListener("click", () => {
        this.currentViewMode = 'kanban';
        kanbanBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-[#5C4033] text-white shadow-sm";
        tableBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-[#6B5E55] hover:text-[#2C221E]";
        this.renderCandidateContent();
      });
    }

    const criteriaBtn = document.getElementById("open-criteria-modal-btn");
    if (criteriaBtn) {
      criteriaBtn.addEventListener("click", () => this.openCriteriaModal());
    }

    const exportBtn = document.getElementById("export-candidates-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportCSV());
    }

    const resetBtn = document.getElementById("reset-data-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset database to initial sample candidates?")) {
          StorageService.resetAllData();
          this.refresh();
          this.showToast("Database reset to sample candidates!");
        }
      });
    }
  }

  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-6 right-6 z-50 bg-[#2C221E] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce";
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

window.Dashboard = Dashboard;
