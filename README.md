# 🎓 AuraLearn - Experience-Based Learning Platform

An **AI and AR-powered** interactive learning platform that helps students explore science and geography through augmented reality visualization and intelligent chatbot assistance.

---

## ✨ Key Features

### 🔬 **AR Visualization**
- View 3D models of science concepts and geographical features in augmented reality
- Interactive AR models for:
  - **Science**: Human Heart, DNA Molecule, Solar System, Atom Structure
  - **Geography**: Earth features, Volcanoes, Terrains, Landforms
- Mobile AR support with QR code fallback for desktop

### 🤖 **AI Learning Assistant**
- **Advanced chatbot** with comprehensive educational knowledge
- Detailed explanations for:
  - Mathematics (algebra, geometry, calculus, formulas)
  - Science (physics, chemistry, biology)
  - Study tips and learning strategies
  - Test preparation guidance
  - Writing and essay help
  - Programming concepts
- **Voice input** support for natural interaction
- Beautiful, modern UI with typing indicators and smooth animations
- Can be integrated with your own AI backend/API

### 🎨 **Premium UI/UX Design**
- Modern gradient backgrounds with animated particles
- Smooth transitions and micro-animations
- Fully responsive design for all devices
- Glass morphism effects and backdrop blur
- Feature cards with hover effects
- Professional navigation system

---

## 📂 Project Structure

```
Aura_Learn/
├── index.html                 # Landing page with hero section and features
├── subjects.html              # Subject selection page
├── science.html               # Science AR models page
├── geography.html             # Geography AR models page
├── chatbot-widget.js          # Advanced AI chatbot widget
├── chatbot.js                 # Old chatbot (can be removed)
├── galaxy themed.html         # Alternative theme
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Quick Start
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Prakhar3801b/Aura_Learn.git
   cd Aura_Learn
   ```

2. **Open in browser**:
   - Simply open `index.html` in any modern web browser
   - No build process required!

3. **Try the chatbot**:
   - Click the purple floating button in the bottom-right corner
   - Ask questions about science, math, or study tips
   - Try voice input by clicking the microphone icon

### AR Models
- **On Mobile**: Tap any AR model card to view it in augmented reality
- **On Desktop**: Scan the QR code with your mobile device

---

## 🎯 Features Breakdown

### Landing Page (`index.html`)
- Stunning hero section with animated background
- Feature badges highlighting key capabilities
- Call-to-action buttons
- "Why AuraLearn?" features showcase
- Integrated AI chatbot

### Subjects Page (`subjects.html`)
- Beautiful card-based layout
- Science and Geography subjects (active)
- Mathematics (coming soon)
- Topic tags and descriptions
- Smooth animations

### Science AR Models (`science.html`)
- Grid layout with 4 AR models:
  1. Human Heart ❤️
  2. DNA Molecule 🧬
  3. Solar System 🌍
  4. Atom Structure ⚛️
- AR badges indicating model readiness
- Detailed descriptions
- QR code modal for desktop users

### AI Chatbot (`chatbot-widget.js`)
The chatbot provides:
- **Instant answers** to educational questions
- **Comprehensive explanations** with examples and formulas
- **Study guidance** and tips
- **Subject-specific help** (Math, Science, Writing, etc.)
- **Motivational support** for struggling students
- **Voice interaction** capability

---

## 🔧 Customization

### Chatbot Configuration
You can customize the chatbot in any HTML file:

```javascript
const auraBot = new AuraLearnchatbot({
  botName: 'Your Bot Name',
  primaryColor: '#667eea',      // Change to your brand color
  accentColor: '#764ba2',       // Gradient accent color
  position: 'bottom-right',     // Or 'bottom-left', 'top-right', 'top-left'
  welcomeMessage: 'Custom welcome message...',
  placeholderText: 'Custom placeholder...',
  enableVoice: true,            // Enable/disable voice input
  apiEndpoint: 'YOUR_API_URL'   // Connect your own AI backend
});
```

### Adding Your Own API
To connect the chatbot to your own AI backend (e.g., OpenAI, Gemini, etc.):

1. Set the `apiEndpoint` in the chatbot configuration
2. Your API should accept POST requests with: `{ "message": "user question" }`
3. And respond with: `{ "response": "bot answer" }`

Example:
```javascript
const auraBot = new AuraLearnChatbot({
  apiEndpoint: 'https://your-api.com/chat',
  // ... other options
});
```

---

## 🎨 Design System

### Colors
- **Primary Gradient**: `#667eea` → `#764ba2`
- **Accent**: `#fbbf24` (gold)
- **Background**: Gradient with transparency and blur effects
- **Text**: White with varying opacity for hierarchy

### Typography
- **Font Family**: Inter (Google Fonts)
- **Heading Weight**: 700-900
- **Body Weight**: 400-600

### Effects
- Glass morphism with `backdrop-filter: blur()`
- Smooth cubic-bezier animations
- Hover transforms and shadows
- Particle background animations

---

## 📱 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Main UI | ✅ | ✅ | ✅ | ✅ |
| AR Models | ✅ | ⚠️ | ✅ | ✅ |
| Voice Input | ✅ | ❌ | ✅ | ✅ |
| Chatbot | ✅ | ✅ | ✅ | ✅ |

**Note**: AR features require a device with AR capabilities (ARCore for Android, ARKit for iOS)

---

## 🚧 Future Enhancements

### Planned Features
- [ ] Mathematics subject with AR models
- [ ] History and Literature subjects
- [ ] User accounts and progress tracking
- [ ] Interactive quizzes and assessments
- [  ] More AR models for each subject
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Advanced AI tutoring with personalized learning paths

### AR Models in Development
- Chemistry: Molecular structures, reactions
- Biology: Cells, organs, ecosystems
- Geography: 3D terrain maps, climate zones
- Mathematics: 3D graphs, geometric shapes

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🌟 Credits

- **Design**: Modern UI/UX with glassmorphism and animations
- **AR Technology**: Google's model-viewer for AR visualization
- **AI Chatbot**: Custom-built educational assistant
- **Fonts**: Inter by Google Fonts

---

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Contact the development team

---

## 🎓 About AuraLearn

AuraLearn revolutionizes education by combining cutting-edge technologies:
- **Augmented Reality** for immersive visualization
- **Artificial Intelligence** for personalized assistance
- **Modern Web Design** for engaging user experience

Our mission: Make learning interactive, accessible, and fun for everyone! 

---

**Made with ❤️ for students and educators worldwide**

*Last updated: November 2025*