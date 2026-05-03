/**
 * SONJIAI Premium Chatbot - Executive Recruiting Assistant
 * Intelligent, persuasive chatbot for Jayson Pardilla's Portfolio
 * Designed to impress recruiters and hiring managers
 */

class JaysonAIChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.userQuestionCount = 0;
        this.init();
    }

    init() {
        this.setupDOM();
        this.attachEventListeners();
        this.loadTheme();
    }

    setupDOM() {
        // Create chatbot container
        const chatbotHTML = `
            <div id="jayson-ai-chatbot-container">
                <!-- Floating Button -->
                <button id="jayson-ai-toggle-btn" class="jayson-ai-toggle-btn" aria-label="Open SONJIAI chatbot" title="Chat with SONJIAI">
                    <span class="jayson-ai-icon">💬</span>
                </button>

                <!-- Chat Window -->
                <div id="jayson-ai-window" class="jayson-ai-window jayson-ai-hidden">
                    <!-- Header -->
                    <div class="jayson-ai-header">
                        <div class="jayson-ai-header-content">
                            <h3 class="jayson-ai-title">SONJIAI</h3>
                            <p class="jayson-ai-subtitle">Recruiting Assistant</p>
                        </div>
                        <button id="jayson-ai-close-btn" class="jayson-ai-close-btn" aria-label="Close chatbot">
                            <span>✕</span>
                        </button>
                    </div>

                    <!-- Messages Area -->
                    <div class="jayson-ai-messages" id="jayson-ai-messages">
                        <!-- Messages will be inserted here -->
                    </div>

                    <!-- Input Area -->
                    <div class="jayson-ai-input-area">
                        <input 
                            type="text" 
                            id="jayson-ai-input" 
                            class="jayson-ai-input" 
                            placeholder="Ask me anything..." 
                            autocomplete="off"
                        >
                        <button id="jayson-ai-send-btn" class="jayson-ai-send-btn" aria-label="Send message">
                            <span>→</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insert at the end of body
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('jayson-ai-toggle-btn');
        const closeBtn = document.getElementById('jayson-ai-close-btn');
        const sendBtn = document.getElementById('jayson-ai-send-btn');
        const input = document.getElementById('jayson-ai-input');

        toggleBtn.addEventListener('click', () => this.toggle());
        closeBtn.addEventListener('click', () => this.close());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Handle mobile keyboard appearance
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            window.addEventListener('resize', () => {
                if (this.isOpen) {
                    this.scrollToBottom();
                }
            });
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('jayson-ai-messages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }

    loadTheme() {
        // Apply theme on first load
        if (this.isOpen) {
            this.showInitialGreeting();
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        const window = document.getElementById('jayson-ai-window');
        window.classList.remove('jayson-ai-hidden');
        window.classList.add('jayson-ai-visible');

        // Show initial greeting on first open
        if (this.messages.length === 0) {
            this.showInitialGreeting();
        }

        // Focus input
        setTimeout(() => {
            document.getElementById('jayson-ai-input').focus();
        }, 300);
    }

    close() {
        this.isOpen = false;
        const window = document.getElementById('jayson-ai-window');
        window.classList.remove('jayson-ai-visible');
        window.classList.add('jayson-ai-hidden');
    }

    showInitialGreeting() {
        const greeting = `Hello, I'm SONJIAI 👋
Recruiting Assistant for Jayson Pardilla.

I can help you quickly evaluate his skills, technical strengths, experience, projects, and hiring value.

Try asking:
• Why hire Jayson?
• What is his tech stack?
• What projects has he built?
• Is he a strong backend developer?`;
        
        this.addMessage('bot', greeting);
    }

    sendMessage() {
        const input = document.getElementById('jayson-ai-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        input.value = '';

        // Increment question count
        this.userQuestionCount++;

        // Get and add bot response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage('bot', response);
            
            // Bonus feature: suggest resume review after 3 questions
            if (this.userQuestionCount === 3) {
                setTimeout(() => {
                    const suggestion = `By the way, would you like to review Jayson's resume or discuss hiring opportunities?`;
                    this.addMessage('bot', suggestion);
                }, 800);
            }
        }, 300);
    }

    addMessage(sender, text) {
        this.messages.push({ sender, text });
        
        const messagesContainer = document.getElementById('jayson-ai-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `jayson-ai-message jayson-ai-message-${sender}`;
        messageEl.innerHTML = `<div class="jayson-ai-message-content">${this.escapeHTML(text)}</div>`;
        
        messagesContainer.appendChild(messageEl);
        
        // Auto-scroll to latest message
        this.scrollToBottom();
    }

    generateResponse(message) {
        const msg = message.toLowerCase();
        
        // Premium intent-based responses (prioritized order)
        const intents = [
            {
                keywords: ['hire', 'worth it', 'should we hire', 'employ', 'recruiter', 'candidate', 'valuable', 'why hire'],
                response: `Jayson is a strong full-stack developer who combines backend engineering, frontend development, and practical problem-solving. He focuses on building scalable, secure, and business-ready solutions, making him a valuable candidate for modern development teams.`
            },
            {
                keywords: ['experience', 'background', 'years', 'expertise', 'worked', 'practical'],
                response: `Jayson has hands-on experience building real-world web applications, backend systems, responsive interfaces, authentication flows, and database-driven platforms. He continuously improves his skills to stay aligned with modern industry standards.`
            },
            {
                keywords: ['tech stack', 'stack', 'technologies', 'tools', 'frameworks', 'languages'],
                response: `Primary stack includes Python, Django, React, JavaScript, MySQL, REST APIs, GitHub, Flutter, PHP, and Laravel. He is especially strong in backend architecture using Python and Django.`
            },
            {
                keywords: ['backend', 'server', 'django', 'python', 'api', 'database', 'auth'],
                response: `Jayson's backend strengths include Django development, REST API architecture, authentication systems, database design, business logic implementation, and scalable application structure.`
            },
            {
                keywords: ['frontend', 'react', 'ui', 'ux', 'interface', 'javascript', 'html', 'css'],
                response: `Jayson builds responsive and clean user interfaces using React, JavaScript, HTML, and CSS with strong attention to usability and performance.`
            },
            {
                keywords: ['projects', 'project', 'built', 'portfolio', 'systems', 'created'],
                response: `Jayson has built multiple practical systems including e-commerce platforms, real-time communication features, authentication-based applications, business websites, and portfolio-grade web solutions.`
            },
            {
                keywords: ['teamwork', 'team', 'communication', 'adapt', 'attitude', 'culture', 'soft skills'],
                response: `Jayson is growth-driven, adaptable, and solution-oriented. He learns quickly, communicates clearly, and values building reliable systems that contribute to team success.`
            },
            {
                keywords: ['learning', 'improve', 'growth', 'future', 'evolving', 'modern'],
                response: `Jayson continuously studies new technologies and modern development practices. He is committed to long-term growth and staying competitive in the software industry.`
            },
            {
                keywords: ['contact', 'email', 'reach', 'message', 'interview'],
                response: `You can reach Jayson through the Contact section of this portfolio to discuss opportunities, interviews, or collaborations.`
            },
            {
                keywords: ['resume', 'cv', 'qualifications'],
                response: `Please visit the Resume section to review Jayson's qualifications, technical background, and experience summary.`
            },
            {
                keywords: ['who is jayson', 'about jayson', 'tell me about jayson', 'who are you'],
                response: `Jayson Pardilla is a dedicated Full-Stack Developer focused on delivering scalable, secure, and modern software solutions with strong backend expertise.`
            },
            {
                keywords: ['strengths', 'strong in', 'good at'],
                response: `Jayson excels in full-stack development, with particular strength in backend architecture, database design, and API development. He also builds polished, responsive frontend interfaces and takes a pragmatic approach to problem-solving.`
            }
        ];

        // Check each intent (first match wins)
        for (const intent of intents) {
            if (intent.keywords.some(keyword => msg.includes(keyword))) {
                return intent.response;
            }
        }

        // Premium default/fallback response
        return `I'd be happy to help evaluate Jayson's qualifications. Try asking:
• Why hire Jayson?
• What are his strengths?
• Is he strong in backend development?
• What technologies does he use?`;
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new JaysonAIChatbot();
});
