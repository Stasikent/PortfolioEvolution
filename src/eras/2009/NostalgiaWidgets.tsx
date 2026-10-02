import { useState } from "react";
import { Module } from "./Module";

// Period-specific fiction stays here, never in the shared portfolio model.
const chat = [
  { time: "23:41", author: "Admin", message: "Добро пожаловать!" },
  { time: "23:42", author: "Guest", message: "а где скачать?" },
  { time: "23:42", author: "Admin", message: "GitHub в каталоге :)" },
] as const;
const pollOptions = ["Отлично", "Хорошо", "Нормально", "Ужасно"] as const;

export function MiniChat() {
  return <Module title="Мини-чат" icon="☏"><div lang="ru" className="mini-chat"><p className="widget-note">Архив воображаемого чата · без отправки</p>{chat.map((line, index) => <p key={index}><span>{line.time}</span> <b>{line.author}:</b><br />{line.message}</p>)}</div></Module>;
}

export function LocalPoll() {
  const [answer, setAnswer] = useState("");
  return <Module title="Опрос сайта" icon="✓"><div lang="ru"><fieldset className="catalog-poll"><legend>Как вам мой сайт?</legend>{pollOptions.map(option => <label key={option}><input type="radio" name="site-poll" value={option} checked={answer === option} onChange={() => setAnswer(option)} />{option}</label>)}</fieldset><p role="status" className="poll-response">{answer ? answer === "Ужасно" ? "Принято. Админ ушёл править CSS :)" : "Спасибо! Админ одобрительно кивает :)" : "Выберите ответ — админ на связи."}</p><p className="widget-note">Ответ только на этой странице. Не сохраняется и не отправляется.</p></div></Module>;
}

export function MusicWidget() {
  return <Module title="Музыка сайта" icon="♫"><div className="visual-player" aria-label="Decorative music player. No audio playback.">
    <div className="player-display"><span>♫ VISUAL PLAYER</span><strong>Linkin Park — Numb</strong><div className="player-equalizer" aria-hidden="true">{Array.from({length: 10}, (_, i) => <i key={i} style={{ animationDelay: `${i * -0.13}s`, height: `${5 + i % 4 * 3}px` }} />)}</div><div className="player-progress" aria-hidden="true"><span /></div><span>01:37 / 03:07</span></div>
    <div className="player-decoration" aria-hidden="true">◀◀　▶　■　▶▶ <span>STEREO</span></div>
  </div><p className="widget-note" lang="ru">Визуальная пасхалка. Звука нет.</p></Module>;
}

export function SiteStatistics() {
  return <Module title="Статистика" icon="▥"><div lang="ru"><p className="widget-note">Декорация эпохи, не аналитика.</p><dl className="catalog-statistics"><div><dt>Сейчас на сайте:</dt><dd>1</dd></div><div><dt>Гостей:</dt><dd>1</dd></div><div><dt>Пользователей:</dt><dd>0</dd></div></dl><div className="counter-2009" aria-hidden="true">0 0 0 0 0 1</div></div></Module>;
}
