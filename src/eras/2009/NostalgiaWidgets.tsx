import { FormEvent, useState } from "react";
import { useEra } from "../../core/EraProvider";
import { Module } from "./Module";
const API_URL = (import.meta.env.VITE_AI_API_URL || "").replace(/\/$/, "");
type ChatLine = { time: string; author: string; message: string };
const initialChat: ChatLine[] = [{ time: "23:41", author: "Admin", message: "Добро пожаловать! Здесь теперь живёт AI-помощник по портфолио." }];
const pollOptions = ["Отлично", "Хорошо", "Нормально", "Ужасно"] as const;
const now = () => new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

export function MiniChat() {
  const { language } = useEra();
  const [chat, setChat] = useState<ChatLine[]>(initialChat);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); const value = question.trim(); if (!value || loading) return;
    setChat(lines => [...lines, { time: now(), author: language === "ru" ? "Гость" : "Guest", message: value }]); setQuestion(""); setLoading(true);
    try {
      if (!API_URL) throw new Error(language === "ru" ? "AI backend пока не настроен" : "AI backend is not configured");
      const response = await fetch(`${API_URL}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: value }) });
      if (!response.ok) throw new Error(language === "ru" ? "Ошибка соединения" : "Connection error");
      const data = await response.json(); setChat(lines => [...lines, { time: now(), author: "Admin AI", message: data.answer }]);
    } catch (error) { setChat(lines => [...lines, { time: now(), author: "Admin AI", message: error instanceof Error ? error.message : "Error" }]); }
    finally { setLoading(false); }
  }
  return <Module title={language === "ru" ? "Мини-чат" : "Mini-chat"} icon="☏"><div className="mini-chat"><p className="widget-note">{language === "ru" ? "Спросите AI о проектах, навыках и домашних работах" : "Ask AI about projects, skills and coursework"}</p><div className="mini-chat-log" aria-live="polite">{chat.map((line, index) => <p key={index}><span>{line.time}</span> <b>{line.author}:</b><br />{line.message}</p>)}{loading && <p><b>Admin AI:</b><br />{language === "ru" ? "печатает…" : "typing…"}</p>}</div><form className="mini-chat-form" onSubmit={submit}><input aria-label={language === "ru" ? "Сообщение AI" : "Message AI"} value={question} onChange={e => setQuestion(e.target.value)} placeholder={language === "ru" ? "Ваш вопрос…" : "Your question…"} maxLength={2000}/><button type="submit" disabled={loading || !question.trim()}>{language === "ru" ? "Отправить" : "Send"}</button></form></div></Module>;
}
export function LocalPoll() { const [answer, setAnswer] = useState(""); return <Module title="Опрос сайта" icon="✓"><div lang="ru"><fieldset className="catalog-poll"><legend>Как вам мой сайт?</legend>{pollOptions.map(option => <label key={option}><input type="radio" name="site-poll" value={option} checked={answer === option} onChange={() => setAnswer(option)} />{option}</label>)}</fieldset><p role="status" className="poll-response">{answer ? answer === "Ужасно" ? "Принято. Админ ушёл править CSS :)" : "Спасибо! Админ одобрительно кивает :)" : "Выберите ответ — админ на связи."}</p><p className="widget-note">Ответ только на этой странице. Не сохраняется и не отправляется.</p></div></Module>; }
export function MusicWidget() { return <Module title="Музыка сайта" icon="♫"><div className="visual-player" aria-label="Decorative music player. No audio playback."><div className="player-display"><span>♫ VISUAL PLAYER</span><strong>Linkin Park — Numb</strong><div className="player-equalizer" aria-hidden="true">{Array.from({length: 10}, (_, i) => <i key={i} style={{ animationDelay: `${i * -0.13}s`, height: `${5 + i % 4 * 3}px` }} />)}</div><div className="player-progress" aria-hidden="true"><span /></div><span>01:37 / 03:07</span></div><div className="player-decoration" aria-hidden="true">◀◀　▶　■　▶▶ <span>STEREO</span></div></div><p className="widget-note" lang="ru">Визуальная пасхалка. Звука нет.</p></Module>; }
export function SiteStatistics() { return <Module title="Статистика" icon="▥"><div lang="ru"><p className="widget-note">Декорация эпохи, не аналитика.</p><dl className="catalog-statistics"><div><dt>Сейчас на сайте:</dt><dd>1</dd></div><div><dt>Гостей:</dt><dd>1</dd></div><div><dt>Пользователей:</dt><dd>0</dd></div></dl><div className="counter-2009" aria-hidden="true">0 0 0 0 0 1</div></div></Module>; }
