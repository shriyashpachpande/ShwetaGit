// src/components/ChatBot.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { FaUserCircle } from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa";

import { useTranslation } from 'react-i18next';
export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [policyUploaded, setPolicyUploaded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const titleRef = useRef(null);
  const uploadSectionRef = useRef(null);
  const chatWindowRef = useRef(null);
  const inputSectionRef = useRef(null);

  // GSAP Page Animation
  useEffect(() => {
    const titleWords = titleRef.current.querySelectorAll("span");
    gsap.from(titleWords, {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(uploadSectionRef.current, {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(inputSectionRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.5,
    });
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US"; // change to "hi-IN" for Hindi
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + " " + transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      alert("Your browser does not support voice recognition...");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("https://shwetagit.onrender.com/api/chatbot", {
        query: input,
      });

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.answer },
        ]);
        setIsTyping(false);
      }, 2000);
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error contacting server." },
      ]);
    }
  };

  const uploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const endpoint = type === "policy" ? "/upload-policy" : "/upload-report";

    const res = await axios.post(
      `https://shwetagit.onrender.com/api${endpoint}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert(res.data.message);
    if (type === "policy") setPolicyUploaded(true);
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#f5f5f5]  p-4">
      {/* Title */}
      <h2
        ref={titleRef}
        className="text-3xl font-bold text-center mb-0 text-blue-900"
      >
        {t('Insurance AI Assistant').split(" ").map((word, i) => (
          <span key={i} className="inline-block mr-2">
            {word}
          </span>
        ))}
      </h2>

      {/* Upload Section */}
      <div
        ref={uploadSectionRef}
        className="flex flex-col sm:flex-row gap-4 justify-center mt-4 mb-4 w-full max-w-2xl"
      >
        <div className="flex-1">
          <label className="block mb-1 font-medium">{t('Upload Policy:')}</label>
          <input
            type="file"
            className=" p-2 rounded-md w-full mt-3 cursor-pointer"
            onChange={(e) => uploadFile(e, "policy")}
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">{t('Upload Report:')}</label>
          <input
            type="file"
            className=" p-2 rounded-md w-full mt-3 cursor-pointer"
            onChange={(e) => uploadFile(e, "report")}
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className="w-full max-w-4xl border border-gray-300 rounded-lg p-4 bg-[#f5f5f5] overflow-y-auto shadow-md
          h-[22rem] sm:h-[26rem] lg:h-[26rem]"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {msg.sender === "bot" && (
              <FaWandMagicSparkles className="text-gray-500 text-2xl mr-2" />
            )}
            <div
              className={`px-4 py-2 rounded-xl shadow-md max-w-[70%] text-justify ${msg.sender === "user"
                ? "bg-[#f5f5f5] text-gray-900"
                : "bg-[#f5f5f5] text-gray-900"
                }`}
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
              }}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <FaUserCircle className="text-gray-500 text-2xl ml-2" />
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2 items-center p-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div
        ref={inputSectionRef}
        className="flex items-center gap-2 mt-4 w-full max-w-4xl sticky bottom-0 bg-gray-50 p-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('Ask about your insurance...')}
          className="flex-1 min-w-0 rounded-xl px-3 py-2 border text-justify border-gray-300 focus:outline-none sm:px-4 sm:py-2"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          }}
        />

        <button
          onClick={startListening}
          className={`px-4 py-2 rounded-full cursor-pointer ${isListening ? "bg-red-400" : "bg-[#f5f5f5]"
            } text-black font-bold`}
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          }}
        >
          <FaMicrophone />
        </button>


        <button
          onClick={sendMessage}
          disabled={!policyUploaded}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-black font-bold 
                     disabled:bg-[#f5f5f5] disabled:cursor-not-allowed cursor-pointer sm:px-6"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          }}
        >
          {t('Generate')}
        </button>
      </div>
    </div>
  );
}
