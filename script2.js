/**
 * KARAN SAINI | CINEMATIC ANIME PORTFOLIO
 * Vanilla JavaScript Controller
 * 
 * Architecture:
 *   1. Video Source Mapping & Performance Management
 *   2. Continuous Water / Liquid Cursor Trail
 *   3. Website Opening Animation
 *   4. Scene Navigation & Dimension-Hop Transitions
 *   5. Domain Expansion Timed Sequence & Video Control (5s to 35s)
 *   6. Ability Nodes & Skill Panel Accordion
 *   7. Mobile Navigation Drawer
 *   8. Satoru Gojo AI Portfolio Helper & Knowledge Engine
 */

// ================= 1. VIDEO SOURCE MAPPING =================
const videos = {
    home: "assets/videos/home.mp4",
    domain: "assets/videos/domain.mp4",
    projects: "assets/videos/projects.mp4",
    about: "assets/videos/about.mp4"
};

// Video Elements
const videoHome = document.getElementById("video-home");
const videoDomain = document.getElementById("video-domain");
const videoProjects = document.getElementById("video-projects");
const videoAbout = document.getElementById("video-about");

const sceneVideos = {
    home: videoHome,
    domain: videoDomain,
    projects: videoProjects,
    about: videoAbout
};

// ================= 2. CONTINUOUS WATER / LIQUID CURSOR TRAIL =================
const trailCanvas = document.getElementById("liquidTrailCanvas");

