import { FormEvent, useMemo, useState } from "react";
import { useEra } from "../../core/EraProvider";
import { useTranslations } from "../../core/TranslationProvider";
import { Module } from "./Module";
const API_URL = (import.meta.env.VITE_AI_API_URL || "").replace(/\/$/, "");
type ChatLine = { time: string; author: "admin" | "guest" | "ai"; message: string };
const pollOptions = ["Excellent", "Good", "Okay", "Terrible"] as const;
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function MiniChat() {
  const { language } = useEra();
  const entries = useMemo(() => ({
    "2009.chat.title": "Mini-chat", "2009.chat.note": "Ask AI about projects, skills and coursework", "2009.chat.welcome": "Welcome! The portfolio AI assistant lives here now.", "2009.chat.guest": "Guest", "2009.chat.ai": "Admin AI", "2009.chat.typing": "typing…", "2009.chat.input": "Message AI", "2009.chat.placeholder": "Your question…", "2009.chat.send": "Send", "2009.chat.backend": "AI backend is not configured", "2009.chat.connection": "Connection error",
  }), []);
  const { t } = useTranslations(entries);
  const [chat, setChat] = useState<ChatLine[]>([{ time: "23:41", author: "admin", message: "2009.chat.welcome" }]);
  const [question, setQuestion] = useState(""); const [loading, setLoading] = useState(false);
  const authorName = (author: ChatLine["author"]) => author === "guest" ? t("2009.chat.guest", "Guest") : author === "ai" ? t("2009.chat.ai", "Admin AI") : "Admin";
  async function submit(event: FormEvent) {
    event.preventDefault(); const value = question.trim(); if (!value || loading) return;
    setChat(lines => [...lines, { time: now(), author: "guest", message: value }]); setQuestion(""); setLoading(true);
    try {
      if (!API_URL) throw new Error(t("2009.chat.backend", "AI backend is not configured"));
      const response = await fetch(`${API_URL}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: value, language }) });
      if (!response.ok) throw new Error(t("2009.chat.connection", "Connection error"));
      const data = await response.json(); setChat(lines => [...lines, { time: now(), author: "ai", message: data.answer }]);
    } catch (error) { setChat(lines => [...lines, { time: now(), author: "ai", message: error instanceof Error ? error.message : "Error" }]); }
    finally { setLoading(false); }
  }
  return <Module title={t("2009.chat.title", "Mini-chat")} icon="☏"><div className="mini-chat"><p className="widget-note">{t("2009.chat.note", "Ask AI about projects, skills and coursework")}</p><div className="mini-chat-log" aria-live="polite">{chat.map((line, index) => <p key={index}><span>{line.time}</span> <b>{authorName(line.author)}:</b><br />{line.author === "admin" ? t(line.message, entries["2009.chat.welcome"]) : line.message}</p>)}{loading && <p><b>{t("2009.chat.ai", "Admin AI")}:</b><br />{t("2009.chat.typing", "typing…")}</p>}</div><form className="mini-chat-form" onSubmit={submit}><input aria-label={t("2009.chat.input", "Message AI")} value={question} onChange={e => setQuestion(e.target.value)} placeholder={t("2009.chat.placeholder", "Your question…")} maxLength={2000}/><button type="submit" disabled={loading || !question.trim()}>{t("2009.chat.send", "Send")}</button></form></div></Module>;
}

export function LocalPoll() {
  const entries = useMemo(() => ({ "2009.poll.title": "Site poll", "2009.poll.question": "How do you like my site?", "2009.poll.excellent": "Excellent", "2009.poll.good": "Good", "2009.poll.okay": "Okay", "2009.poll.terrible": "Terrible", "2009.poll.badResponse": "Noted. The admin went to fix the CSS :)", "2009.poll.goodResponse": "Thanks! The admin nods approvingly :)", "2009.poll.empty": "Choose an answer — the admin is online.", "2009.poll.note": "This answer exists only on this page. It is not saved or sent." }), []);
  const { t } = useTranslations(entries); const [answer, setAnswer] = useState("");
  const labels = [t("2009.poll.excellent", "Excellent"), t("2009.poll.good", "Good"), t("2009.poll.okay", "Okay"), t("2009.poll.terrible", "Terrible")];
  return <Module title={t("2009.poll.title", "Site poll")} icon="✓"><div><fieldset className="catalog-poll"><legend>{t("2009.poll.question", "How do you like my site?")}</legend>{pollOptions.map((option, i) => <label key={option}><input type="radio" name="site-poll" value={option} checked={answer === option} onChange={() => setAnswer(option)} />{labels[i]}</label>)}</fieldset><p role="status" className="poll-response">{answer ? answer === "Terrible" ? t("2009.poll.badResponse", entries["2009.poll.badResponse"]) : t("2009.poll.goodResponse", entries["2009.poll.goodResponse"]) : t("2009.poll.empty", entries["2009.poll.empty"])}</p><p className="widget-note">{t("2009.poll.note", entries["2009.poll.note"])}</p></div></Module>;
}

export function MusicWidget() {
  const entries = useMemo(() => ({ "2009.music.title": "Site music", "2009.music.aria": "Decorative music player. No audio playback.", "2009.music.note": "A visual Easter egg. There is no sound." }), []); const { t } = useTranslations(entries);
  return <Module title={t("2009.music.title", "Site music")} icon="♫"><div className="visual-player" aria-label={t("2009.music.aria", entries["2009.music.aria"])}><div className="player-display"><span>♫ VISUAL PLAYER</span><strong>Linkin Park — Numb</strong><div className="player-equalizer" aria-hidden="true">{Array.from({length: 10}, (_, i) => <i key={i} style={{ animationDelay: `${i * -0.13}s`, height: `${5 + i % 4 * 3}px` }} />)}</div><div className="player-progress" aria-hidden="true"><span /></div><span>01:37 / 03:07</span></div><div className="player-decoration" aria-hidden="true">◀◀　▶　■　▶▶ <span>STEREO</span></div></div><p className="widget-note">{t("2009.music.note", entries["2009.music.note"])}</p></Module>;
}

export function SiteStatistics() {
  const entries = useMemo(() => ({ "2009.stats.title": "Statistics", "2009.stats.note": "Period decoration, not analytics.", "2009.stats.online": "Online now:", "2009.stats.guests": "Guests:", "2009.stats.users": "Users:" }), []); const { t } = useTranslations(entries);
  return <Module title={t("2009.stats.title", "Statistics")} icon="▥"><div><p className="widget-note">{t("2009.stats.note", entries["2009.stats.note"])}</p><dl className="catalog-statistics"><div><dt>{t("2009.stats.online", "Online now:")}</dt><dd>1</dd></div><div><dt>{t("2009.stats.guests", "Guests:")}</dt><dd>1</dd></div><div><dt>{t("2009.stats.users", "Users:")}</dt><dd>0</dd></div></dl><div className="counter-2009" aria-hidden="true">0 0 0 0 0 1</div></div></Module>;
}
