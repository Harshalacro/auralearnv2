/**
 * AuraLearn Student Chatbot Widget
 * Embeddable learning assistant for any website
 */

(function () {
    'use strict';

    // Configuration
    const config = {
        botName: 'AuraBot',
        primaryColor: '#6366f1',
        accentColor: '#8b5cf6',
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        apiEndpoint: null, // Set your API endpoint here or pass in initialization
        welcomeMessage: 'Hi! I\'m your learning assistant. How can I help you today?',
        placeholderText: 'Ask me anything about your studies...',
        enableVoice: true,
        enableTypingIndicator: true
    };

    // Main ChatBot class
    class AuraLearnChatbot {
        constructor(userConfig = {}) {
            this.config = { ...config, ...userConfig };
            this.isOpen = false;
            this.messages = [];
            this.isTyping = false;

            this.init();
        }

        init() {
            this.injectStyles();
            this.createWidget();
            this.attachEventListeners();
            this.addWelcomeMessage();
        }

        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                .auralearn-chatbot * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .auralearn-chatbot {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    position: fixed;
                    z-index: 999999;
                    ${this.config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
                    ${this.config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
                }

                .auralearn-chatbot-button {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, ${this.config.primaryColor}, ${this.config.accentColor});
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .auralearn-chatbot-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at center, rgba(255,255,255,0.2), transparent);
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .auralearn-chatbot-button:hover::before {
                    opacity: 1;
                }

                .auralearn-chatbot-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 12px 32px rgba(99, 102, 241, 0.5);
                }

                .auralearn-chatbot-button svg {
                    width: 28px;
                    height: 28px;
                    fill: white;
                    transition: transform 0.3s;
                }

                .auralearn-chatbot-button.active svg {
                    transform: rotate(90deg);
                }

                .auralearn-chatbot-window {
                    position: absolute;
                    ${this.config.position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
                    ${this.config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
                    width: 380px;
                    height: 600px;
                    background: #ffffff;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    opacity: 0;
                    transform: scale(0.8) translateY(20px);
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .auralearn-chatbot-window.open {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                    pointer-events: all;
                }

                .auralearn-chatbot-header {
                    background: linear-gradient(135deg, ${this.config.primaryColor}, ${this.config.accentColor});
                    padding: 20px;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .auralearn-chatbot-header-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .auralearn-chatbot-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }

                .auralearn-chatbot-header-text h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 2px;
                }

                .auralearn-chatbot-header-text p {
                    font-size: 12px;
                    opacity: 0.9;
                }

                .auralearn-chatbot-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: background 0.2s;
                }

                .auralearn-chatbot-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .auralearn-chatbot-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    background: #f8f9fa;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .auralearn-chatbot-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .auralearn-chatbot-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .auralearn-chatbot-messages::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 3px;
                }

                .auralearn-message {
                    display: flex;
                    gap: 10px;
                    animation: messageSlideIn 0.3s ease-out;
                }

                @keyframes messageSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .auralearn-message.user {
                    flex-direction: row-reverse;
                }

                .auralearn-message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, ${this.config.primaryColor}, ${this.config.accentColor});
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    flex-shrink: 0;
                }

                .auralearn-message.user .auralearn-message-avatar {
                    background: #6b7280;
                }

                .auralearn-message-content {
                    max-width: 75%;
                }

                .auralearn-message-bubble {
                    background: white;
                    padding: 12px 16px;
                    border-radius: 16px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    word-wrap: break-word;
                    line-height: 1.5;
                    font-size: 14px;
                    color: #1f2937;
                }

                .auralearn-message.user .auralearn-message-bubble {
                    background: linear-gradient(135deg, ${this.config.primaryColor}, ${this.config.accentColor});
                    color: white;
                }

                .auralearn-message-time {
                    font-size: 11px;
                    color: #9ca3af;
                    margin-top: 6px;
                    padding: 0 4px;
                }

                .auralearn-typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 12px 16px;
                }

                .auralearn-typing-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #9ca3af;
                    animation: typingBounce 1.4s infinite;
                }

                .auralearn-typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .auralearn-typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes typingBounce {
                    0%, 60%, 100% {
                        transform: translateY(0);
                    }
                    30% {
                        transform: translateY(-10px);
                    }
                }

                .auralearn-chatbot-input-container {
                    padding: 16px;
                    background: white;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 10px;
                }

                .auralearn-chatbot-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .auralearn-chatbot-voice-btn {
                    background: #f3f4f6;
                    color: #6b7280;
                }

                .auralearn-chatbot-voice-btn:hover {
                    background: #e5e7eb;
                }

                .auralearn-chatbot-voice-btn.recording {
                    background: #fecaca;
                    color: #dc2626;
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }

                @media (max-width: 480px) {
                    .auralearn-chatbot-window {
                        width: calc(100vw - 40px);
                        height: calc(100vh - 100px);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        createWidget() {
            const container = document.createElement('div');
            container.className = 'auralearn-chatbot';
            container.innerHTML = `
                <button class="auralearn-chatbot-button" aria-label="Open chat">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                        <circle cx="12" cy="10" r="1.5"/>
                        <circle cx="8" cy="10" r="1.5"/>
                        <circle cx="16" cy="10" r="1.5"/>
                    </svg>
                </button>
                <div class="auralearn-chatbot-window">
                    <div class="auralearn-chatbot-header">
                        <div class="auralearn-chatbot-header-content">
                            <div class="auralearn-chatbot-avatar">🤖</div>
                            <div class="auralearn-chatbot-header-text">
                                <h3>${this.config.botName}</h3>
                                <p>Online • Ready to help</p>
                            </div>
                        </div>
                        <button class="auralearn-chatbot-close" aria-label="Close chat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="auralearn-chatbot-messages"></div>
                    <div class="auralearn-chatbot-input-container">
                        ${this.config.enableVoice ? `
                            <button class="auralearn-chatbot-voice-btn" aria-label="Voice input">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                                </svg>
                            </button>
                        ` : ''}
                        <textarea class="auralearn-chatbot-input" 
                                  placeholder="${this.config.placeholderText}" 
                                  rows="1"></textarea>
                        <button class="auralearn-chatbot-send-btn" aria-label="Send message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(container);
            this.container = container;
            this.button = container.querySelector('.auralearn-chatbot-button');
            this.window = container.querySelector('.auralearn-chatbot-window');
            this.messagesContainer = container.querySelector('.auralearn-chatbot-messages');
            this.input = container.querySelector('.auralearn-chatbot-input');
            this.sendBtn = container.querySelector('.auralearn-chatbot-send-btn');
            this.closeBtn = container.querySelector('.auralearn-chatbot-close');
            this.voiceBtn = container.querySelector('.auralearn-chatbot-voice-btn');
        }

        attachEventListeners() {
            this.button.addEventListener('click', () => this.toggleChat());
            this.closeBtn.addEventListener('click', () => this.toggleChat());
            this.sendBtn.addEventListener('click', () => this.handleSend());

            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend();
                }
            });

            this.input.addEventListener('input', () => {
                this.input.style.height = 'auto';
                this.input.style.height = Math.min(this.input.scrollHeight, 100) + 'px';
            });

            if (this.voiceBtn) {
                this.voiceBtn.addEventListener('click', () => this.handleVoiceInput());
            }
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            this.window.classList.toggle('open', this.isOpen);
            this.button.classList.toggle('active', this.isOpen);

            if (this.isOpen) {
                this.input.focus();
            }
        }

        addWelcomeMessage() {
            this.addMessage(this.config.welcomeMessage, 'bot');
        }

        addMessage(text, sender = 'bot') {
            const message = {
                text,
                sender,
                timestamp: new Date()
            };

            this.messages.push(message);
            this.renderMessage(message);
            this.scrollToBottom();
        }

        renderMessage(message) {
            const messageEl = document.createElement('div');
            messageEl.className = `auralearn-message ${message.sender}`;

            const time = message.timestamp.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
            });

            messageEl.innerHTML = `
                <div class="auralearn-message-avatar">
                    ${message.sender === 'bot' ? '🤖' : '👤'}
                </div>
                <div class="auralearn-message-content">
                    <div class="auralearn-message-bubble">${this.escapeHtml(message.text)}</div>
                    <div class="auralearn-message-time">${time}</div>
                </div>
            `;

            this.messagesContainer.appendChild(messageEl);
        }

        showTypingIndicator() {
            if (this.isTyping) return;

            this.isTyping = true;
            const indicator = document.createElement('div');
            indicator.className = 'auralearn-message bot';
            indicator.innerHTML = `
                <div class="auralearn-message-avatar">🤖</div>
                <div class="auralearn-message-content">
                    <div class="auralearn-message-bubble">
                        <div class="auralearn-typing-indicator">
                            <div class="auralearn-typing-dot"></div>
                            <div class="auralearn-typing-dot"></div>
                            <div class="auralearn-typing-dot"></div>
                        </div>
                    </div>
                </div>
            `;
            indicator.setAttribute('data-typing-indicator', 'true');
            this.messagesContainer.appendChild(indicator);
            this.scrollToBottom();
        }

        hideTypingIndicator() {
            this.isTyping = false;
            const indicator = this.messagesContainer.querySelector('[data-typing-indicator]');
            if (indicator) {
                indicator.remove();
            }
        }

        async handleSend() {
            const text = this.input.value.trim();
            if (!text) return;

            // Add user message
            this.addMessage(text, 'user');
            this.input.value = '';
            this.input.style.height = 'auto';

            // Show typing indicator
            if (this.config.enableTypingIndicator) {
                this.showTypingIndicator();
            }

            // Get bot response
            const response = await this.getBotResponse(text);

            if (this.config.enableTypingIndicator) {
                this.hideTypingIndicator();
            }
            // Greetings
            if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
                const greetings = [
                    'Hello! 👋 I\'m your learning assistant. Ask me anything about your studies!',
                    'Hi there! Ready to learn something new today? What can I help you with?',
                    'Hey! I\'m here to make learning easier. What subject are you interested in?'
                ];
                return greetings[Math.floor(Math.random() * greetings.length)];
            }

            // How are you / casual conversation
            if (lowerMessage.match(/how are you|what's up|wassup|how's it going/)) {
                return 'I\'m doing great, thanks for asking! 😊 I\'m always excited to help students learn. What would you like to study today?';
            }

            // Thank you responses
            if (lowerMessage.match(/thank you|thanks|appreciate/)) {
                return 'You\'re very welcome! Happy to help. Feel free to ask me anything else! 📚';
            }

            // MATHEMATICS
            if (lowerMessage.match(/math|algebra|geometry|calculus|trigonometry|equation|formula/)) {
                if (lowerMessage.includes('pythagorean')) {
                    return '📐 **Pythagorean Theorem**: In a right triangle, a² + b² = c²\n\nWhere:\n• a and b are the legs\n• c is the hypotenuse (longest side)\n\n**Example**: If a=3 and b=4, then c = √(9+16) = √25 = 5\n\nNeed help with a specific problem?';
                }
                if (lowerMessage.includes('quadratic')) {
                    return '📊 **Quadratic Formula**: x = (-b ± √(b²-4ac)) / 2a\n\nUsed to solve equations like: ax² + bx + c = 0\n\n**Steps**:\n1. Identify a, b, and c\n2. Calculate discriminant (b²-4ac)\n3. Apply the formula\n\n**Example**: x² - 5x + 6 = 0\na=1, b=-5, c=6\nx = (5 ± √(25-24))/2 = (5±1)/2\nSolutions: x=3 or x=2\n\nWant to try a practice problem?';
                }
                return '🔢 **Mathematics Help**\n\nI can help you with:\n• Algebra (equations, factoring, polynomials)\n• Geometry (shapes, angles, theorems)\n• Calculus (derivatives, integrals, limits)\n• Statistics (mean, median, probability)\n• Trigonometry (sin, cos, tan)\n\nJust ask about a specific topic or share a problem you\'re working on!';
            }

            // PHYSICS
            if (lowerMessage.match(/physics|gravity|force|motion|energy|newton/)) {
                if (lowerMessage.includes('gravity')) {
                    return '🌍 **Gravity Explained**\n\nGravity is the force that attracts objects with mass toward each other.\n\n**Key Points**:\n• On Earth: g = 9.8 m/s² (acceleration)\n• Formula: F = mg (Force = mass × gravity)\n• Newton\'s Law: F = G(m₁m₂)/r²\n\n**Example**: A 10kg object on Earth\nF = 10 × 9.8 = 98 Newtons\n\nFun fact: The Moon has 1/6th Earth\'s gravity! 🌙';
                }
                if (lowerMessage.includes('newton')) {
                    return '⚡ **Newton\'s Laws of Motion**\n\n**1st Law (Inertia)**: Objects stay at rest or in motion unless acted upon by force\n\n**2nd Law (F=ma)**: Force = Mass × Acceleration\n\n**3rd Law**: For every action, there\'s an equal and opposite reaction\n\n**Real Example**: When you push a wall, it pushes back with equal force! That\'s why your hand doesn\'t go through it.\n\nWant more examples?';
                }
                return '⚛️ **Physics Topics**\n\nI can explain:\n• Mechanics (force, motion, energy)\n• Thermodynamics (heat, temperature)\n• Electricity & Magnetism\n• Waves & Optics\n• Modern Physics (quantum, relativity)\n\nWhich topic interests you?';
            }

            // CHEMISTRY
            if (lowerMessage.match(/chemistry|chemical|reaction|element|atom|molecule/)) {
                if (lowerMessage.includes('photosynthesis')) {
                    return '🌱 **Photosynthesis**\n\nThe process where plants make food from sunlight!\n\n**Equation**:\n6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\n**In Simple Terms**:\nCarbon dioxide + Water + Sunlight → Glucose + Oxygen\n\n**Where**: Happens in chloroplasts (green parts)\n**Why Important**: Produces oxygen we breathe!\n\n**Two Stages**:\n1. Light reactions (capture energy)\n2. Calvin cycle (make glucose)';
                }
                return '🧪 **Chemistry Help**\n\nI can explain:\n• Atomic structure & periodic table\n• Chemical bonds & reactions\n• Acids & bases (pH)\n• Organic chemistry\n• Stoichiometry & balancing equations\n\nWhat chemistry topic do you need help with?';
            }

            // BIOLOGY
            if (lowerMessage.match(/biology|cell|dna|evolution|organism|ecosystem/)) {
                if (lowerMessage.includes('cell')) {
                    return '🔬 **Cell Structure**\n\n**Plant vs Animal Cells:**\n\nBoth have:\n• Nucleus (control center)\n• Mitochondria (powerhouse)\n• Cell membrane (outer layer)\n• Cytoplasm (gel-like filling)\n\nOnly Plants have:\n• Cell wall (rigid structure)\n• Chloroplasts (photosynthesis)\n• Large vacuole (storage)\n\n**Remember**: Plants are like animals with armor and solar panels! 🌿';
                }
                if (lowerMessage.includes('dna')) {
                    return '🧬 **DNA (Deoxyribonucleic Acid)**\n\nYour genetic blueprint!\n\n**Structure**: Double helix (twisted ladder)\n**Base Pairs**: \n• A (Adenine) pairs with T (Thymine)\n• G (Guanine) pairs with C (Cytosine)\n\n**Function**: Stores instructions for making proteins\n\n**Cool Fact**: If you uncoiled all DNA in your body, it would stretch to the sun and back 300 times! ☀️';
                }
                return '🌿 **Biology Topics**\n\nI can teach you about:\n• Cell biology & genetics\n• Human anatomy & physiology\n• Evolution & natural selection\n• Ecosystems & ecology\n• Plant & animal systems\n\nWhat would you like to explore?';
            }

            // STUDY TIPS
            if (lowerMessage.match(/study tips|how to study|study better|improve grades|learning technique/)) {
                return '📚 **Effective Study Strategies**\n\n**1. Active Recall** 🧠\nTest yourself instead of re-reading. Use flashcards or practice questions.\n\n**2. Spaced Repetition** ⏰\nReview material at increasing intervals (1 day, 3 days, 1 week)\n\n**3. Pomodoro Technique** 🍅\nStudy for 25 min, break for 5 min. Repeat.\n\n**4. Feynman Technique** 👨‍🏫\nExplain concepts in simple terms as if teaching someone else\n\n**5. Mind Maps** 🗺️\nVisualize connections between concepts\n\n**6. Practice Problems** ✍️\nDo lots of exercises, especially for math/science\n\nWhich technique would you like to try first?';
            }

            // HOMEWORK HELP
            if (lowerMessage.match(/homework|assignment|project|essay/)) {
                return '📝 **Homework Helper**\n\nI can help you:\n\n1. **Understand concepts** you\'re stuck on\n2. **Break down complex problems** into steps\n3. **Check your thinking** (not give direct answers)\n4. **Suggest resources** for deeper learning\n5. **Explain methods** to solve similar problems\n\n💡 **Best approach**: Tell me what you\'re working on and where you\'re stuck. I\'ll guide you through it!\n\nWhat\'s your assignment about?';
            }

            // TEST PREPARATION
            if (lowerMessage.match(/test|exam|quiz|prepara|review/)) {
                return '📖 **Test Preparation Guide**\n\n**1 Week Before**:\n• Review all notes and materials\n• Create summary sheets\n• Identify weak areas\n\n**3 Days Before**:\n• Practice problems/questions\n• Use active recall techniques\n• Join study groups\n\n**Day Before**:\n• Light review only\n• Get 8 hours sleep 😴\n• Prepare materials (calculator, pencils)\n\n**Test Day**:\n• Eat a good breakfast\n• Read questions carefully\n• Answer easy questions first\n• Review answers if time permits\n\nWhat subject is your test on? I can give specific tips!';
            }

            // WRITING HELP
            if (lowerMessage.match(/essay|writing|paragraph|thesis|argument/)) {
                return '✍️ **Essay Writing Structure**\n\n**Introduction**:\n• Hook (grab attention)\n• Background info\n• Thesis statement (main argument)\n\n**Body Paragraphs** (3-5):\n• Topic sentence\n• Evidence/examples\n• Analysis/explanation\n• Transition to next point\n\n**Conclusion**:\n• Restate thesis (differently)\n• Summarize main points\n• Final thought/call to action\n\n**Tips**:\n✓ Each paragraph = one main idea\n✓ Use transition words (however, furthermore, therefore)\n✓ Support claims with evidence\n✓ Proofread for grammar\n\nWhat type of essay are you writing?';
            }

            // HISTORY
            if (lowerMessage.match(/history|historical|world war|ancient|medieval/)) {
                return '📜 **History Study Help**\n\nI can help you understand:\n• Ancient civilizations (Egypt, Rome, Greece)\n• Medieval period & Renaissance\n• Modern history (World Wars, Cold War)\n• Historical analysis & timelines\n• Important figures & events\n\n**Study Tip**: Create timelines to visualize when events happened and how they connect!\n\nWhat historical period are you studying?';
            }

            // ENGLISH/LITERATURE
            if (lowerMessage.match(/literature|shakespeare|novel|poem|poetry|reading/)) {
                return '📖 **Literature Analysis**\n\nKey elements to analyze:\n\n**Plot**: Story sequence (exposition, rising action, climax, falling action, resolution)\n\n**Characters**: Protagonists, antagonists, development\n\n**Theme**: Central message or lesson\n\n**Setting**: Time and place\n\n**Literary Devices**:\n• Metaphor, simile, personification\n• Symbolism, foreshadowing\n• Imagery, tone, mood\n\n**Tip**: Ask "What is the author trying to say?" and "How do they say it?"\n\nWhat book/poem are you analyzing?';
            }

            // COMPUTER SCIENCE / CODING
            if (lowerMessage.match(/coding|programming|python|javascript|computer science|algorithm/)) {
                return '💻 **Programming Concepts**\n\nI can explain:\n• Variables & data types\n• Control structures (if/else, loops)\n• Functions & methods\n• Arrays & objects\n• Object-oriented programming\n• Algorithms & problem-solving\n\n**Learning Tip**: The best way to learn coding is by DOING! Practice with small projects.\n\n**Popular languages**:\n• Python (beginner-friendly)\n• JavaScript (web development)\n• Java (versatile)\n• C++ (performance)\n\nWhat language or concept are you learning?';
            }

            // MOTIVATION & CONFIDENCE
            if (lowerMessage.match(/difficult|hard|don't understand|confused|frustrat|give up|can't do/)) {
                return '💪 **You Can Do This!**\n\nLearning is a journey, and struggles are normal!\n\n**Remember**:\n✓ Every expert was once a beginner\n✓ Mistakes help you learn\n✓ Break big problems into small steps\n✓ Take breaks when frustrated\n✓ Ask for help (you\'re doing it now!)\n\n"The only way to learn mathematics is to do mathematics" - Paul Halmos\n\nThis applies to all subjects! Let\'s work through what\'s confusing you. What specific part is tricky?';
            }

            // EXPLAIN / WHAT IS
            if (lowerMessage.match(/what is|what are|explain|define|meaning of/)) {
                return 'I\'d love to explain that! 🎯\n\nCould you be more specific about what concept or topic you\'d like me to explain? \n\nFor example:\n• "What is photosynthesis?"\n• "Explain quadratic equations"\n• "Define oxidation in chemistry"\n• "What are Newton\'s laws?"\n\nThe more specific you are, the better I can help!';
            }

            // GENERAL HELP
            if (lowerMessage.match(/help|assist|support|guide/)) {
                return '🎓 **I\'m Your Learning Assistant!**\n\nI can help with:\n\n📐 **Math** - Algebra, Geometry, Calculus\n⚛️ **Science** - Physics, Chemistry, Biology\n📚 **Study Skills** - Tips, techniques, strategies\n✍️ **Writing** - Essays, structure, grammar\n💻 **Programming** - Coding concepts\n📖 **Other Subjects** - History, Literature, and more!\n\nJust ask a specific question or tell me what you\'re studying. Try:\n• "Explain gravity"\n• "Help with quadratic equations"\n• "How do I study for tests?"\n• "What is photosynthesis?"';
            }

            // Default - friendly and encouraging
            const defaultResponses = [
                'That\'s a great question! 🤔 I want to give you the best answer. Could you tell me a bit more about what you\'re studying or what specifically you need help with?',
                'I\'m here to help! To give you the most useful explanation, could you provide more details? For example, is this for math, science, history, or another subject?',
                'Interesting! I\'d love to help you with that. Could you rephrase your question or give me more context? For example: "Explain [topic]" or "Help with [subject]".'
            ];

            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        handleVoiceInput() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                this.addMessage('Voice input is not supported in your browser. Please try typing your message instead.', 'bot');
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                this.voiceBtn.classList.add('recording');
            };

            recognition.onend = () => {
                this.voiceBtn.classList.remove('recording');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.input.value = transcript;
                this.handleSend();
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.voiceBtn.classList.remove('recording');
            };

            recognition.start();
        }

        scrollToBottom() {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Public API methods
        open() {
            if (!this.isOpen) this.toggleChat();
        }

        close() {
            if (this.isOpen) this.toggleChat();
        }

        sendMessage(text) {
            this.input.value = text;
            this.handleSend();
        }

        destroy() {
            this.container.remove();
        }
    }

    // Make it globally accessible
    window.AuraLearnChatbot = AuraLearnChatbot;

    // Auto-initialize if data attribute is present
    if (document.currentScript && document.currentScript.dataset.autoInit !== 'false') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.auraLearnBot = new AuraLearnChatbot();
            });
        } else {
            window.auraLearnBot = new AuraLearnChatbot();
        }
    }
})();
