/**
 * RecruitFlow AI™ - Chatbot Logic & Conversational Controller (Executive White & Brown Theme)
 */

class Chatbot {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.step = 0;
    this.candidateData = {
      fullName: "",
      email: "",
      phone: "",
      targetRole: "Senior Frontend Engineer",
      experienceYears: 3,
      skills: [],
      location: "",
      workMode: "Hybrid",
      availability: "2 weeks notice",
      salaryExpectation: "",
      resumeText: "",
      resumeFileName: "",
      handoffRequested: false,
      handoffMessage: ""
    };
    this.messages = [];
    this.isProcessing = false;

    this.initUI();
  }

  initUI() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="chat-wrapper flex flex-col h-full bg-white border border-[#E5E0DA] rounded-2xl exec-shadow overflow-hidden">
        <!-- Chat Header -->
        <div class="chat-header flex items-center justify-between px-6 py-4 bg-[#F0ECE6]/80 border-b border-[#E5E0DA] backdrop-blur-md">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-[#5C4033] flex items-center justify-center text-white font-bold shadow-md shadow-[#5C4033]/20">
                <i class="fa-solid fa-robot text-lg"></i>
              </div>
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 class="text-[#2C221E] font-bold text-base leading-tight flex items-center gap-2">
                RecruitFlow Assistant
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F4ECE4] text-[#5C4033] border border-[#967259]/30">Active Screener</span>
              </h3>
              <p class="text-[#6B5E55] text-xs font-medium">Automated screening & resume intake</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button id="reset-chat-btn" title="Reset Chat" class="p-2 text-[#6B5E55] hover:text-[#2C221E] rounded-lg hover:bg-[#E5E0DA]/50 transition-colors">
              <i class="fa-solid fa-rotate-right text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Chat Messages Box -->
        <div id="chat-messages-container" class="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth bg-white">
          <!-- Messages will render dynamically here -->
        </div>

        <!-- Interactive Quick Actions / Input Area -->
        <div class="chat-input-area p-4 bg-[#F8F6F2] border-t border-[#E5E0DA]">
          <div id="quick-options-container" class="flex flex-wrap gap-2 mb-3 hidden">
            <!-- Dynamic quick buttons will render here -->
          </div>

          <form id="chat-form" class="flex items-center gap-2">
            <input 
              type="text" 
              id="chat-user-input" 
              placeholder="Type your message..." 
              autocomplete="off"
              class="flex-1 bg-white border border-[#E5E0DA] rounded-xl px-4 py-3 text-[#2C221E] text-sm focus:outline-none focus:border-[#5C4033] focus:ring-1 focus:ring-[#5C4033] transition-all placeholder-[#A3968C]"
            />
            <button 
              type="submit" 
              id="chat-send-btn"
              class="bg-[#5C4033] hover:bg-[#432E24] text-white font-medium px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-[#5C4033]/15 disabled:opacity-50"
            >
              <span>Send</span>
              <i class="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      </div>
    `;

    this.messagesContainer = document.getElementById("chat-messages-container");
    this.quickOptionsContainer = document.getElementById("quick-options-container");
    this.userInput = document.getElementById("chat-user-input");
    this.form = document.getElementById("chat-form");
    this.resetBtn = document.getElementById("reset-chat-btn");

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleUserSubmit();
    });

    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => this.reset());
    }

    // Start Conversation
    this.startConversation();
  }

  startConversation() {
    this.step = 0;
    this.messages = [];
    this.messagesContainer.innerHTML = "";
    
    this.addBotMessage(
      "👋 Hello! Welcome to **RecruitFlow AI™**. I'm your executive screening assistant.\n\nI can help screen your profile and submit your candidate application directly to our hiring team in under 2 minutes!\n\nTo get started, what is your **full name** and **email address**?"
    );
  }

  reset() {
    this.candidateData = {
      fullName: "",
      email: "",
      phone: "",
      targetRole: "Senior Frontend Engineer",
      experienceYears: 3,
      skills: [],
      location: "",
      workMode: "Hybrid",
      availability: "2 weeks notice",
      salaryExpectation: "",
      resumeText: "",
      resumeFileName: "",
      handoffRequested: false,
      handoffMessage: ""
    };
    this.startConversation();
  }

  addBotMessage(text, options = []) {
    const msgId = "msg-" + Date.now() + Math.random().toString(36).substring(2, 5);
    const formattedText = this.formatMarkdown(text);
    
    // Bot Bubble: Light warm gray-ivory (#F0ECE6) with dark brown text (#2C221E) and clean border (#E5E0DA)
    const msgHTML = `
      <div id="${msgId}" class="flex gap-3 max-w-[85%] animate-fade-in">
        <div class="w-8 h-8 rounded-full bg-[#5C4033] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          <i class="fa-solid fa-robot"></i>
        </div>
        <div class="space-y-1">
          <div class="bg-[#F0ECE6] text-[#2C221E] rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-relaxed border border-[#E5E0DA] shadow-sm">
            ${formattedText}
          </div>
          <div class="text-[10px] text-[#A3968C] pl-1">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    `;

    this.messagesContainer.insertAdjacentHTML("beforeend", msgHTML);
    this.scrollToBottom();
    this.renderQuickOptions(options);
  }

  addUserMessage(text) {
    const formattedText = this.formatMarkdown(text);
    // User Bubble: Rich espresso brown (#5C4033) with white text (#FFFFFF)
    const msgHTML = `
      <div class="flex gap-3 max-w-[85%] ml-auto justify-end animate-fade-in">
        <div class="space-y-1 text-right">
          <div class="bg-[#5C4033] text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm leading-relaxed shadow-sm">
            ${formattedText}
          </div>
          <div class="text-[10px] text-[#A3968C] pr-1">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div class="w-8 h-8 rounded-full bg-[#967259] flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
          <i class="fa-solid fa-user"></i>
        </div>
      </div>
    `;

    this.messagesContainer.insertAdjacentHTML("beforeend", msgHTML);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const id = "typing-indicator";
    const html = `
      <div id="${id}" class="flex gap-3 max-w-[85%] animate-fade-in">
        <div class="w-8 h-8 rounded-full bg-[#5C4033] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          <i class="fa-solid fa-robot"></i>
        </div>
        <div class="bg-[#F0ECE6] text-[#6B5E55] rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-1.5 border border-[#E5E0DA]">
          <span class="w-2 h-2 bg-[#5C4033] rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-2 h-2 bg-[#5C4033] rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-2 h-2 bg-[#5C4033] rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
      </div>
    `;
    this.messagesContainer.insertAdjacentHTML("beforeend", html);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const el = document.getElementById("typing-indicator");
    if (el) el.remove();
  }

  renderQuickOptions(options = []) {
    if (!options || options.length === 0) {
      this.quickOptionsContainer.classList.add("hidden");
      this.quickOptionsContainer.innerHTML = "";
      return;
    }

    this.quickOptionsContainer.classList.remove("hidden");
    this.quickOptionsContainer.innerHTML = options.map(opt => `
      <button 
        type="button" 
        data-value="${opt}" 
        class="quick-opt-btn text-xs bg-white hover:bg-[#5C4033] text-[#2C221E] hover:text-white px-3 py-1.5 rounded-lg border border-[#E5E0DA] hover:border-[#5C4033] transition-all font-semibold shadow-sm"
      >
        ${opt}
      </button>
    `).join("");

    const buttons = this.quickOptionsContainer.querySelectorAll(".quick-opt-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-value");
        this.userInput.value = val;
        this.handleUserSubmit();
      });
    });
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  formatMarkdown(text) {
    if (!text) return "";
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
    return html;
  }

  checkHandoffIntent(text) {
    const lower = text.toLowerCase();
    const handoffKeywords = [
      "human", "recruiter", "speak to", "talk to", "real person", 
      "call me", "phone call", "hiring manager", "salary negotiation", 
      "equity", "benefits", "policy", "visa sponsorship", "complaint"
    ];

    return handoffKeywords.some(kw => lower.includes(kw));
  }

  triggerHandoff(userQuery) {
    this.candidateData.handoffRequested = true;
    this.candidateData.handoffMessage = userQuery;

    if (this.candidateData.id) {
      const candidates = StorageService.getCandidates();
      const existing = candidates.find(c => c.id === this.candidateData.id);
      if (existing) {
        existing.handoffRequested = true;
        existing.handoffMessage = userQuery;
        StorageService.saveCandidates(candidates);
      }
    }

    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.addBotMessage(
        `🤝 **Human Recruiter Handoff Initiated**\n\nI've logged your request: *"${userQuery}"*.\n\nOur human recruitment team has been notified on the recruiter dashboard and will prioritize following up with you directly via email (**${this.candidateData.email || 'your contact email'}**)!`
      );
    }, 800);
  }

  handleUserSubmit() {
    const text = this.userInput.value.trim();
    if (!text || this.isProcessing) return;

    this.userInput.value = "";
    this.renderQuickOptions([]);
    this.addUserMessage(text);

    if (this.checkHandoffIntent(text) && this.step > 0) {
      this.triggerHandoff(text);
      return;
    }

    this.processStep(text);
  }

  processStep(userInput) {
    this.isProcessing = true;
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();

      switch (this.step) {
        case 0:
          this.parseNameAndEmail(userInput);
          this.step = 1;
          this.addBotMessage(
            `Nice to meet you, **${this.candidateData.fullName}**! 🚀\n\nWhich target role are you applying for?`,
            ["Senior Frontend Engineer", "Full Stack Developer", "AI / ML Engineer", "Product Manager"]
          );
          break;

        case 1:
          this.candidateData.targetRole = userInput;
          this.step = 2;
          this.addBotMessage(
            `Great choice! For the **${this.candidateData.targetRole}** role, how many **years of relevant experience** do you have, and what are your primary **skills**?\n*(e.g., "4 years exp in React, TypeScript, Node.js")*`,
            ["3 years in React, TypeScript, CSS", "5 years in Python, PyTorch, LLMs", "4 years in Agile, Product Roadmap, Data Analytics"]
          );
          break;

        case 2:
          this.parseExperienceAndSkills(userInput);
          this.step = 3;
          this.addBotMessage(
            `Got it! **${this.candidateData.experienceYears} years experience** with skills: *${this.candidateData.skills.join(", ") || 'General tech skills'}*.\n\nWhat is your **location** and preferred **work mode**?`,
            ["San Francisco, CA (Hybrid)", "Remote (Anywhere)", "New York, NY (Onsite)", "Austin, TX (Remote)"]
          );
          break;

        case 3:
          this.parseLocationAndMode(userInput);
          this.step = 4;
          this.addBotMessage(
            `Understood. What is your **availability** or notice period?`,
            ["Immediate / No notice", "2 weeks notice", "1 month notice"]
          );
          break;

        case 4:
          this.candidateData.availability = userInput;
          this.step = 5;
          this.renderResumeIntakeStep();
          break;

        case 5:
          this.parseResumeText(userInput);
          this.executeScreeningAndSave();
          break;

        case 6:
          if (this.checkHandoffIntent(userInput)) {
            this.triggerHandoff(userInput);
          } else {
            this.addBotMessage(
              `Thanks for asking! I've logged your message: *"${userInput}"*.\n\nIs there anything else I can assist you with, or would you like to speak directly to a recruiter?`,
              ["Request Human Recruiter Call", "What are the next steps?", "Check recruiter dashboard"]
            );
          }
          break;

        default:
          this.addBotMessage("Your application has been received and logged! Thank you.");
      }

      this.isProcessing = false;
    }, 700);
  }

  parseNameAndEmail(text) {
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    if (emailMatch) {
      this.candidateData.email = emailMatch[0];
      let namePart = text.replace(emailMatch[0], '').replace(/my name is|i am|email is|email:|name:/gi, '').trim();
      this.candidateData.fullName = namePart.length > 1 ? namePart : "Candidate";
    } else {
      this.candidateData.fullName = text.split(',')[0].replace(/my name is|i am/gi, '').trim() || "Candidate";
      this.candidateData.email = "candidate@" + Date.now().toString(36) + ".com";
    }
  }

  parseExperienceAndSkills(text) {
    const expMatch = text.match(/(\d+)\s*(?:years?|yrs?)/i) || text.match(/\b(\d+)\b/);
    if (expMatch) {
      this.candidateData.experienceYears = parseInt(expMatch[1], 10);
    } else {
      this.candidateData.experienceYears = 3;
    }

    const commonSkills = [
      "React", "TypeScript", "JavaScript", "Node.js", "Python", "PyTorch", "TensorFlow",
      "LLMs", "CSS", "SQL", "Git", "REST APIs", "Agile", "Product Roadmap", "Data Analytics",
      "Next.js", "Tailwind", "Vue.js", "FastAPI", "Docker", "AWS"
    ];

    const matched = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    if (matched.length > 0) {
      this.candidateData.skills = matched;
    } else {
      this.candidateData.skills = text
        .replace(/\d+\s*years?/gi, '')
        .split(/[,&]/)
        .map(s => s.trim())
        .filter(s => s.length > 1);
    }
  }

  parseLocationAndMode(text) {
    this.candidateData.location = text;
    if (text.toLowerCase().includes('remote')) {
      this.candidateData.workMode = 'Remote';
    } else if (text.toLowerCase().includes('hybrid')) {
      this.candidateData.workMode = 'Hybrid';
    } else if (text.toLowerCase().includes('onsite')) {
      this.candidateData.workMode = 'Onsite';
    } else {
      this.candidateData.workMode = 'Hybrid';
    }
  }

  renderResumeIntakeStep() {
    const intakeId = "resume-intake-" + Date.now();
    this.addBotMessage(
      `📄 **Resume Intake Step**\n\nPlease paste a brief summary/highlights of your resume below, or drag & drop a sample text file:`
    );

    setTimeout(() => {
      const html = `
        <div id="${intakeId}" class="my-3 p-4 bg-[#F8F6F2] border-2 border-dashed border-[#967259]/40 rounded-xl space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-[#5C4033] text-white flex items-center justify-center text-base">
              <i class="fa-solid fa-file-arrow-up"></i>
            </div>
            <div>
              <h4 class="text-[#2C221E] text-xs font-bold">Upload or Paste Resume</h4>
              <p class="text-[#6B5E55] text-[11px]">Supports .txt, .pdf text summary intake</p>
            </div>
          </div>
          
          <textarea 
            id="resume-textarea-${intakeId}"
            rows="3" 
            placeholder="Paste resume experience summary or key accomplishments here..." 
            class="w-full bg-white border border-[#E5E0DA] rounded-lg p-2.5 text-xs text-[#2C221E] placeholder-[#A3968C] focus:outline-none focus:border-[#5C4033]"
          ></textarea>

          <div class="flex items-center justify-between gap-2">
            <input type="file" id="file-input-${intakeId}" accept=".txt,.pdf,.docx" class="hidden" />
            <button 
              type="button" 
              onclick="document.getElementById('file-input-${intakeId}').click()" 
              class="text-xs bg-white hover:bg-[#F0ECE6] text-[#2C221E] px-3 py-1.5 rounded-lg border border-[#E5E0DA] flex items-center gap-1.5 font-semibold"
            >
              <i class="fa-solid fa-paperclip text-[#967259]"></i>
              <span id="file-name-label-${intakeId}">Attach File</span>
            </button>

            <button 
              type="button" 
              id="submit-resume-btn-${intakeId}"
              class="text-xs bg-[#5C4033] hover:bg-[#432E24] text-white font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md"
            >
              <span>Submit & Screen</span>
              <i class="fa-solid fa-bolt text-xs"></i>
            </button>
          </div>
        </div>
      `;

      this.messagesContainer.insertAdjacentHTML("beforeend", html);
      this.scrollToBottom();

      const textarea = document.getElementById(`resume-textarea-${intakeId}`);
      const fileInput = document.getElementById(`file-input-${intakeId}`);
      const fileNameLabel = document.getElementById(`file-name-label-${intakeId}`);
      const submitBtn = document.getElementById(`submit-resume-btn-${intakeId}`);

      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          fileNameLabel.textContent = file.name;
          this.candidateData.resumeFileName = file.name;
          const reader = new FileReader();
          reader.onload = (evt) => {
            textarea.value = evt.target.result;
          };
          reader.readAsText(file);
        }
      });

      submitBtn.addEventListener("click", () => {
        const resumeText = textarea.value.trim() || "Experienced software engineering candidate with proven track record in software architecture, component development, and agile team workflows.";
        this.candidateData.resumeText = resumeText;
        if (!this.candidateData.resumeFileName) {
          this.candidateData.resumeFileName = `${this.candidateData.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        }
        this.addUserMessage(`[Uploaded Resume: ${this.candidateData.resumeFileName}]`);
        this.executeScreeningAndSave();
      });
    }, 300);
  }

  parseResumeText(text) {
    this.candidateData.resumeText = text;
    if (!this.candidateData.resumeFileName) {
      this.candidateData.resumeFileName = `${this.candidateData.fullName.replace(/\s+/g, '_')}_Resume.txt`;
    }
  }

  executeScreeningAndSave() {
    this.step = 6;
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();

      const evaluation = ScreeningEngine.evaluateCandidate(this.candidateData);
      
      const finalCandidate = {
        id: "cand-" + Date.now().toString(36),
        fullName: this.candidateData.fullName || "Candidate",
        email: this.candidateData.email || "candidate@example.com",
        phone: "+1 (555) " + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(1000 + Math.random() * 9000),
        targetRole: this.candidateData.targetRole,
        experienceYears: this.candidateData.experienceYears,
        skills: this.candidateData.skills,
        location: this.candidateData.location || "Remote",
        workMode: this.candidateData.workMode,
        availability: this.candidateData.availability,
        salaryExpectation: this.candidateData.salaryExpectation || "$120,000 - $140,000 / year",
        resumeText: this.candidateData.resumeText || "Candidate submitted experience details during chatbot intake.",
        resumeFileName: this.candidateData.resumeFileName || "Candidate_Resume.pdf",
        appliedAt: new Date().toISOString(),
        status: evaluation.status,
        matchScore: evaluation.matchScore,
        screeningResult: evaluation,
        notes: `Automatically screened by RecruitFlow AI on ${new Date().toLocaleDateString()}. Score: ${evaluation.matchScore}%.`,
        handoffRequested: this.candidateData.handoffRequested,
        handoffMessage: this.candidateData.handoffMessage
      };

      this.candidateData.id = finalCandidate.id;
      StorageService.addCandidate(finalCandidate);

      window.dispatchEvent(new CustomEvent("recruitflow_candidate_added", { detail: finalCandidate }));

      let statusBadge = '';
      if (evaluation.status === 'Qualified') {
        statusBadge = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">✨ Qualified Candidate (Score: ' + evaluation.matchScore + '%)</span>';
      } else if (evaluation.status === 'Needs Review') {
        statusBadge = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">⚠️ Needs Recruiter Review (Score: ' + evaluation.matchScore + '%)</span>';
      } else {
        statusBadge = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">📊 Not a Fit (Score: ' + evaluation.matchScore + '%)</span>';
      }

      const summaryMsg = `
🎯 **Screening Evaluation Complete!**

${statusBadge}

**AI Match Summary:**
• **Target Role:** ${evaluation.targetRoleName}
• **Matching Core Skills:** ${evaluation.matchingSkills.join(', ') || 'General qualifications'}
• **AI Recommendation:** ${evaluation.recommendation}

📥 **Candidate Pipeline Sync:** Your candidate profile has been recorded in the **Recruiter Pipeline Dashboard** under status **${evaluation.status}**.

${evaluation.status === 'Qualified' 
  ? '🎉 **Next Steps:** A recruiter from our team will contact you at **' + finalCandidate.email + '** within 24 hours to schedule your interview!' 
  : 'Thank you for your interest! Our recruiting team reviews all applications. Feel free to ask any additional questions below.'}
      `;

      this.addBotMessage(summaryMsg, [
        "What are the next steps?",
        "Can I speak to a human recruiter?",
        "View Candidate Dashboard"
      ]);
    }, 1000);
  }
}

window.Chatbot = Chatbot;
