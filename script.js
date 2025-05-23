const output = document.getElementById("output");

// Replace this with your actual OpenAI API key
const OPENAI_API_KEY = "sk-https://platform.openai.com/account/api-keys";

async function getChatGPTResponse(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  speak(reply);
  output.innerText = reply;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = speechSynthesis.getVoices()[0];
  speechSynthesis.speak(utterance);
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    output.innerText = "You said: " + transcript;
    getChatGPTResponse(transcript);
  };

  recognition.onerror = function (event) {
    output.innerText = "Error: " + event.error;
  };
}