if (trailCanvas && window.matchMedia("(pointer: fine)").matches) {
    const ctx = trailCanvas.getContext("2d");
    let width = (trailCanvas.width = window.innerWidth);
    let height = (trailCanvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = trailCanvas.width = window.innerWidth;
        height = trailCanvas.height = window.innerHeight;
    });

    const points = [];
    const MAX_POINTS = 38;
    let lastX = -100;
    let lastY = -100;
    let isMoving = false;
    let idleTimer = null;

    window.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;

        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Calculate velocity-based stretching factor
        const speed = Math.min(Math.max(dist, 2), 40);

        points.push({
            x: x,
            y: y,
            age: 0,
            maxAge: Math.min(18 + speed * 0.4, 32),
            width: Math.min(14 + speed * 0.35, 24)
        });

        if (points.length > MAX_POINTS) {
            points.shift();
        }

        lastX = x;
        lastY = y;
        isMoving = true;

        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            isMoving = false;
        }, 120);
    });

    function renderLiquidTrail() {
        ctx.clearRect(0, 0, width, height);

        if (points.length > 1) {
            // Render layered fluid ribbon
            for (let i = 0; i < points.length; i++) {
                points[i].age += 1;
            }

            // Remove decayed points
            while (points.length > 0 && points[0].age >= points[0].maxAge) {
                points.shift();
            }

            if (points.length > 2) {
                // Pass 1: Soft Outer Water Glow
                ctx.save();
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.shadowBlur = 18;
                ctx.shadowColor = "rgba(0, 229, 255, 0.75)";

                for (let i = 1; i < points.length; i++) {
                    const prev = points[i - 1];
                    const curr = points[i];
                    const progress = i / points.length;
                    const alpha = Math.max(0, (1 - curr.age / curr.maxAge) * progress);

                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(curr.x, curr.y);
                    ctx.strokeStyle = `rgba(0, 180, 255, ${alpha * 0.45})`;
                    ctx.lineWidth = curr.width * 1.6;
                    ctx.stroke();
                }
                ctx.restore();

                // Pass 2: Continuous Fluid Core with Electric Blue -> Purple Gradient
                ctx.save();
                ctx.lineCap = "round";
                ctx.lineJoin = "round";

                for (let i = 1; i < points.length; i++) {
                    const prev = points[i - 1];
                    const curr = points[i];
                    const progress = i / points.length;
                    const lifeRatio = 1 - curr.age / curr.maxAge;
                    const alpha = Math.max(0, lifeRatio * progress);

                    // Dynamic liquid gradient between segments
                    const grad = ctx.createLinearGradient(prev.x, prev.y, curr.x, curr.y);
                    grad.addColorStop(0, `rgba(157, 78, 221, ${alpha * 0.6})`);
                    grad.addColorStop(0.5, `rgba(0, 210, 255, ${alpha * 0.9})`);
                    grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.95})`);

                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(curr.x, curr.y);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = curr.width * progress;
                    ctx.stroke();
                }
                ctx.restore();

                // Pass 3: Leading Liquid Droplet Head
                const head = points[points.length - 1];
                if (head) {
                    ctx.save();
                    const headGrad = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
                    headGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
                    headGrad.addColorStop(0.35, "rgba(0, 229, 255, 0.85)");
                    headGrad.addColorStop(1, "rgba(157, 78, 221, 0)");

                    ctx.fillStyle = headGrad;
                    ctx.beginPath();
                    ctx.arc(head.x, head.y, 14, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        }

        requestAnimationFrame(renderLiquidTrail);
    }

    renderLiquidTrail();
}

// ================= 3. SCENE NAVIGATION & DIMENSION TRANSITIONS =================
const pages = document.querySelectorAll(".page");
const navTriggers = document.querySelectorAll("[data-page]");
const navBar = document.getElementById("navbar");
const navContainer = document.getElementById("navContainer");
const navToggle = document.getElementById("navToggle");
const sceneOverlay = document.getElementById("sceneOverlay");
const shardLinks = document.querySelectorAll(".nav-shard-link");

let currentActivePage = "home";
let domainTimeouts = [];

/**
 * Switch scenes with a cinematic dimension hop effect
 * @param {string} pageId - Target scene ID
 */
function showPage(pageId) {
    if (!pageId) return;

    const targetPage = document.getElementById(pageId);
    if (!targetPage) return;

    // Trigger Dimension Hop Flash
    if (sceneOverlay && pageId !== currentActivePage) {
        sceneOverlay.classList.remove("flash");
        void sceneOverlay.offsetWidth; // Trigger reflow
        sceneOverlay.classList.add("flash");
    }

    // Update active page container
    pages.forEach((page) => {
        if (page.id === pageId) {
            page.classList.add("active");
            page.scrollTop = 0;
        } else {
            page.classList.remove("active");
        }
    });

    // Update Navigation Shards
    shardLinks.forEach((link) => {
        if (link.dataset.page === pageId) {
            link.classList.add("active-link");
        } else {
            link.classList.remove("active-link");
        }
    });

    // Update Navbar Layout:
    // Home scene = center floating zig-zag shards
    // Other scenes = docked left-side cyber HUD
    if (navBar) {
        navBar.classList.toggle("paged", pageId !== "home");
    }

    // Update AI Assistant scene-specific color theme
    const aiPanelElem = document.getElementById("aiChatPanel");
    const aiContainerElem = document.getElementById("aiHelperContainer");
    if (aiPanelElem) {
        aiPanelElem.dataset.scene = pageId;
    }
    if (aiContainerElem) {
        aiContainerElem.dataset.scene = pageId;
    }

    // Manage Background Videos (Pause inactive to optimize GPU & CPU)
    Object.keys(sceneVideos).forEach((key) => {
        const vid = sceneVideos[key];
        if (!vid) return;

        if (key === pageId) {
            if (key === "domain") {
                // Handled in playDomainSequence()
            } else {
                vid.currentTime = 0;
                const playPromise = vid.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.warn("Video autoplay prevented:", err);
                    });
                }
            }
        } else {
            vid.pause();
        }
    });

    // Handle Domain Sequence when entering Domain
    if (pageId === "domain") {
        playDomainSequence();
    } else {
        stopDomainSequence();
    }

    // Close mobile drawer if open
    if (navContainer && navToggle) {
        navContainer.classList.remove("mobile-open");
        navToggle.classList.remove("open");
    }

    currentActivePage = pageId;
}

// Bind all navigation triggers
navTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const targetPage = trigger.dataset.page;
        if (targetPage) {
            showPage(targetPage);
        }
    });
});

// ================= 4. DOMAIN EXPANSION SEQUENCE CONTROLLER =================
const domainIntro = document.getElementById("domainIntro");
const domainInfo = document.getElementById("domainInfo");
const domainInterface = document.getElementById("domainInterface");
const abilityNodes = document.querySelectorAll(".ability-card");
const skillPanels = document.querySelectorAll(".skill-panel");

// Stop Domain video strictly at 35 seconds without looping
if (videoDomain) {
    videoDomain.loop = false; // MUST NOT loop per requirement

    videoDomain.addEventListener("timeupdate", () => {
        // Stop exactly at 35.0 seconds
        if (videoDomain.currentTime >= 35.0) {
            videoDomain.pause();
            videoDomain.currentTime = 35.0;
        }
    });
}

function clearDomainTimers() {
    domainTimeouts.forEach((t) => clearTimeout(t));
    domainTimeouts = [];
}

function stopDomainSequence() {
    clearDomainTimers();
    if (videoDomain) {
        videoDomain.pause();
    }
    if (domainIntro) domainIntro.classList.remove("show");
    if (domainInfo) domainInfo.classList.remove("show");
    if (domainInterface) domainInterface.classList.remove("show");

    abilityNodes.forEach((node) => node.classList.remove("active"));
    skillPanels.forEach((panel) => panel.classList.remove("active"));
}

function playDomainSequence() {
    stopDomainSequence();

    skillPanels.forEach((panel) => panel.classList.remove("active"));
    abilityNodes.forEach((node) => node.classList.remove("active"));

    // Step 1: Start video at exactly 5 seconds
    if (videoDomain) {
        videoDomain.currentTime = 5.0;
        const playPromise = videoDomain.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                console.warn("Domain video play prevented:", err);
            });
        }
    }

    // Step 2: Show "DOMAIN EXPANSION" title
    const t1 = setTimeout(() => {
        if (domainIntro) domainIntro.classList.add("show");
    }, 200);
    domainTimeouts.push(t1);

    // Step 3: Fade out title after ~1.2s
    const t2 = setTimeout(() => {
        if (domainIntro) domainIntro.classList.remove("show");
    }, 1500);
    domainTimeouts.push(t2);

    // Step 4: Show "Algorithmic Void" + description
    const t3 = setTimeout(() => {
        if (domainInfo) domainInfo.classList.add("show");
    }, 1800);
    domainTimeouts.push(t3);

    const t4 = setTimeout(() => {
        if (domainInfo) domainInfo.classList.remove("show");
    }, 3300);
    domainTimeouts.push(t4);

    // Step 5: Reveal supernatural Domain interface
    const t5 = setTimeout(() => {
        if (domainInterface) domainInterface.classList.add("show");
    }, 3600);
    domainTimeouts.push(t5);
}

// ================= 5. ABILITY NODES & SKILL ACCORDION =================
abilityNodes.forEach((node) => {
    node.addEventListener("click", () => {
        const targetId = node.dataset.target;
        const targetPanel = document.getElementById(targetId);

        if (!targetPanel) return;

        const isCurrentlyActive = targetPanel.classList.contains("active");

        // Close all other panels and deactivate all nodes
        skillPanels.forEach((p) => p.classList.remove("active"));
        abilityNodes.forEach((n) => n.classList.remove("active"));

        // Toggle selected node
        if (!isCurrentlyActive) {
            targetPanel.classList.add("active");
            node.classList.add("active");

            setTimeout(() => {
                targetPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 250);
        }
    });
});

// ================= 6. MOBILE MENU DRAWER TOGGLE =================
if (navToggle && navContainer) {
    navToggle.addEventListener("click", () => {
        const isOpen = navContainer.classList.toggle("mobile-open");
        navToggle.classList.toggle("open", isOpen);
    });

    document.addEventListener("click", (e) => {
        if (navContainer.classList.contains("mobile-open")) {
            if (!navContainer.contains(e.target) && !navToggle.contains(e.target)) {
                navContainer.classList.remove("mobile-open");
                navToggle.classList.remove("open");
            }
        }
    });
}

// ================= 7. SATORU GOJO AI PORTFOLIO HELPER =================
/**
 * Configurable AI API Connection
 * Can point to an external proxy or backend API if configured.
 * Otherwise, the built-in fallback knowledge engine provides immediate,
 * accurate, and persona-driven answers from Karan's portfolio data.
 */
const AI_CONFIG = {
    apiEndpoint: "", // Optional backend URL
    apiKey: ""       // Optional token placeholder
};

const aiHelperContainer = document.getElementById("aiHelperContainer");
const aiTriggerBtn = document.getElementById("aiTriggerBtn");
const aiChatPanel = document.getElementById("aiChatPanel");
const aiChatClose = document.getElementById("aiChatClose");
const aiVoiceToggle = document.getElementById("aiVoiceToggle");
const speakingWave = document.getElementById("speakingWave");
const chatStatusText = document.getElementById("chatStatusText");
const aiChatForm = document.getElementById("aiChatForm");
const aiChatInput = document.getElementById("aiChatInput");
const aiChatMessages = document.getElementById("aiChatMessages");
const aiQuickChips = document.getElementById("aiQuickChips");

// Voice State
let isVoiceMuted = false;
let hasUserInteracted = false;
let lastSpokenText = "";

// Initialize speech synthesis voices safely
if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

/**
 * Strip HTML tags and formatting for natural speech output
 * @param {string} html
 * @returns {string} Clean plain text
 */
function cleanTextForSpeech(html) {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    let clean = tmp.textContent || tmp.innerText || "";
    // Remove bullets, emojis, and extra whitespace for smooth speech
    clean = clean.replace(/[•\u2022]/g, "");
    clean = clean.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "");
    clean = clean.replace(/\s+/g, " ").trim();
    return clean;
}

/**
 * Set active status and animated waveform during speech
 * @param {boolean} isSpeaking
 */
function setSpeakingIndicator(isSpeaking) {
    if (speakingWave) {
        speakingWave.classList.toggle("active", isSpeaking);
    }
    if (chatStatusText) {
        chatStatusText.textContent = isSpeaking
            ? "Speaking // Gojo Guide..."
            : "AI Guide // Domain Assistant";
    }
}

/**
 * Speak AI response using Web Speech Synthesis API
 * Characteristics: calm, confident, playful, deep/clean male anime mentor tone.
 * Operates gracefully with zero crashes if unavailable or muted.
 * @param {string} rawText
 */
function speakAIResponse(rawText) {
    if (isVoiceMuted || !hasUserInteracted) return;

    if (!("speechSynthesis" in window)) {
        console.warn("Voice unavailable: Web Speech API not supported in this browser.");
        return;
    }

    try {
        const clean = cleanTextForSpeech(rawText);
        if (!clean) return;

        lastSpokenText = clean;

        // Cancel previous utterance cleanly
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(clean);

        // Select the most natural charismatic English voice available on device
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
            const chosenVoice =
                voices.find((v) => v.lang.startsWith("en") && /natural|ryan|guy|david|daniel|george|alex|male/i.test(v.name)) ||
                voices.find((v) => v.lang.startsWith("en") && !/female|girl|zira|samantha|victoria|susan/i.test(v.name)) ||
                voices.find((v) => v.lang.startsWith("en")) ||
                voices[0];
            if (chosenVoice) {
                utterance.voice = chosenVoice;
            }
        }

        // Anime mentor voice calibration: confident, slightly lower pitch, relaxed pace
        utterance.rate = 1.02;
        utterance.pitch = 0.94;
        utterance.volume = 1.0;

        utterance.onstart = () => {
            setSpeakingIndicator(true);
        };

        utterance.onend = () => {
            setSpeakingIndicator(false);
        };

        utterance.onerror = (e) => {
            setSpeakingIndicator(false);
            if (e.error !== "canceled" && e.error !== "interrupted") {
                console.warn("Speech synthesis notice:", e.error);
            }
        };

        window.speechSynthesis.speak(utterance);
    } catch (err) {
        setSpeakingIndicator(false);
        console.warn("Speech synthesis fallback:", err);
    }
}

// Voice Mute / Unmute Toggle Button
if (aiVoiceToggle) {
    aiVoiceToggle.addEventListener("click", () => {
        hasUserInteracted = true;
        isVoiceMuted = !isVoiceMuted;

        const iconOn = aiVoiceToggle.querySelector(".voice-icon-on");
        const iconOff = aiVoiceToggle.querySelector(".voice-icon-off");

        if (isVoiceMuted) {
            aiVoiceToggle.classList.add("muted");
            aiVoiceToggle.title = "Unmute Voice";
            if (iconOn) iconOn.style.display = "none";
            if (iconOff) iconOff.style.display = "block";
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
            setSpeakingIndicator(false);
        } else {
            aiVoiceToggle.classList.remove("muted");
            aiVoiceToggle.title = "Mute Voice";
            if (iconOn) iconOn.style.display = "block";
            if (iconOff) iconOff.style.display = "none";
            if (lastSpokenText) {
                speakAIResponse(lastSpokenText);
            }
        }
    });
}

// Toggle chat panel open/close
if (aiTriggerBtn && aiChatPanel) {
    aiTriggerBtn.addEventListener("click", () => {
        hasUserInteracted = true;
        const isOpen = aiChatPanel.classList.toggle("open");
        aiChatPanel.setAttribute("aria-hidden", (!isOpen).toString());
        if (isOpen && aiChatInput) {
            setTimeout(() => aiChatInput.focus(), 300);
        }
    });
}

if (aiChatClose && aiChatPanel) {
    aiChatClose.addEventListener("click", () => {
        aiChatPanel.classList.remove("open");
        aiChatPanel.setAttribute("aria-hidden", "true");
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        setSpeakingIndicator(false);
    });
}

// Bind initial greeting replay button
const initialGreetingReplay = document.querySelector("#aiChatMessages .bubble-replay-btn");
if (initialGreetingReplay) {
    initialGreetingReplay.addEventListener("click", (e) => {
        e.stopPropagation();
        hasUserInteracted = true;
        const text = initialGreetingReplay.previousElementSibling
            ? initialGreetingReplay.previousElementSibling.textContent
            : "Yo! I'm Karan's AI Guide.";
        speakAIResponse(text);
    });
}

// Bind quick question chips
if (aiQuickChips) {
    aiQuickChips.addEventListener("click", (e) => {
        const chip = e.target.closest(".quick-chip");
        if (chip) {
            hasUserInteracted = true;
            const question = chip.dataset.question;
            if (question) {
                handleUserQuestion(question);
            }
        }
    });
}

// Handle chat form submit
if (aiChatForm && aiChatInput) {
    aiChatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        hasUserInteracted = true;
        const text = aiChatInput.value.trim();
        if (text) {
            aiChatInput.value = "";
            handleUserQuestion(text);
        }
    });
}

/**
 * Add message bubble to chat window with auto-wrap and speech replay button
 * @param {string} sender - 'user' or 'ai'
 * @param {string} text - Message HTML or text
 */
function appendChatMessage(sender, text) {
    if (!aiChatMessages) return;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;

    const content = document.createElement("div");
    content.className = "bubble-content";
    content.innerHTML = text;
    bubble.appendChild(content);

    // AI message: attach voice replay button
    if (sender === "ai") {
        const replayBtn = document.createElement("button");
        replayBtn.type = "button";
        replayBtn.className = "bubble-replay-btn";
        replayBtn.setAttribute("aria-label", "Replay voice response");
        replayBtn.title = "Replay voice response";
        replayBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:4px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>Play';
        replayBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            hasUserInteracted = true;
            if (isVoiceMuted) {
                isVoiceMuted = false;
                if (aiVoiceToggle) {
                    aiVoiceToggle.classList.remove("muted");
                    const iconOn = aiVoiceToggle.querySelector(".voice-icon-on");
                    const iconOff = aiVoiceToggle.querySelector(".voice-icon-off");
                    if (iconOn) iconOn.style.display = "block";
                    if (iconOff) iconOff.style.display = "none";
                }
            }
            speakAIResponse(text);
        });
        bubble.appendChild(replayBtn);
    }

    aiChatMessages.appendChild(bubble);

    // Smooth scroll to bottom
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

/**
 * Process user question through knowledge engine with voice generation
 * @param {string} question
 */
function handleUserQuestion(question) {
    hasUserInteracted = true;
    appendChatMessage("user", question);

    // Show typing bubble
    const typingBubble = document.createElement("div");
    typingBubble.className = "chat-bubble ai typing";
    typingBubble.innerHTML = '<div class="bubble-content">Analyzing domain telemetry...</div>';
    aiChatMessages.appendChild(typingBubble);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

    // Natural processing delay
    setTimeout(() => {
        typingBubble.remove();
        const response = generateAIResponse(question);
        appendChatMessage("ai", response);
        // Play speech
        speakAIResponse(response);
    }, 550);
}

/**
 * Knowledge Base Engine for Karan Saini's Portfolio
 * Strictly grounds answers in verified personal & GitHub data without hallucination.
 * Source Priority:
 *  - Personal/Academic: LinkedIn (IIIT Ranchi, ECE, B.Tech, 20 yrs)
 *  - Technical/Projects: GitHub (karanxgojo-cmyk, strictly excludes paneer bhurji)
 *  - Local Portfolio: Verified fallback
 * @param {string} query
 * @returns {string} Formatted response text with Gojo's anime mentor persona
 */
function generateAIResponse(query) {
    const q = query.toLowerCase().trim();

    // 1. Who is Karan / Bio / Overview
    if (q.includes("who is") || q.includes("about karan") || q.includes("who are you") || q.includes("bio") || q.includes("what does karan do")) {
        return "<strong>Karan Saini</strong> is a 20-year-old engineering student, creative developer, and AI enthusiast from India. He is pursuing his B.Tech in Electronics and Communication Engineering (ECE) at IIIT Ranchi. He specializes in uniting Machine Learning, Computer Vision, and modern web architecture to forge cinematic, immersive digital experiences.";
    }

    // 2. Education / Study / College / Degree / Branch
    if (q.includes("study") || q.includes("education") || q.includes("college") || q.includes("degree") || q.includes("branch") || q.includes("institution") || q.includes("iiit") || q.includes("school")) {
        return "Karan is pursuing a <strong>B.Tech</strong> in <strong>Electronics and Communication Engineering (ECE)</strong> at the <strong>Indian Institute of Information Technology, Ranchi (IIIT Ranchi)</strong>. His core academic and engineering focus centers on Artificial Intelligence, Machine Learning algorithms, and scalable web platforms.";
    }

    // 3. Age / Birthday
    if (q.includes("age") || q.includes("how old") || q.includes("birth") || q.includes("years old")) {
        return "Karan Saini is <strong>20 years old</strong>, actively developing cutting-edge AI software and full-stack web applications.";
    }

    // 4. Specific Projects
    if (q.includes("hostelsos") || q.includes("hostel")) {
        return "<strong>HostelSOS</strong> is an AI-powered hostel complaint management platform built by Karan. Students submit facility issues using voice interaction or text. The system deploys machine learning classifiers to automatically categorize incoming complaints and dispatch them directly to the appropriate maintenance department in real time.";
    }

    if (q.includes("cybershield") || q.includes("cyber shield") || q.includes("security")) {
        return "<strong>CyberShield</strong> is an advanced AI cybersecurity threat detection and telemetry monitoring system. It analyzes network traffic patterns to flag anomalies, detect intrusion attempts, and generate automated incident reports.";
    }

    if (q.includes("lidar") || q.includes("oculus")) {
        return "<strong>OCULUS: Adaptive 2.5D LiDAR Mapping</strong> is an autonomous vehicle perception and hierarchical spatial mapping research project. It delivers real-time point-cloud segmentation, 2.5D elevation analysis, and occupancy grid reconstruction built with JavaScript, Python, LiDAR telemetry, and WebGL.";
    }

    if (q.includes("rpg") || q.includes("game")) {
        return "<strong>RPG Game Engine</strong> is a modular Python exploration and combat engine engineered by Karan. It implements entity movement physics, dynamic game state machines, and turn-based battle loops.";
    }

    if (q.includes("apple") || q.includes("clone")) {
        return "<strong>Apple UI Clone</strong> is a high-precision responsive web recreation of Apple's flagship landing interface, focused on modern typography hierarchy, smooth micro-interactions, and fluid CSS styling.";
    }

    if (q.includes("anime portfolio") || q.includes("this website") || q.includes("portfolio website")) {
        return "<strong>Anime Portfolio</strong> is this very website! Built with vanilla modern JavaScript and CSS, featuring custom angular energy shard navigation, continuous liquid cursor physics, and an interactive Domain Expansion scene.";
    }

    // 5. Goals
    if (q.includes("goal") || q.includes("aim") || q.includes("mission") || q.includes("vision")) {
        return "Karan's goal is <strong>building immersive AI-powered digital experiences</strong> that merge cutting-edge machine learning intelligence with cinematic, responsive web interfaces.";
    }

    // 6. Currently Learning
    if (q.includes("currently learning") || q.includes("learning") || q.includes("learn")) {
        return "Karan is currently diving deep into <strong>Advanced Deep Learning architectures, Generative AI models, and real-time spatial computing</strong>.";
    }

    // 7. Coming Next / Future Projects / Roadmap
    if (q.includes("coming next") || q.includes("future") || q.includes("next") || q.includes("roadmap")) {
        return "Upcoming projects on Karan's roadmap include:<br>• <strong>AI Voice Assistant</strong><br>• <strong>Machine Learning Prediction Systems</strong><br>• <strong>Computer Vision & Gesture Recognition</strong><br>• <strong>AI Character Interaction Platform</strong><br>• <strong>Intelligent Automation Tools</strong><br>• <strong>Generative AI Applications</strong>";
    }

    // 8. Projects Overview / GitHub Repositories (Strictly excludes 'paneer bhurji')
    if (q.includes("project") || q.includes("repo") || q.includes("work") || q.includes("github project") || q.includes("built")) {
        return "Karan's real GitHub projects (profile <a href='https://github.com/karanxgojo-cmyk' target='_blank'>karanxgojo-cmyk</a>) include:<br>• <strong>OCULUS: Adaptive 2.5D LiDAR Mapping</strong> (Autonomous perception research)<br>• <strong>HostelSOS</strong> (AI voice complaint management)<br>• <strong>Anime Portfolio</strong> (Cinematic interactive web app)<br>• <strong>RPG Game Engine</strong> (Python combat & exploration engine)<br>• <strong>Apple UI Clone</strong> (High-precision responsive frontend)<br>• <strong>CyberShield</strong> (Cybersecurity telemetry & anomaly detection)<br><br>Feel free to ask about any specific project!";
    }

    // 9. AI Experience & Focus
    if (q.includes("ai experience") || q.includes("artificial intelligence") || q.includes("machine learning") || q.includes("ml") || q.includes("computer vision") || q.includes("deep learning")) {
        return "Karan's AI expertise spans Computer Vision, Machine Learning, and intelligent application design. His toolkit includes Python, NumPy, Pandas, Scikit-Learn, TensorFlow, and OpenCV. He applies these to production-level projects like autonomous LiDAR spatial reconstruction (OCULUS) and natural language voice classification (HostelSOS).";
    }

    // 10. Tech Stack & Skills
    if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("language") || q.includes("tool") || q.includes("framework") || q.includes("code")) {
        return "Inside Karan's technical arsenal:<br>• <strong>AI / ML:</strong> Python, NumPy, Pandas, Scikit-Learn, TensorFlow, OpenCV<br>• <strong>Web Development:</strong> HTML5, CSS3, JavaScript (ES6+), React, Node.js, FastAPI<br>• <strong>Data:</strong> SQL, SQLite, MongoDB, CSV, JSON<br>• <strong>Tools:</strong> Git, GitHub, VS Code, Linux, Docker";
    }

    // 11. Contact / Phone / Email / Socials
    if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("call") || q.includes("reach") || q.includes("hire") || q.includes("message") || q.includes("talk")) {
        const gmailLogo = "<svg viewBox='0 0 48 48' width='14' height='14' style='vertical-align:-2px;margin-right:6px;'><path fill='#4285F4' d='M45 16.2l-5 2.7v19.6c0 1.4-1.1 2.5-2.5 2.5H34V23.7l11-7.5z'/><path fill='#34A853' d='M3 16.2l11 7.5v17.3H10.5C9.1 41 8 39.9 8 38.5V18.9L3 16.2z'/><path fill='#EA4335' d='M34 14.5L24 21.3 14 14.5V8.5c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v6z'/><path fill='#FBBC05' d='M34 14.5v9.2L45 16.2C44.7 15.1 43.7 14.5 42.5 14.5H34z'/><path fill='#C5221F' d='M14 14.5H5.5C4.3 14.5 3.3 15.1 3 16.2l11 7.5V14.5z'/></svg>";
        const phoneLogo = "<svg viewBox='0 0 24 24' width='14' height='14' fill='#00e5ff' style='vertical-align:-2px;margin-right:6px;'><path d='M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z'/></svg>";
        const linkedinLogo = "<svg viewBox='0 0 24 24' width='14' height='14' style='vertical-align:-2px;margin-right:6px;'><path fill='#0A66C2' d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z'/></svg>";
        const githubLogo = "<svg viewBox='0 0 24 24' width='14' height='14' fill='#ffffff' style='vertical-align:-2px;margin-right:6px;'><path fill-rule='evenodd' clip-rule='evenodd' d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'/></svg>";
        const mapsLogo = "<svg viewBox='0 0 48 48' width='14' height='14' style='vertical-align:-2px;margin-right:6px;'><path fill='#4285F4' d='M24 4C14.06 4 6 12.06 6 22c0 7.63 5.06 14.67 12 18.45V29c0-3.31 2.69-6 6-6s6 2.69 6 6v11.45c6.94-3.78 12-10.82 12-18.45C42 12.06 33.94 4 24 4z'/><path fill='#34A853' d='M18 40.45C19.89 41.46 21.91 42 24 42s4.11-.54 6-1.55V29c0-3.31-2.69-6-6-6s-6 2.69-6 6v11.45z'/><path fill='#EA4335' d='M24 4C14.06 4 6 12.06 6 22c0 4.86 2.02 9.27 5.27 12.43L24 19l12.73 15.43C39.98 31.27 42 26.86 42 22C42 12.06 33.94 4 24 4z'/><circle cx='24' cy='22' r='5' fill='#FFFFFF'/></svg>";

        return `You can reach Karan directly through:<br>${gmailLogo} <strong>Email:</strong> <a href='mailto:karanxgojo@gmail.com'>karanxgojo@gmail.com</a><br>${phoneLogo} <strong>Phone:</strong> <a href='tel:7976445823'>+91 7976445823</a><br>${linkedinLogo} <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/karan-saini-14aa09380/' target='_blank'>linkedin.com/in/karan-saini-14aa09380</a><br>${githubLogo} <strong>GitHub:</strong> <a href='https://github.com/karanxgojo-cmyk' target='_blank'>github.com/karanxgojo-cmyk</a><br>${mapsLogo} <strong>Location:</strong> India`;
    }

    // 12. LinkedIn Specific
    if (q.includes("linkedin")) {
        const linkedinLogo = "<svg viewBox='0 0 24 24' width='14' height='14' style='vertical-align:-2px;margin-right:6px;'><path fill='#0A66C2' d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z'/></svg>";
        return `${linkedinLogo} Connect with Karan on LinkedIn: <a href='https://www.linkedin.com/in/karan-saini-14aa09380/' target='_blank'>linkedin.com/in/karan-saini-14aa09380/</a> for his verified academic and engineering milestones at IIIT Ranchi.`;
    }

    // 13. GitHub Specific
    if (q.includes("github")) {
        const githubLogo = "<svg viewBox='0 0 24 24' width='14' height='14' fill='#ffffff' style='vertical-align:-2px;margin-right:6px;'><path fill-rule='evenodd' clip-rule='evenodd' d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'/></svg>";
        return `${githubLogo} Explore all of Karan's open-source repositories and code on GitHub: <a href='https://github.com/karanxgojo-cmyk' target='_blank'>github.com/karanxgojo-cmyk</a>.`;
    }

    // 14. Location
    if (q.includes("location") || q.includes("where is karan") || q.includes("where do you live") || q.includes("country") || q.includes("city")) {
        const mapsLogo = "<svg viewBox='0 0 48 48' width='14' height='14' style='vertical-align:-2px;margin-right:6px;'><path fill='#4285F4' d='M24 4C14.06 4 6 12.06 6 22c0 7.63 5.06 14.67 12 18.45V29c0-3.31 2.69-6 6-6s6 2.69 6 6v11.45c6.94-3.78 12-10.82 12-18.45C42 12.06 33.94 4 24 4z'/><path fill='#34A853' d='M18 40.45C19.89 41.46 21.91 42 24 42s4.11-.54 6-1.55V29c0-3.31-2.69-6-6-6s-6 2.69-6 6v11.45z'/><path fill='#EA4335' d='M24 4C14.06 4 6 12.06 6 22c0 4.86 2.02 9.27 5.27 12.43L24 19l12.73 15.43C39.98 31.27 42 26.86 42 22C42 12.06 33.94 4 24 4z'/><circle cx='24' cy='22' r='5' fill='#FFFFFF'/></svg>";
        return `${mapsLogo} Karan is based in <strong>India</strong> and studies at the Indian Institute of Information Technology, Ranchi (IIIT Ranchi).`;
    }

    // 15. Interests & Hobbies
    if (q.includes("interest") || q.includes("hobby") || q.includes("like") || q.includes("passionate") || q.includes("free time")) {
        return "Beyond engineering, Karan is inspired by <strong>Anime</strong> (especially Jujutsu Kaisen), <strong>Creative Coding</strong>, and <strong>Fitness</strong>. As he puts it: 'Every project is another step toward becoming the strongest version of myself.'";
    }

    // 16. Polite Domain Redirection
    return "Haha, interesting question! But inside this domain, I specialize in answering questions about <strong>Karan Saini</strong>, his B.Tech studies at IIIT Ranchi, his real AI/web projects (like OCULUS LiDAR and HostelSOS), or how you can connect with him. What would you like to know about his work?";
}

// ================= 8. WEBSITE OPENING ANIMATION SEQUENCE =================
window.addEventListener("load", () => {
    // Start cleanly on Home scene
    showPage("home");

    // Remove loading curtain to trigger the staggered CSS side entrances
    setTimeout(() => {
        document.body.classList.remove("is-loading");
    }, 150);
});
