export default function ContactSection({
  contactForm,
  contactMessage,
  handleContactChange,
  handleContactSubmit
}) {
  return (
    <section className="page-stack">
      <section className="section-heading">
        <h2>Reach the team or collect product interest</h2>
        <p className="section-copy">
          This section rounds out the frontend with a realistic contact area for support, founder
          outreach, or early product requests.
        </p>
      </section>

      <div className="contact-layout">
        <article className="card contact-card">
          <p className="mini-heading">Contact details</p>
          <h3>ProjectLens Mock Studio</h3>
          <ul className="bullet-list">
            <li>Email: hello@projectlens.ai</li>
            <li>Support: support@projectlens.ai</li>
            <li>Location: Greater Noida, India</li>
          </ul>
        </article>

        <form className="card contact-form" onSubmit={handleContactSubmit}>
          <p className="mini-heading">Send a message</p>
          <h3>Ask for a demo, feedback, or product roadmap details</h3>

          <label className="field">
            <span>Name</span>
            <input
              name="name"
              type="text"
              value={contactForm.name}
              onChange={handleContactChange}
              placeholder="Your name"
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={contactForm.email}
              onChange={handleContactChange}
              placeholder="Your email"
            />
          </label>

          <label className="field">
            <span>Message</span>
            <textarea
              name="message"
              value={contactForm.message}
              onChange={handleContactChange}
              placeholder="Tell us what kind of interview experience you want to build."
            ></textarea>
          </label>

          <button type="submit" className="primary-btn">
            Send Message
          </button>
          <p className="helper-text">{contactMessage}</p>
        </form>
      </div>
    </section>
  );
}
