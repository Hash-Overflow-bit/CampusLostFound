import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMessageCircle,
  FiSend,
  FiShield,
  FiSquare,
  FiX,
  FiZap,
} from "react-icons/fi";
import { useAuth } from "../../../AuthContext/AuthContext";
import StatePanel from "../../../components/state/StatePanel";
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
    "Hi — I’m Campus Assistant. I can help you use CampusLostFound and check active public reports from your verified campus for possible matches.",
};

const createMessage = (role, content, id) => ({
  id: id || `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
  content,
});

export default function CampusAssistant() {
  const {
    isAuthenticated,
    isEmailVerified,
    hasTrustedCampus,
    user,
    profile,
    campus,
  } = useAuth();

  if (!isAuthenticated || !isEmailVerified || !hasTrustedCampus) return null;
  return (
    <CampusAssistantChat
      key={`${user.id}:${profile.campus_id}`}
      campusName={campus?.name || profile?.campuses?.name || "your campus"}
    />
  );
}

function CampusAssistantChat({ campusName }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine
  );
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const busy = status === "thinking" || status === "streaming";

  const lastUserMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "user") || null,
    [messages]
  );

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
    if (open && !busy) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, busy]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const stop = () => {
    abortRef.current?.abort();
  };

  const send = async (rawText, { appendUser = true } = {}) => {
    const text = String(rawText || "").trim().slice(0, 700);
    if (!text || busy || abortRef.current || cooldown) return;

    if (!online) {
      setError("You’re offline. Reconnect before asking Campus Assistant.");
      return;
    }

    const conversation = messages.filter((message) => message.id !== "welcome");
    let priorHistory = conversation;

    if (appendUser) {
      setMessages((current) => [...current, createMessage("user", text)]);
    } else {
      const lastUserIndex = conversation.findLastIndex(
        (message) => message.role === "user"
      );
      priorHistory =
        lastUserIndex >= 0 ? conversation.slice(0, lastUserIndex) : conversation;

      setMessages((current) => {
        const index = current.findLastIndex((message) => message.role === "user");
        return index >= 0 ? current.slice(0, index + 1) : current;
      });
    }

    setInput("");
    setError("");
    setNotice("");
    setStatus("thinking");

    const assistantId = `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const controller = new AbortController();
    abortRef.current = controller;
    let receivedText = false;

    try {
      await askCampusAssistant({
        message: text,
        history: priorHistory,
        signal: controller.signal,
        onToken: (_chunk, fullText) => {
          if (controller.signal.aborted) return;
          receivedText = true;
          setStatus("streaming");
          setMessages((current) => {
            const existing = current.findIndex((message) => message.id === assistantId);
            if (existing >= 0) {
              return current.map((message) =>
                message.id === assistantId
                  ? { ...message, content: fullText }
                  : message
              );
            }

            return [...current, createMessage("assistant", fullText, assistantId)];
          });
        },
        onComplete: ({ truncated }) => {
          if (!controller.signal.aborted && truncated) {
            setNotice("Reply reached its length limit. Ask a follow-up to continue.");
          }
        },
      });
    } catch (assistantError) {
      if (assistantError?.name === "AbortError") {
        setNotice("Reply stopped.");
        if (!receivedText) {
          setError("Response stopped before any answer was received.");
        }
        return;
      }

      setCooldown(Math.min(3600, Math.max(0, Math.ceil(Number(assistantError.retryAfter) || 0))));
      setError(
        assistantError?.message ||
          (receivedText
            ? "The live reply was interrupted. You can retry the question."
            : "Campus Assistant could not answer right now. Please try again.")
      );
    } finally {
      abortRef.current = null;
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
    setNotice("");
    setInput("");
  };

  return (
    <div className="campus-assistant">
      {open && (
        <section
          id="campus-assistant-panel"
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

          <div className="campus-assistant__privacy" id="campus-assistant-privacy">
            <FiShield aria-hidden="true" />
            <p>
              <strong>Keep details private.</strong> Google processes your messages and matching public campus reports. Free-tier data may help improve its products. Don’t share passwords, contact details or ownership evidence.
            </p>
          </div>

          <div className="campus-assistant__messages" ref={scrollRef} role="log" aria-label="Campus Assistant conversation" aria-live={busy ? "off" : "polite"} aria-busy={busy}>
            {messages.map((message, index) => {
              const streaming =
                status === "streaming" &&
                message.role === "assistant" &&
                index === messages.length - 1;

              return (
                <div
                  key={message.id}
                  className={`campus-assistant__message campus-assistant__message--${message.role}`}
                >
                  {message.role === "assistant" && (
                    <span className="campus-assistant__avatar" aria-hidden="true">C</span>
                  )}
                  <div
                    className={`campus-assistant__bubble${streaming ? " is-streaming" : ""}`}
                    dir="auto"
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}

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

            {status === "thinking" && (
              <div
                className="campus-assistant__message campus-assistant__message--assistant"
                role="status"
                aria-live="polite"
              >
                <span className="campus-assistant__avatar" aria-hidden="true">C</span>
                <div className="campus-assistant__bubble campus-assistant__thinking">
                  <span />
                  <span />
                  <span />
                  <small>Checking recent campus reports</small>
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
                  online && lastUserMessage
                    ? {
                        label: cooldown ? `Retry in ${cooldown}s` : "Retry",
                        onClick: () =>
                          send(lastUserMessage.content, { appendUser: false }),
                        disabled: busy || cooldown > 0,
                      }
                    : null
                }
                secondaryAction={{
                  label: "Dismiss",
                  onClick: () => setError(""),
                }}
              />
            )}
            {notice && <p className="campus-assistant__notice" role="status">{notice}</p>}
          </div>

          <form className="campus-assistant__composer" onSubmit={submit}>
            <label htmlFor="campus-assistant-input" className="sr-only">
              Ask Campus Assistant
            </label>
            <textarea
              ref={inputRef}
              id="campus-assistant-input"
              dir="auto"
              aria-describedby="campus-assistant-privacy"
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, 700))}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  if (input.trim() && !busy) send(input);
                }
              }}
              placeholder={
                busy
                  ? "Campus Assistant is replying…"
                  : "Ask about a lost item, report or privacy…"
              }
              rows={1}
              maxLength={700}
              disabled={busy}
            />
            <button
              type={busy ? "button" : "submit"}
              className={`campus-assistant__send${busy ? " is-stop" : ""}`}
              onClick={busy ? stop : undefined}
              disabled={!busy && (!input.trim() || !online || cooldown > 0)}
              aria-label={busy ? "Stop reply" : "Send message"}
            >
              {busy ? <FiSquare /> : <FiSend />}
            </button>
          </form>

          <footer className="campus-assistant__footer">
            <nav className="campus-assistant__links" aria-label="Lost and found actions">
              <Link to="/report" onClick={() => setOpen(false)}>Report an item</Link>
              <a href="/#browse-reports" onClick={() => setOpen(false)}>Browse reports</a>
            </nav>
            <span>
              {status === "streaming"
                ? "Replying live · AI can make mistakes"
                : "AI can make mistakes. Verify possible matches safely."}
            </span>
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
        aria-controls="campus-assistant-panel"
      >
        <span className="campus-assistant__launcher-icon">
          {open ? <FiX /> : <FiMessageCircle />}
        </span>
        <span className="campus-assistant__launcher-copy">
          <small>AI</small>
          <strong>Ask Campus AI</strong>
        </span>
      </button>
    </div>
  );
}
