export default function AboutSection() {
  return (
    <section className="page-stack">
      <section className="section-heading">
        <p className="eyebrow">About us</p>
        <h2>A mock interview product built around repo ownership, not generic prompts</h2>
      </section>

      <div className="difference-grid">
        <article className="difference-card card">
          <h3>What the app is for</h3>
          <p>
            ProjectLens is designed for candidates who want their mock interview practice to feel
            like a real product conversation. Instead of asking only generic questions, it frames
            the interview around an actual repository and the judgment behind it.
          </p>
        </article>
        <article className="difference-card card">
          <h3>How the frontend prototype works</h3>
          <p>
            This React frontend simulates repo analysis, question generation, live scoring, voice
            transcript capture, camera rehearsal, and local records tracking so the core product
            experience is tangible end to end.
          </p>
        </article>
        <article className="difference-card card">
          <h3>Design direction</h3>
          <p>
            The interface uses a clean Amazon-inspired visual language with dark navigation, bright
            utility actions, straightforward content hierarchy, and responsive card-based layouts
            for real-world usability.
          </p>
        </article>
      </div>
    </section>
  );
}
