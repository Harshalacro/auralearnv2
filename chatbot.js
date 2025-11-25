// ========================
// GEMINI CHATBOT SCRIPT
// ========================

// Put your AI Studio key here
const GEMINI_API_KEY = "AIzaSyBLWqKGliLhQv423jp2tKW7-GEeO2qSGhI";  

// Toggle chat window
function toggleChat() {
    const panel = document.getElementById("chat-popup");
    panel.style.display = (panel.style.display === "flex") ? "none" : "flex";
}

// Send message to Gemini
async function sendMessage() {
    const chatBox = document.getElementById("chat-box");
    const inputField = document.getElementById("chat-input");
    const input = inputField.value.trim();

    if (!input) return;

    chatBox.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: input }]
                        }
                    ]
                })
            }
        );

        const data = await res.json();
        console.log("Gemini Debug:", data);

        const botMsg =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I’m having trouble responding.";

        chatBox.innerHTML += `<p><strong>Aura:</strong> ${botMsg}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        console.error(err);
        chatBox.innerHTML += `<p><strong>Error:</strong> ${err.message}</p>`;
    }
}
