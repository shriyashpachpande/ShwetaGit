// // src/components/ChatBox.jsx
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import gsap from "gsap";
// import { FaUserCircle } from "react-icons/fa";
// import { FaWandMagicSparkles } from "react-icons/fa6";

// const API = "http://localhost:5000/api";

// export default function ChatBox() {
//   const [chatId, setChatId] = useState(null);
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content:
//         "Namaste! Main aapka medical chatbot hoon. Health ya insurance se jude sawal pooch sakte hain.\n\n⚠️ Ye sirf jaankari ke liye hai; kripya doctor se salah lein.",
//     },
//   ]);
//   const [text, setText] = useState("");
//   const [isTyping, setIsTyping] = useState(false);

//   const titleRef = useRef(null);
//   const chatWindowRef = useRef(null);
//   const inputSectionRef = useRef(null);

//   // Animate on page load
//   useEffect(() => {
//     const titleWords = titleRef.current.querySelectorAll("span");
//     gsap.from(titleWords, {
//       y: 30,
//       opacity: 0,
//       stagger: 0.2,
//       duration: 0.8,
//       ease: "power3.out",
//     });

//     gsap.from(chatWindowRef.current, {
//       y: 50,
//       opacity: 0,
//       duration: 1,
//       ease: "power3.out",
//     });

//     gsap.from(inputSectionRef.current, {
//       y: 50,
//       opacity: 0,
//       duration: 1,
//       ease: "power3.out",
//       delay: 0.5,
//     });
//   }, []);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     if (chatWindowRef.current) {
//       chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
//     }
//   }, [messages, isTyping]);

//   const send = async () => {
//     const trimmed = text.trim();
//     if (!trimmed) return;

//     const userMsg = { role: "user", content: trimmed };
//     setMessages((m) => [...m, userMsg]);
//     setText("");
//     setIsTyping(true);

//     try {
//       const { data } = await axios.post(`${API}/chat/send`, {
//         chatId,
//         text: trimmed,
//       });

//       setTimeout(() => {
//         if (data?.ok) {
//           setChatId(data.chatId);
//           setMessages((m) => [
//             ...m,
//             { role: "assistant", content: data.reply },
//           ]);
//         } else {
//           setMessages((m) => [
//             ...m,
//             { role: "assistant", content: "⚠️ Service issue. Please try later." },
//           ]);
//         }
//         setIsTyping(false);
//       }, 2000); // Bot typing delay
//     } catch (e) {
//       setMessages((m) => [
//         ...m,
//         { role: "assistant", content: "⚠️ Service unavailable." },
//       ]);
//       setIsTyping(false);
//     }
//   };

//   const onKey = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       send();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-[#f5f5f5] p-4">
//       {/* Title */}
//       <h2
//         ref={titleRef}
//         className="text-3xl font-bold text-center mb-4 text-blue-900"
//       >
//         {"Medical Chatbot".split(" ").map((word, i) => (
//           <span key={i} className="inline-block mr-2">
//             {word}
//           </span>
//         ))}
//       </h2>

//       {/* Chat Window */}
//       <div
//         ref={chatWindowRef}
//         className="w-full max-w-3xl border border-gray-300 rounded-lg p-3 bg-[#f5f5f5] overflow-y-auto shadow-md
//           h-[19rem] sm:h-[24rem] lg:h-[27rem]"
//         style={{
//           boxShadow:
//             "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//         }}
//       >
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`flex items-end gap-2 mb-3 ${
//               m.role === "user" ? "justify-end" : "justify-start"
//             }`}

//           >
//             {m.role === "assistant" && (
//               <FaWandMagicSparkles className="text-gray-500 text-2xl " />
//             )}
//             <div
//               className={`max-w-[75%] p-3 rounded-lg  text-justify${
//                 m.role === "user"
//                   ? "bg-[#f5f5f5] text-right"
//                   : "bg-[#f5f5f5] text-left"
//               }`}
//               style={{
//                 boxShadow:
//                   "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
//               }}
//             >
//               {m.content}
//             </div>
//             {m.role === "user" && (
//               <FaUserCircle className="text-gray-500 text-2xl" />
//             )}
//           </div>
//         ))}

//         {/* Typing dots */}
//         {isTyping && (
//           <div className="flex gap-2 items-center p-2">
//             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
//             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
//           </div>
//         )}
//       </div>

