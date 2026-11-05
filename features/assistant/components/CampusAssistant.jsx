import { useEffect, useRef, useState } from "react";
import {
  FiMessageCircle,
  FiSend,
  FiShield,
  FiX,
  FiZap,
} from "react-icons/fi";
import { useAuth } from "../../../AuthContext/AuthContext";
import StatePanel from "../../../components/state/StatePanel";
import { getAssistantReportContext } from "../repositories/supabaseAssistantRepository";
import { askCampusAssistant } from "../services/campusAssistantService";
import "./CampusAssistant.css";

const STARTERS = [
  "I lost something. Can you check possible matches?",
  "How do I report a found item?",
  "Are my contact details public?",
];

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi — I’m Campus Assistant. I can help you use CampusLostFound and check public reports from your verified campus for possible matches.",
};

const createMessage = (role, content) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
  content,
});

export default function CampusAssistant() {
  const {
    isAuthenticated,
    isEmailVerified,
    hasTrustedCampus,
    profile,
    campus,
  } = useAuth();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine
  );
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const enabled = isAuthenticated && isEmailVerified && hasTrustedCampus;
  const campusName = campus?.name || profile?.campuses?.name || "your campus";
  const busy = status === "thinking";

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages, open, status]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  if (!enabled) return null;

  const send = async (rawText, { appendUser = true } = {}) => {
    const text = String(rawText || "").trim().slice(0, 700);
    if (!text || busy) return;

    if (!online) {
      setError("You’re offline. Reconnect before asking Campus Assistant.");
      return;
    }

    const userMessage = createMessage("user", text);
    const conversation = messages.filter((message) => message.id !== "welcome");
    const priorHistory =
      appendUser || conversation.at(-1)?.role !== "user"
        ? conversation
        : conversation.slice(0, -1);

    if (appendUser) {
      setMessages((current) => [...current, userMessage]);
    }
    setInput("");
    setError("");
    setStatus("thinking");

    try {
      const reports = await getAssistantReportContext({
        campusId: profile?.campus_id,
        query: text,
      });

      const reply = await askCampusAssistant({
        message: text,
        history: priorHistory,
        reports,
        campusName,
      });

      setMessages((current) => [...current, createMessage("assistant", reply)]);
    } catch (assistantError) {
      console.error("Campus Assistant error:", assistantError);
      setError(
        assistantError?.message ||
          "Campus Assistant could not answer right now. Please try again."
      );
    } finally {
      setStatus("idle");
    }
  };

  const submit = (event) => {
    event.preventDefault();
    send(input);
  };

  const clearConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setError("");
    setInput("");
  };

  return (
    <div className="campus-assistant">
      {open && (
        <section
          className="campus-assistant__panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="campus-assistant-title"
        >
          <header className="campus-assistant__header">
            <div className="campus-assistant__identity">
              <span className="campus-assistant__mark" aria-hidden="true">
                <FiZap />
              </span>
              <div>
                <p>AI campus helper</p>
                <h2 id="campus-assistant-title">Campus Assistant</h2>
                <span>{campusName}</span>
              </div>
            </div>

            <button
              type="button"
              className="campus-assistant__close"
              onClick={() => setOpen(false)}
              aria-label="Close Campus Assistant"
            >
              <FiX />
            </button>
          </header>

          <div className="campus-assistant__privacy">
            <FiShield aria-hidden="true" />
            <p>
              <strong>Privacy first.</strong> AI receives only public report fields.
              Don’t share passwords, OTPs, phone numbers or secret ownership evidence.
            </p>
          </div>

          <div className="campus-assistant__messages" ref={scrollRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`campus-assistant__message campus-assistant__message--${message.role}`}
              >
                {message.role === "assistant" && (
                  <span className="campus-assistant__avatar" aria-hidden="true">C</span>
                )}
                <div className="campus-assistant__bubble">
                  {message.content}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="campus-assistant__starters" aria-label="Suggested questions">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => send(starter)}
                    disabled={busy}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}

            {busy && (
              <div className="campus-assistant__message campus-assistant__message--assistant" role="status">
                <span className="campus-assistant__avatar" aria-hidden="true">C</span>
                <div className="campus-assistant__bubble campus-assistant__thinking">
                  <span />
                  <span />
                  <span />
                  <small>Checking your campus</small>
                </div>
              </div>
            )}

            {error && (
              <StatePanel
                compact
                tone={online ? "error" : "warning"}
                title={online ? "Assistant unavailable" : "You’re offline"}
                description={error}
                action={
                  online && messages.at(-1)?.role === "user"
                    ? {
                        label: "Retry",
                        onClick: () => send(messages.at(-1).content, { appendUser: false }),
                        disabled: busy,
                      }
                    : null
                }
                secondaryAction={{
                  label: "Dismiss",
                  onClick: () => setError(""),
                }}
              />
            )}
          </div>

          <form className="campus-assistant__composer" onSubmit={submit}>
            <label htmlFor="campus-assistant-input" className="sr-only">
              Ask Campus Assistant
            </label>
            <textarea
              ref={inputRef}
              id="campus-assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, 700))}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (input.trim()) send(input);
                }
              }}
              placeholder="Ask about a lost item, report or privacy…"
              rows={1}
              maxLength={700}
              disabled={busy}
            />
            <button
              type="submit"
              className="campus-assistant__send"
              disabled={busy || !input.trim() || !online}
              aria-label="Send message"
            >
              <FiSend />
            </button>
          </form>

          <footer className="campus-assistant__footer">
            <span>AI can make mistakes. Verify possible matches safely.</span>
            {messages.length > 1 && (
              <button type="button" onClick={clearConversation} disabled={busy}>
                Clear chat
              </button>
            )}
          </footer>
        </section>
      )}

      <button
        type="button"
        className={`campus-assistant__launcher${open ? " is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="campus-assistant-title"
      >
        <span className="campus-assistant__launcher-icon">
          {open ? <FiX /> : <FiMessageCircle />}
        </span>
        <span className="campus-assistant__launcher-copy">
          <small>New</small>
          <strong>Ask Campus AI</strong>
        </span>
      </button>
    </div>
  );
}
