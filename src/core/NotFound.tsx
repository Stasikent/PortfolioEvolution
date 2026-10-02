export function NotFound() {
  return <main className="not-found" tabIndex={-1}>
    <p>PORTFOLIO EVOLUTION / 404</p>
    <h1>This page isn’t here.</h1>
    <p>The portfolio lives on one page. Return to the projects or choose an era there.</p>
    <a href={import.meta.env.BASE_URL}>Open the portfolio →</a>
  </main>;
}