//       {/* Input Section */}
//       <div
//         ref={inputSectionRef}
//         className="flex flex-row gap-2 mt-4 w-full max-w-3xl sticky bottom-0 bg-gray-50 p-2"
//       >
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={onKey}
//           placeholder="Type your medical question..."
//           className="flex-1 min-w-0 rounded-xl px-3 py-2 border border-gray-300 focus:outline-none sm:px-4 sm:py-2"
//           style={{
//             boxShadow:
//               "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
//           }}
//         />
//         <button
//           onClick={send}
//           className="flex-shrink-0 px-4 py-2 rounded-full text-black font-bold cursor-pointer bg-white sm:px-6"
//           style={{
//             boxShadow:
//               "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }


































// src/components/ChatBox.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import { FaUserCircle } from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
const API = "http://localhost:5000/api";

export default function ChatBox() {
  const [chatId, setChatId] = useState(null);
  const recognitionRef = useRef(null);
  const [text, setText] = useState(""); // ✅ single input state
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste! I am your medical chatbot. You can ask questions related to health or insurance. ⚠️ This is for informational purposes only; please consult a doctor.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const titleRef = useRef(null);
  const chatWindowRef = useRef(null);
  const inputSectionRef = useRef(null);

  // Animate on page load
  useEffect(() => {
    const titleWords = titleRef.current.querySelectorAll("span");
    gsap.from(titleWords, {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(chatWindowRef.current, {
      y: 50,
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
   const { t } = useTranslation();
  // Auto-scroll to bottom
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Setup speech recognition
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
        setText((prev) => (prev + " " + transcript).trim()); // ✅ add transcript to text
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

  // Send message
  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setIsTyping(true);

    try {
      const { data } = await axios.post(`${API}/chat/send`, {
        chatId,
        text: trimmed,
      });

      setTimeout(() => {
        if (data?.ok) {
          setChatId(data.chatId);
          setMessages((m) => [
            ...m,
            { role: "assistant", content: data.reply },
          ]);
        } else {
          setMessages((m) => [
            ...m,
            { role: "assistant", content: "⚠️ Service issue. Please try later." },
          ]);
        }
        setIsTyping(false);
      }, 2000); // bot typing delay
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Service unavailable." },
      ]);
      setIsTyping(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#f5f5f5] p-4">
      {/* Title */}
      <h2
        ref={titleRef}
        className="text-3xl font-bold text-center mb-4 text-blue-900"
      >
        {t('Medical Chatbot').split(" ").map((word, i) => (
      <span key={i} className="inline-block mr-2">{word}</span>
    ))}
      </h2>

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className="w-full max-w-3xl border border-gray-300 rounded-lg p-3 bg-[#f5f5f5] overflow-y-auto shadow-md
          h-[19rem] sm:h-[24rem] lg:h-[27rem]"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 mb-3 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <FaWandMagicSparkles className="text-gray-500 text-2xl " />
            )}
            <div
              className={`max-w-[75%] p-3 rounded-lg text-justify ${
                m.role === "user"
                  ? "bg-[#f5f5f5] text-right"
                  : "bg-[#f5f5f5] text-left"
              }`}
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0.23) 0px 6px 6px",
              }}
            >
              {t(m.content)}
            </div>
            {m.role === "user" && (
              <FaUserCircle className="text-gray-500 text-2xl" />
            )}
          </div>
        ))}

        {/* Typing dots */}
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
        className="flex flex-row gap-2 mt-4 w-full max-w-3xl sticky bottom-0 bg-gray-50 p-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          placeholder={t('Type your medical question...')}
          className="flex-1 min-w-0 rounded-xl px-3 py-2 border border-gray-300 focus:outline-none sm:px-4 sm:py-2"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0.23) 0px 6px 6px",
          }}
        />

        <button
          onClick={startListening}
          className={`px-4 py-2 rounded-full cursor-pointer ${
            isListening ? "bg-red-400" : "bg-[#f5f5f5]"
          } text-black font-bold`}
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0.23) 0px 3px 6px",
          }}
        >
          <FaMicrophone />
        </button>

        <button
          onClick={send}
          className="flex-shrink-0 px-4 py-2 rounded-full text-black font-bold cursor-pointer bg-white sm:px-6"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0.23) 0px 3px 6px",
          }}
        >
          {t('Send')}
        </button>
      </div>
    </div>
  );
}
