import { FormEvent, useState } from "react";
import { useEra } from "../core/EraProvider";
import "./portfolio-assistant.css";

type Source = { title: string; url: string; excerpt?: string; kind: string };
type Message = { role: "user" | "assistant"; text: string; sources?: Source[] };

const API_URL = (import.meta.env.VITE_AI_API_URL || "").replace(/\/$/, "");

export function PortfolioAssistant() {
  const { era, language } = useEra();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  if (era === 2009) return null;
  const starters = language === "ru" ? ["Какие проекты подтверждают опыт с Python и API?", "Есть ли опыт с Playwright?", "Что в портфолио связано с AI/LLM?"] : ["Which projects demonstrate Python and API experience?", "Is there evidence of Playwright experience?", "What in this portfolio is related to AI/LLM?"];

  async function ask(text: string) {
    const value = text.trim();
    if (!value || loading) return;
    setMessages((items) => [...items, { role: "user", text: value }]); setQuestion(""); setLoading(true);
    try {
      if (!API_URL) throw new Error(language === "ru" ? "AI backend пока не настроен" : "AI backend is not configured yet");
      const response = await fetch(`${API_URL}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: value }) });
      if (!response.ok) throw new Error(language === "ru" ? "Ошибка запроса к ассистенту" : "Assistant request failed");
      const data = await response.json();
      setMessages((items) => [...items, { role: "assistant", text: data.answer, sources: data.sources }]);
    } catch (error) {
      setMessages((items) => [...items, { role: "assistant", text: error instanceof Error ? error.message : (language === "ru" ? "Ассистент временно недоступен" : "Assistant is temporarily unavailable") }]);
    } finally { setLoading(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); void ask(question); }

  return <aside className={`portfolio-assistant ${open ? "is-open" : ""}`} aria-label="AI portfolio assistant">
    <button className="portfolio-assistant-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>{open ? (language === "ru" ? "Закрыть AI" : "Close AI") : "Ask AI"}</button>
    {open && <div className="portfolio-assistant-panel">
      <header><strong>Portfolio Copilot</strong><span>{language === "ru" ? "Ответы на основе проектов и работ" : "Answers from project evidence"}</span></header>
      <div className="portfolio-assistant-log" aria-live="polite">
        {messages.length === 0 && <div className="portfolio-assistant-welcome"><p>{language === "ru" ? "Спросите о проектах, технологиях и подтверждённом опыте." : "Ask about projects, technologies and verified experience."}</p>{starters.map((starter) => <button key={starter} onClick={() => void ask(starter)}>{starter}</button>)}</div>}
        {messages.map((message, index) => <div key={index} className={`assistant-message ${message.role}`}><p>{message.text}</p>{!!message.sources?.length && <ul>{message.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul>}</div>)}
        {loading && <p className="assistant-loading">{language === "ru" ? "Ищу подтверждения…" : "Searching evidence…"}</p>}
      </div>
      <form onSubmit={submit}><label className="sr-only" htmlFor="portfolio-question">Ask about the portfolio</label><input id="portfolio-question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={language === "ru" ? "Спросите о Python, ML, QA…" : "Ask about Python, ML, QA…"} maxLength={2000} /><button type="submit" disabled={loading || !question.trim()}>{language === "ru" ? "Спросить" : "Ask"}</button></form>
      <small>{language === "ru" ? "Ответы основаны на источниках; если подтверждений нет, ассистент сообщит об этом." : "Source-grounded: if evidence is missing, the assistant should say so."}</small>
    </div>}
  </aside>;
}
