import { useEffect } from "react";

export default function HoverToSpeech() {
  useEffect(() => {
    const synth = window.speechSynthesis;

    // Function to attach listeners
    const attachListeners = () => {
      const elements = document.querySelectorAll(
        "div, section, p, li, ul, a, b, i, span, h1, h2, h3, h4, h5, h6"
      );

      elements.forEach((el) => {
        // avoid double binding
        if (el.dataset.ttsBound) return;
        el.dataset.ttsBound = "true";

        el.addEventListener("mouseenter", () => {
          synth.cancel();
          const text = el.innerText.trim();
          if (text.length > 0) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "hi-IN"; // Hindi voice
            utterance.rate = 1;
            synth.speak(utterance);
          }
        });

        el.addEventListener("mouseleave", () => {
          synth.cancel();
        });
      });
    };

    // Run once on mount
    attachListeners();

    // MutationObserver to track new nodes
    const observer = new MutationObserver(() => {
      attachListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
