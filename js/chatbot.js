/**
 * RecruitFlow AI™ - Chatbot Logic & Conversational Controller
 * Single-Question Flow, HTML Sanitization, Genuine PDF/DOCX/TXT Parser, Validation & Gemini Integration
 */

function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

class Chatbot {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.step = 0;
    this.candidateData = {
      fullName: "",
      email: "",
      phone: "",
      targetRole: "",
      experienceYears: null,
      skills: [],
      location: "",
      workMode: "",
      availability: "",
      salaryExpectation: "",
      resumeText: "",
      resumeFileName: "",
      handoffRequested: false,
      handoffReason: "",
      handoffTimestamp: null
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
          <!-- Messages render here -->
        </div>

        <!-- Interactive Quick Actions / Input Area -->
        <div class="chat-input-area p-4 bg-[#F8F6F2] border-t border-[#E5E0DA]">
          <div id="quick-options-container" class="flex flex-wrap gap-2 mb-3 hidden">
            <!-- Dynamic quick buttons render here -->
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

    this.startConversation();
  }

  startConversation() {
    this.step = 0;
    this.messages = [];
    this.messagesContainer.innerHTML = "";
    
    this.addBotMessage(
      "👋 Hello! Welcome to **RecruitFlow AI™**. I'm your recruitment screening assistant.\n\nTo begin your candidate application, what is your **full name**?"
    );
  }

  reset() {
    this.candidateData = {
      fullName: "",
      email: "",
      phone: "",
      targetRole: "",
      experienceYears: null,
      skills: [],
      location: "",
      workMode: "",
      availability: "",
      salaryExpectation: "",
      resumeText: "",
      resumeFileName: "",
      handoffRequested: false,
      handoffReason: "",
      handoffTimestamp: null
    };
    this.startConversation();
  }

