import { Module } from "./Module";

export function CalendarWidget() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((firstDay + days) / 7) * 7 }, (_, index) => {
    const day = index - firstDay + 1;
    return day > 0 && day <= days ? day : null;
  });
  return <Module title="Календарь" icon="▦"><table className="catalog-calendar" lang="ru">
    <caption>{today.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}</caption>
    <thead><tr>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(day => <th key={day} scope="col">{day}</th>)}</tr></thead>
    <tbody>{Array.from({ length: cells.length / 7 }, (_, row) => <tr key={row}>{cells.slice(row * 7, row * 7 + 7).map((day, index) => <td key={index} aria-current={day === today.getDate() ? "date" : undefined}>{day}</td>)}</tr>)}</tbody>
  </table><p className="widget-note" lang="ru">Текущий месяц, настоящий календарь.</p></Module>;
}
