import { useEffect } from "react";

export default function HoverToSpeech() {
  useEffect(() => {
    const synth = window.speechSynthesis;

    // Attach hover listeners
    const attachListeners = () => {
      const elements = document.querySelectorAll(
        "div, section, p, li, ul, a, b, i, span, h1, h2, h3, h4, h5, h6"
      );

      elements.forEach((el) => {
        if (el.dataset.ttsBound) return; // avoid duplicate binding
        el.dataset.ttsBound = "true";

        el.addEventListener("mouseenter", () => {
          synth.cancel();
          const text = el.innerText.trim();
          if (text.length > 0) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "hi-IN"; // Hindi
            utterance.rate = 1;
            synth.speak(utterance);
          }
        });

        el.addEventListener("mouseleave", () => {
          synth.cancel();
        });
      });
    };

    attachListeners();

    // MutationObserver for new DOM changes
    const observer = new MutationObserver(() => {
      attachListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null; // ye component UI render nahi karega
}
