import { useRef, useState } from "react";

// Wraps the browser's SpeechRecognition API (where available) so low-literacy
// farmers can speak a short note instead of typing. Falls back to a disabled,
// explained state on unsupported browsers rather than failing silently.
export default function VoiceInputButton({ lang = "en", onResult }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const supported = Boolean(SpeechRecognition);

  const start = () => {
    if (!supported) return;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult?.(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <button
      type="button"
      className={`voice-btn ${listening ? "voice-btn--active" : ""}`}
      onClick={listening ? stop : start}
      disabled={!supported}
      title={supported ? "Tap to speak" : "Voice input not supported in this browser"}
    >
      {listening ? "🎙️ Listening…" : "🎤 Speak"}
    </button>
  );
}