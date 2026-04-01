export default function FeatureCard({ tag, title, copy }) {
  return (
    <article className="feature-card">
      <span className="feature-tag">{tag}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}
