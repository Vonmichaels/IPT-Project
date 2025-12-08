import { useState, useRef, useEffect } from "react";
import { FiPlus, FiClock, FiFileText, FiKey, FiUser, FiSend, FiCpu } from "react-icons/fi";
import { BiSolidBot } from "react-icons/bi";

export default function App() {
  const [messages, setMessages] = useState([
    { text: "I'm Haven, designed specifically to be your space for personal growth and self-care. I'm here to help with things like managing stress, building better habits, or finding mindful moments. What’s on your mind in that area?", sender: "bot" }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const fakeTypeText = async (fullText) => {
    let current = "";
    for (let i = 0; i < fullText.length; i++) {
      current += fullText[i];
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = current;
        return updated;
      });
      await new Promise(res => setTimeout(res, 40));
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    setMessages([...messages, { text: input, sender: "user" }]);
    const userMessage = input;
    setInput("");

    setMessages(prev => [...prev, { text: "", sender: "bot" }]);
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const botReply = data.response || "Bot error: No response";
      await fakeTypeText(botReply);

    } catch (error) {
      console.error("Error contacting backend:", error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = "Error: Could not reach bot.";
        return updated;
      });
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 font-sans">

      <div className="w-64 bg-black flex flex-col justify-between py-6 text-white">
        <div className="flex flex-col items-center">
          <BiSolidBot className="w-24 h-24 mb-4 text-white" />
          <h1 className="text-2xl font-bold mb-6">Haven AI</h1>

          <nav className="flex flex-col space-y-4 w-full px-4">
            <button className="flex items-center text-left px-4 py-2 hover:bg-gray-700 rounded">
              <FiPlus className="mr-3" /> New
            </button>
            <button className="flex items-center text-left px-4 py-2 hover:bg-gray-700 rounded">
              <FiClock className="mr-3" /> History
            </button>
            <button className="flex items-center text-left px-4 py-2 hover:bg-gray-700 rounded">
              <FiFileText className="mr-3" /> Docs
            </button>
            <button className="flex items-center text-left px-4 py-2 hover:bg-gray-700 rounded">
              <FiKey className="mr-3" /> API Keys
            </button>
          </nav>
        </div>

        <div className="px-4 py-6">
          <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center">
            <FiUser className="mr-2" />
            Account Me
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between p-6">
        <div className="w-full flex items-center justify-between px-4 py-3 mb-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <BiSolidBot className="w-8 h-8 text-black" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Haven AI</h2>
              <p className="text-xs text-gray-500">Your space for personal growth</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiCpu className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiClock className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiKey className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <FiUser className="w-7 h-7 text-black" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 bg-white p-6 rounded-xl shadow-lg">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <BiSolidBot className="w-8 h-8 mr-3 text-gray-700" />
              )}
              <div className={`px-4 py-2 rounded-2xl max-w-xs shadow-md ${
                  msg.sender === "user"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "user" && (
                <FiUser className="w-8 h-8 ml-3 text-black" />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2">
              <div className="text-gray-700 animate-pulse">typing...</div>
            </div>
          )}
        </div>

        <div className="mt-4 flex w-full">
          <input
            type="text"
            placeholder="Message Haven AI"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-6 py-4 rounded-l-full border border-gray-300 focus:outline-none shadow-md"
          />
          <button
            onClick={handleSend}
            className="px-6 py-4 bg-black text-white rounded-r-full hover:bg-gray-800 shadow-md flex items-center justify-center"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}