  addBotMessage(text, options = []) {
    const msgId = "msg-" + Date.now() + Math.random().toString(36).substring(2, 5);
    const formattedText = this.formatMarkdown(text);
    
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
    const safeText = escapeHTML(text);
    const formattedText = this.formatMarkdown(safeText);
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

  showTypingIndicator(message = "Processing...") {
    const id = "typing-indicator";
    const html = `
      <div id="${id}" class="flex gap-3 max-w-[85%] animate-fade-in">
        <div class="w-8 h-8 rounded-full bg-[#5C4033] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          <i class="fa-solid fa-robot"></i>
        </div>
        <div class="bg-[#F0ECE6] text-[#6B5E55] rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2 border border-[#E5E0DA]">
          <span class="w-2 h-2 bg-[#5C4033] rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-2 h-2 bg-[#5C4033] rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-2 h-2 bg-[#5C4033] rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          <span class="text-xs font-semibold text-[#5C4033] ml-1">${escapeHTML(message)}</span>
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
        data-value="${escapeHTML(opt)}" 
        class="quick-opt-btn text-xs bg-white hover:bg-[#5C4033] text-[#2C221E] hover:text-white px-3 py-1.5 rounded-lg border border-[#E5E0DA] hover:border-[#5C4033] transition-all font-semibold shadow-sm"
      >
        ${escapeHTML(opt)}
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
    if (this.candidateData.handoffRequested) return;

    this.candidateData.handoffRequested = true;
    this.candidateData.handoffReason = userQuery;
    this.candidateData.handoffTimestamp = new Date().toISOString();

    if (this.candidateData.id) {
      const candidates = StorageService.getCandidates();
      const existing = candidates.find(c => c.id === this.candidateData.id);
      if (existing) {
        existing.handoffRequested = true;
        existing.handoffReason = userQuery;
        existing.handoffTimestamp = this.candidateData.handoffTimestamp;
        StorageService.saveCandidates(candidates);
      }
    }

    this.showTypingIndicator("Notifying recruiter...");
    setTimeout(() => {
      this.hideTypingIndicator();
      this.addBotMessage(
        `🤝 **I'll flag this for a recruiter so they can follow up with you.**\n\nI've logged your request: *"${escapeHTML(userQuery)}"*.\n\nOur human recruitment team has been alerted on the Recruiter Dashboard and will reach out to you directly at **${escapeHTML(this.candidateData.email || 'your email')}**!`
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
        case 0: // Full Name
          if (!userInput || userInput.length < 2) {
            this.addBotMessage("Please enter your full name to proceed.");
            this.isProcessing = false;
            return;
          }
          this.candidateData.fullName = userInput;
          this.step = 1;
          this.addBotMessage(`Nice to meet you, **${escapeHTML(this.candidateData.fullName)}**! What is your **email address**?`);
          break;

        case 1: // Email Input & Validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(userInput)) {
            this.addBotMessage("⚠️ Please provide a valid email address (e.g., `name@example.com`).");
            this.isProcessing = false;
            return;
          }
          this.candidateData.email = userInput;
          this.step = 2;
          this.addBotMessage(
            `Thank you! Which **target role** are you applying for?`,
            ["Senior Frontend Engineer", "Full Stack Developer", "AI / ML Engineer", "Product Manager"]
          );
          break;

        case 2: // Target Role
          if (!userInput) {
            this.addBotMessage("Please select or specify your target role.");
            this.isProcessing = false;
            return;
          }
          this.candidateData.targetRole = userInput;
          this.step = 3;
          this.addBotMessage(
            `Great! How many **years of experience** do you have in total?\n*(Please specify a number, e.g., 3 years or 5)*`,
            ["1 year", "3 years", "5 years", "7+ years"]
          );
          break;

        case 3: // Experience level (CRITICAL FIX: Never default to 3!)
          const expMatch = userInput.match(/(\d+)\s*(?:years?|yrs?)/i) || userInput.match(/\b(\d+)\b/);
          if (!expMatch) {
            this.candidateData.experienceYears = null;
            this.addBotMessage("I couldn't determine your years of experience. Please provide it, for example: 3 years.");
            this.isProcessing = false;
            return;
          }
          this.candidateData.experienceYears = parseInt(expMatch[1], 10);
          this.step = 4;
          this.addBotMessage(
            `Got it (**${this.candidateData.experienceYears} years experience**)! What are your **primary key skills**?\n*(e.g., React, TypeScript, Node.js, Python)*`,
            ["React, TypeScript, CSS", "Python, PyTorch, LLMs", "Product Roadmap, Agile, Jira"]
          );
          break;

        case 4: // Key Skills
          this.parseSkills(userInput);
          this.step = 5;
          this.addBotMessage(`What is your current **location**? (City, State/Country)`);
          break;

        case 5: // Location
          if (!userInput) {
            this.addBotMessage("Please specify your current location.");
            this.isProcessing = false;
            return;
          }
          this.candidateData.location = userInput;
          this.step = 6;
          this.addBotMessage(
            `What is your preferred **work mode**?`,
            ["Remote", "Hybrid", "Onsite"]
          );
          break;

        case 6: // Work Mode
          if (!userInput) {
            this.addBotMessage("Please select your preferred work mode.");
            this.isProcessing = false;
            return;
          }
          this.candidateData.workMode = userInput;
          this.step = 7;
          this.addBotMessage(
            `What is your **availability** or notice period?`,
            ["Immediate / No notice", "2 weeks notice", "1 month notice"]
          );
          break;

        case 7: // Availability
          if (!userInput) {
            this.addBotMessage("Please specify your availability or notice period.");
            this.isProcessing = false;
            return;
          }
          this.candidateData.availability = userInput;
          this.step = 8;
          this.renderResumeIntakeStep();
          break;

        case 8: // Manual resume summary paste
          this.candidateData.resumeText = userInput;
          if (!this.candidateData.resumeFileName) {
            this.candidateData.resumeFileName = `${this.candidateData.fullName.replace(/\s+/g, '_')}_Resume.txt`;
          }
          this.renderSummaryConfirmationStep();
          break;

        default:
          this.addBotMessage("Your candidate profile has been recorded. Thank you.");
      }

      this.isProcessing = false;
    }, 500);
  }

  parseSkills(text) {
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
        .split(/[,&]/)
        .map(s => s.trim())
        .filter(s => s.length > 1);
    }
  }

  renderResumeIntakeStep() {
    const intakeId = "resume-intake-" + Date.now();
    this.addBotMessage(
      `📄 **Resume Intake Step**\n\nPlease upload your resume (**PDF**, **DOCX**, or **TXT** format, max 5MB), or paste your experience summary below:`
    );

    setTimeout(() => {
      const html = `
        <div id="${intakeId}" class="my-3 p-4 bg-[#F8F6F2] border-2 border-dashed border-[#967259]/40 rounded-xl space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-[#5C4033] text-white flex items-center justify-center text-base">
              <i class="fa-solid fa-file-arrow-up"></i>
            </div>
            <div>
              <h4 class="text-[#2C221E] text-xs font-bold">Upload Resume File</h4>
              <p class="text-[#6B5E55] text-[11px]">Supports PDF, DOCX, TXT (Max 5MB)</p>
            </div>
          </div>
          
          <div id="drag-drop-zone-${intakeId}" class="p-3 bg-white rounded-lg border border-[#E5E0DA] text-center cursor-pointer hover:border-[#5C4033] transition-all">
            <p class="text-xs text-[#6B5E55] flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-cloud-arrow-up text-[#967259]"></i>
              <span>Click to select file or drag & drop here</span>
            </p>
          </div>

          <textarea 
            id="resume-textarea-${intakeId}"
            rows="3" 
            placeholder="Or paste resume experience summary here..." 
            class="w-full bg-white border border-[#E5E0DA] rounded-lg p-2.5 text-xs text-[#2C221E] placeholder-[#A3968C] focus:outline-none focus:border-[#5C4033]"
          ></textarea>

          <div id="resume-parse-status-${intakeId}" class="text-[11px] text-[#5C4033] font-medium hidden"></div>

          <div class="flex items-center justify-between gap-2">
            <input type="file" id="file-input-${intakeId}" accept=".pdf,.docx,.txt" class="hidden" />
            <button 
              type="button" 
              onclick="document.getElementById('file-input-${intakeId}').click()" 
              class="text-xs bg-white hover:bg-[#F0ECE6] text-[#2C221E] px-3 py-1.5 rounded-lg border border-[#E5E0DA] flex items-center gap-1.5 font-semibold"
            >
              <i class="fa-solid fa-paperclip text-[#967259]"></i>
              <span id="file-name-label-${intakeId}">Select File</span>
            </button>

            <button 
              type="button" 
              id="submit-resume-btn-${intakeId}"
              class="text-xs bg-[#5C4033] hover:bg-[#432E24] text-white font-semibold px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md"
            >
              <span>Review Summary</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
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
      const parseStatus = document.getElementById(`resume-parse-status-${intakeId}`);
      const dropZone = document.getElementById(`drag-drop-zone-${intakeId}`);

      const processFile = async (file) => {
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
          alert("File size exceeds 5MB limit. Please upload a smaller file.");
          return;
        }

        fileNameLabel.textContent = file.name;
        this.candidateData.resumeFileName = file.name;
        parseStatus.classList.remove("hidden");
        parseStatus.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Extracting text from ${escapeHTML(file.name)}...`;

        const ext = file.name.split('.').pop().toLowerCase();

        try {
          let extractedText = "";

          if (ext === 'pdf') {
            if (!window.pdfjsLib) throw new Error("PDF parser unavailable");
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map(item => item.str).join(" ");
              fullText += pageText + "\n";
            }

            extractedText = fullText.trim();
          } else if (ext === 'docx') {
            if (!window.mammoth) throw new Error("DOCX parser unavailable");
            const arrayBuffer = await file.arrayBuffer();
            const result = await window.mammoth.extractRawText({ arrayBuffer });
            extractedText = (result.value || "").trim();
          } else if (ext === 'txt') {
            extractedText = await file.text();
            extractedText = extractedText.trim();
          } else {
            throw new Error("Unsupported file format.");
          }

          if (!extractedText) {
            // CRITICAL FIX: Explicit Resume Failure UX
            parseStatus.innerHTML = `<span class="text-rose-700 font-bold">⚠️ Resume extraction failed. You can retry the upload or provide a structured experience summary instead.</span>`;
            return;
          }

          textarea.value = extractedText;
          this.candidateData.resumeText = extractedText;
          parseStatus.innerHTML = `<span class="text-emerald-800 font-bold">✓ Successfully extracted ${extractedText.length} characters from ${escapeHTML(file.name)}</span>`;

        } catch (err) {
          console.error("Resume extraction error:", err);
          // CRITICAL FIX: Explicit Resume Failure UX
          parseStatus.innerHTML = `<span class="text-rose-700 font-bold">⚠️ Resume extraction failed. You can retry the upload or provide a structured experience summary instead.</span>`;
        }
      };

      dropZone.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", (e) => processFile(e.target.files[0]));

      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("border-[#5C4033]");
      });

      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("border-[#5C4033]");
        if (e.dataTransfer.files.length > 0) {
          processFile(e.dataTransfer.files[0]);
        }
      });

      submitBtn.addEventListener("click", () => {
        const text = textarea.value.trim();
        if (!text) {
          alert("Please upload a valid resume or paste experience highlights before continuing.");
          return;
        }
        this.candidateData.resumeText = text;
        if (!this.candidateData.resumeFileName) {
          this.candidateData.resumeFileName = `${this.candidateData.fullName.replace(/\s+/g, '_')}_Resume.txt`;
        }
        this.addUserMessage(`[Resume Uploaded: ${this.candidateData.resumeFileName}]`);
        this.renderSummaryConfirmationStep();
      });
    }, 300);
  }

  renderSummaryConfirmationStep() {
    this.step = 9;
    const summaryId = "candidate-summary-" + Date.now();

    const summaryHTML = `
🎯 **Candidate Information Summary**

Please review your details before running AI screening:

• **Full Name:** ${escapeHTML(this.candidateData.fullName)}
• **Email:** ${escapeHTML(this.candidateData.email)}
• **Target Role:** ${escapeHTML(this.candidateData.targetRole)}
• **Experience:** ${this.candidateData.experienceYears} Years
• **Skills:** ${escapeHTML(Array.isArray(this.candidateData.skills) ? this.candidateData.skills.join(', ') : this.candidateData.skills)}
• **Location:** ${escapeHTML(this.candidateData.location)}
• **Work Mode:** ${escapeHTML(this.candidateData.workMode)}
• **Availability:** ${escapeHTML(this.candidateData.availability)}
• **Resume Attached:** ${escapeHTML(this.candidateData.resumeFileName || 'Resume text provided')}
    `;

    this.addBotMessage(summaryHTML);

    setTimeout(() => {
      const actionsHTML = `
        <div id="${summaryId}" class="my-3 flex flex-wrap gap-3">
          <button 
            id="confirm-screen-btn-${summaryId}"
            class="bg-[#5C4033] hover:bg-[#432E24] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
          >
            <span>Confirm & Run Gemini AI Screening</span>
            <i class="fa-solid fa-sparkles text-xs"></i>
          </button>

          <button 
            id="edit-info-btn-${summaryId}"
            class="bg-white hover:bg-[#F0ECE6] text-[#2C221E] text-xs font-semibold px-4 py-2.5 rounded-xl border border-[#E5E0DA]"
          >
            <i class="fa-solid fa-pen-to-square text-[#967259] mr-1"></i> Edit Info
          </button>
        </div>
      `;

      this.messagesContainer.insertAdjacentHTML("beforeend", actionsHTML);
      this.scrollToBottom();

      document.getElementById(`confirm-screen-btn-${summaryId}`).addEventListener("click", () => {
        document.getElementById(summaryId).remove();
        this.addUserMessage("Confirmed. Run Gemini AI screening!");
        this.runGeminiScreening();
      });

      document.getElementById(`edit-info-btn-${summaryId}`).addEventListener("click", () => {
        document.getElementById(summaryId).remove();
        this.startConversation();
      });
    }, 300);
  }

  // REQUIRED FIELD VALIDATION before calling Gemini API
  validateRequiredFields() {
    const missing = [];
    const cd = this.candidateData;

    if (!cd.fullName) missing.push("Full Name");
    if (!cd.email) missing.push("Email");
    if (!cd.targetRole) missing.push("Target Role");
    if (cd.experienceYears === null || cd.experienceYears === undefined) missing.push("Years of Experience");
    if (!cd.skills || cd.skills.length === 0) missing.push("Key Skills");
    if (!cd.location) missing.push("Location");
    if (!cd.workMode) missing.push("Work Mode");
    if (!cd.availability) missing.push("Availability");
    if (!cd.resumeText) missing.push("Resume Text");

    return missing;
  }

  async runGeminiScreening() {
    // CRITICAL FIX: Validate all required fields before calling Gemini
    const missingFields = this.validateRequiredFields();
    if (missingFields.length > 0) {
      this.addBotMessage(
        `⚠️ **Missing Required Candidate Information**\n\nCannot proceed to AI screening. Please provide the following missing details:\n• ${missingFields.join('\n• ')}`
      );
      return;
    }

    this.showTypingIndicator("Connecting to Gemini AI server...");
    const retryId = "retry-container-" + Date.now();

    try {
      // Local frontend (e.g. Live Server / npx serve) talks to the local Express backend.
      // On Vercel, the API is same-origin at /api/*, so no hardcoded deployment URL is needed.
      const isLocalFrontend = ["localhost", "127.0.0.1"].includes(window.location.hostname);
      const API_BASE_URL = isLocalFrontend ? "http://localhost:3001" : "";

      const response = await fetch(`${API_BASE_URL}/api/screen-candidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateProfile: this.candidateData,
          resumeText: this.candidateData.resumeText,
          jobCriteria: StorageService.getCriteria()
        })
      });

      this.hideTypingIndicator();

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: `Server returned HTTP ${response.status}` }));
        throw new Error(errData.error || `Server returned HTTP ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.evaluation) {
        throw new Error(result.error || "Invalid response structure from screening backend");
      }

      const evalData = result.evaluation;

      // CRITICAL FIX: NO FABRICATED PHONE OR SALARY! Save strictly provided values!
      const finalCandidate = {
        id: "cand-" + Date.now().toString(36),
        fullName: this.candidateData.fullName,
        email: this.candidateData.email,
        phone: this.candidateData.phone || "", // NO FAKE PHONE NUMBER!
        targetRole: this.candidateData.targetRole,
        experienceYears: this.candidateData.experienceYears,
        skills: this.candidateData.skills,
        location: this.candidateData.location,
        workMode: this.candidateData.workMode,
        availability: this.candidateData.availability,
        salaryExpectation: this.candidateData.salaryExpectation || "", // NO FAKE SALARY!
        resumeText: this.candidateData.resumeText,
        resumeFileName: this.candidateData.resumeFileName || "Resume.pdf",
        appliedAt: new Date().toISOString(),
        status: evalData.status,
        matchScore: evalData.score,
        screeningResult: evalData,
        notes: `Screened by Gemini AI on ${new Date().toLocaleDateString()}. Score: ${evalData.score}%.`,
        handoffRequested: this.candidateData.handoffRequested,
        handoffReason: this.candidateData.handoffReason,
        handoffTimestamp: this.candidateData.handoffTimestamp
      };

      this.candidateData.id = finalCandidate.id;
      StorageService.addCandidate(finalCandidate);

      window.dispatchEvent(new CustomEvent("recruitflow_candidate_added", { detail: finalCandidate }));

      let statusBadge = '';
      if (evalData.status === 'Qualified') {
        statusBadge = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">✨ Qualified Candidate (Score: ' + evalData.score + '%)</span>';
      } else if (evalData.status === 'Needs Review') {
        statusBadge = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">⚠️ Needs Recruiter Review (Score: ' + evalData.score + '%)</span>';
      } else {
        statusBadge = '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">📊 Not a Fit (Score: ' + evalData.score + '%)</span>';
      }

      const summaryMsg = `
🎯 **Gemini AI Screening Complete!**

${statusBadge}

**AI Evaluation Breakdown:**
• **Matching Core Skills:** ${escapeHTML((evalData.matchedSkills || []).join(', ') || 'Qualifications verified')}
• **Skill Gaps:** ${escapeHTML((evalData.skillGaps || evalData.missingSkills || []).join(', ') || 'None identified')}
• **Strengths:** ${escapeHTML((evalData.strengths || []).join('. '))}
• **AI Rationale:** ${escapeHTML(evalData.rationale)}

📥 **Pipeline Sync:** Your profile has been recorded in the **Recruiter Pipeline Dashboard** under status **${evalData.status}**.

*Disclaimer: AI screening is an assistive recommendation and does not replace recruiter judgment.*
      `;

      this.addBotMessage(summaryMsg, [
        "Can I speak to a human recruiter?",
        "View Candidate Dashboard"
      ]);

    } catch (err) {
      this.hideTypingIndicator();
      console.error("Screening failure:", err);

      // EXPLICIT NO SILENT FALLBACK UX: Show clear error + Retry button
      const errorMsgHTML = `
⚠️ **AI Screening Unavailable**

${escapeHTML(err.message)}

*Note: Screening uses the deployed backend. If the problem continues, verify the backend deployment and its Gemini API configuration.*
      `;

      this.addBotMessage(errorMsgHTML);

      setTimeout(() => {
        const retryHTML = `
          <div id="${retryId}" class="my-3">
            <button 
              id="retry-screening-btn-${retryId}"
              class="bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2"
            >
              <i class="fa-solid fa-rotate-right"></i>
              <span>Retry AI Screening</span>
            </button>
          </div>
        `;
        this.messagesContainer.insertAdjacentHTML("beforeend", retryHTML);
        this.scrollToBottom();

        document.getElementById(`retry-screening-btn-${retryId}`).addEventListener("click", () => {
          document.getElementById(retryId).remove();
          this.addUserMessage("Retrying Gemini AI screening...");
          this.runGeminiScreening();
        });
      }, 300);
    }
  }
}

window.Chatbot = Chatbot;
