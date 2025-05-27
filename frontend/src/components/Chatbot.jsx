import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import Groq from "groq-sdk";

const Chatbot = () => {
  const [isActive, setIsActive] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  const getGroqChatCompletion = async (userMessage) => {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are NaviBot, a helpful and friendly healthcare Ai assistant. Navigating users with proper informations and health information. And you respond professionally, appropriately and in short sentences",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        model: "llama3-8b-8192",
      });
  
      return response.choices[0]?.message?.content || "I'm sorry, I couldn't understand that.";
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      return "There was an error processing your request. Please try again.";
    }
  };
  

  const handleChat = async () => {
    if (inputMessage.trim() !== "") {
      const newUserMessage = { type: "user", content: inputMessage };
      setChatMessages((prev) => [...prev, newUserMessage]);

      // Get response from API
      const botReply = await getGroqChatCompletion(inputMessage);
      const newBotMessage = { type: "bot", content: botReply };

      // Update chat messages with bot response
      setChatMessages((prev) => [...prev, newBotMessage]);

      // Clear the input field
      setInputMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const toggleChatbot = () => {
    setIsActive((prevActive) => {
      if (!prevActive && chatMessages.length === 0) {
        // Add welcome message when chatbot is first activated
        setChatMessages([
          {
            type: "bot",
            content: "Hello! I'm NaviBot, your friendly healthcare AI assistant. How can I help you today?",
          },
        ]);
      }
      return !prevActive;
    });
  };

  return (
    <div
      className={`fixed z-20 bottom-0 right-0 pb-5 px-4 w-full ${
        isActive ? "flex justify-center items-center h-fit w-fit" : ""
      }`}
    >
      <div
        onClick={toggleChatbot}
        className="absolute z-10 bottom-3 right-3 w-[70px] h-[70px] rounded-full border border-white cursor-pointer hover:scale-105 transition-all duration-100 sm:bottom-5 sm:right-5 sm:scale-110"
      >
        <img className="scale-100" src={assets.chatBot} alt="Chatbot Icon" />
      </div>
      {isActive && (
        <div className="lg:absolute bg-yellow-200 rounded-xl shadow-xl overflow-hidden z-10 sm:w-[90%] md:w-[80%] lg:w-[480px] sm:right-24 sm:bottom-24 mb-16 sm:mb-0">
          <header className="bg-primary py-3 text-center">
            <h2 className="text-2xl text-white">Navi <span className="font-semibold">Bot</span></h2>
          </header>
          <ul className="h-[400px] overflow-y-auto px-3 py-4">
            {chatMessages.map((message, index) => (
              <li
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end my-3" : ""
                }`}
              >
                {message.type === "bot" && (
                  <span className=" text-white py-1 px-1 rounded-full w-9 h-9 mr-2">
                    <img className="scale-100" src={assets.chatBot} alt="Bot" />
                  </span>
                )}
                <p
                  className={`max-w-[75%] px-2 py-1 rounded ${
                    message.type === "user" ? "bg-primary" : "bg-yellow-100"
                  }`}
                >
                  {message.content}
                </p>
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
          <div className="flex bottom-0 w-full bg-white px-4 py-3 gap-2">
            <textarea
              className="w-full h-[55px] border-none outline-none resize-none text-[1.1rem] px-2 py-3"
              placeholder="Enter a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChat();
                }
              }}
            ></textarea>
            <span
              onClick={handleChat}
              className="justify-center items-center flex rounded-lg text-white font-semibold bg-primary/80 px-2 cursor-pointer hover:bg-primary"
            >
              Send
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;