import React, { useState, useEffect, useRef } from "react";
import { Send, Minimize2, Maximize2, X, Volume2 } from "lucide-react";

const App = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi, I'm Krishna \nAsk me anything about the Bhagavad Gita or my teachings.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🗣️ Function to speak text on button click
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.pitch = 1;
    utterance.rate = 1;
    const voice = speechSynthesis
      .getVoices()
      .find((v) => v.name.toLowerCase().includes("male"));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  // Send user message and get Krishna's response
  const sendMessage = async () => {
    const question = input.trim();
    if (!question) return;

    const newMessages = [...messages, { sender: "user", text: question }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      const answer =
        data.answer || "Sorry, I couldn’t find an answer at the moment.";

      // Add Krishna's reply
      setMessages((prev) => [...prev, { sender: "bot", text: answer }]);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = "Server error. Please try again later.";
      setMessages((prev) => [...prev, { sender: "bot", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // When chat is closed
  if (!isOpen) {
    return (
      <>
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
        >
          <source src="/krishna-bg.mp4" type="video/mp4" />
        </video>

        <div className="fixed inset-0 bg-black/40 -z-10"></div>

        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center text-white text-2xl hover:scale-110 z-50"
        >
          <img src="peack.png" className="h-15 w-19" alt="" />
        </button>
      </>
    );
  }

  return (
    <>
      {/* 🎥 Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <div className="fixed inset-0 bg-black/40 -z-10"></div>

      {/* 💬 Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? "scale-90 opacity-90" : ""
        }`}
      >
        <div
          className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isMinimized ? "w-80 h-14" : "w-96 h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                <img src="peack.png" className="h-15 w-19" alt="" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Krishna</h3>
                <p className="text-white/80 text-xs">Divine Guide</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-[440px] overflow-y-auto bg-gradient-to-b from-orange-50/40 to-amber-50/30 p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                       <img src="peack.png" className="h-10 w-12" alt="" />
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm relative ${
                        msg.sender === "user"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm"
                          : "bg-white/90 text-gray-800 rounded-bl-sm border border-orange-100 backdrop-blur-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>

                      {/* 🔊 Speak button only for bot messages */}
                      {msg.sender === "bot" && (
                        <button
                          onClick={() => speakText(msg.text)}
                          title="Read aloud"
                          className="absolute bottom-1 right-2 text-orange-400 hover:text-orange-600 transition-colors"
                        >
                          <Volume2 size={16} />
                        </button>
                      )}
                    </div>

                    {msg.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm ml-2 flex-shrink-0">
                        👤
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm mr-2">
                      <img src="peack.png" className="h-15 w-19" alt="" />
                    </div>
                    <div className="bg-white/90 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-orange-100">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Field */}
              <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm placeholder-gray-400 transition-all"
                    placeholder="Ask about the Gita..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-3 rounded-full hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
