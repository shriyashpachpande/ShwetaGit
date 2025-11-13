import { useEffect } from "react";

export default function useHoverSpeech() {
  useEffect(() => {
    const speakOnHover = (e) => {
      const text = e.target.innerText || e.target.textContent;
      if (text.trim().length > 0) {
        const msg = new SpeechSynthesisUtterance(text);
        speechSynthesis.cancel();
        speechSynthesis.speak(msg);
      }
    };

    const stopSpeaking = () => {
      speechSynthesis.cancel();
    };

    // Select all possible text elements
    const elements = document.querySelectorAll("p, div, li, ul, a, b, i, span, h1, h2, h3, h4, h5, h6");

    elements.forEach((el) => {
      el.addEventListener("mouseenter", speakOnHover);
      el.addEventListener("mouseleave", stopSpeaking);
    });

    // Cleanup
    return () => {
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", speakOnHover);
        el.removeEventListener("mouseleave", stopSpeaking);
      });
    };
  }, []);
}
