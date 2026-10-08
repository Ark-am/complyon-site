export default function Engagements() {
  return (
    <section className="tint" id="engagements">
        <div className="wrap">
          <div className="head-split">
            <div>
              <span className="label">How we work together</span>
              <h2 className="s-title">Engagement models built around your stage.</h2>
            </div>
            <p className="lead">Every service area above can be delivered under any of these three models. Each engagement starts with a conversation about your firm, your regulators, and where the gaps actually sit; a proposal follows.</p>
          </div>
          <div className="eng-grid reveal">
            <div className="eng">
              <div className="eng-kind">Outsourced</div>
              <h3>Fractional CCO</h3>
              <p>Hand off day-to-day compliance ownership to a senior advisor, without adding headcount (for selective engagements).</p>
              <ul>
                <li>Program ownership and regulatory interface</li>
                <li>Testing, remediation, and documentation</li>
                <li>Employee reporting and training</li>
                <li>Form ADV, filings, and exam coordination</li>
              </ul>
              <div className="eng-fee">Monthly retainer</div>
            </div>
            <div className="eng">
              <div className="eng-kind">Ongoing</div>
              <h3>Compliance support</h3>
              <p>Recurring support alongside your existing team, as much or as little as you need.</p>
              <ul>
                <li>Compliance calendar management</li>
                <li>Annual review and risk assessment</li>
                <li>Advice on new or amended regulations</li>
              </ul>
              <div className="eng-fee">Monthly retainer or hourly</div>
            </div>
            <div className="eng">
              <div className="eng-kind">Project</div>
              <h3>Defined engagements</h3>
              <p>A specific compliance problem scoped and solved, with documentation your team can run with.</p>
              <ul>
                <li>Program builds and registration support</li>
                <li>Operational due diligence reviews</li>
                <li>New regulation implementation</li>
                <li>Contract review and framework design</li>
                <li>Mock exams and SEC exam prep</li>
              </ul>
              <div className="eng-fee">Hourly or flat fee</div>
            </div>
          </div>
        </div>
      </section>
  );
}
