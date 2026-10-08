export default function Faq() {
  return (
    <section id="faq">
        <div className="wrap">
          <div className="center" style={{ marginBottom: '3.2rem' }}>
            <span className="label">Common questions</span>
            <h2 className="s-title">Answers before we connect.</h2>
          </div>
          <div className="faq-list reveal">
            <details>
              <summary>Do you provide compliance services for broker-dealers?<span className="chev"></span></summary>
              <div className="faq-a">No. ComplyOn focuses exclusively on investment advisers, OCIOs, pension funds, endowments and foundations, venture and emerging managers, and digital asset managers and funds. Reema's background includes broker-dealer compliance experience, but the firm does not currently offer broker-dealer compliance services.</div>
            </details>
            <details>
              <summary>Do regulators allow an outsourced or fractional Chief Compliance Officer?<span className="chev"></span></summary>
              <div className="faq-a">Yes. The CCO may be in-house or outsourced, provided the individual is knowledgeable about applicable regulations and has sufficient authority and access to senior management to implement and enforce the compliance program.</div>
            </details>
            <details>
              <summary>What does an engagement cost?<span className="chev"></span></summary>
              <div className="faq-a">It depends on scope. Fractional CCO engagements are billed as a monthly retainer, ongoing support as a retainer or hourly rate, and project-based work as an hourly or flat fee. A proposal follows an initial conversation about your firm and needs.</div>
            </details>
            <details>
              <summary>Do you work with firms that don't yet have a registered adviser or a formal compliance program?<span className="chev"></span></summary>
              <div className="faq-a">Yes. ComplyOn supports firms building a compliance program from the ground up, including registration support, initial policy drafting, and governance infrastructure — as well as firms with mature programs seeking an experienced second set of eyes.</div>
            </details>
            <details>
              <summary>Can you support a firm with digital asset exposure?<span className="chev"></span></summary>
              <div className="faq-a">Yes. ComplyOn works with investment advisers and funds with digital asset exposure, building AML, custody, and safeguarding frameworks that apply institutional compliance standards to requirements emerging under SEC, CFTC, and FinCEN rules and regulations.</div>
            </details>
            <details>
              <summary>How do you help firms keep pace with regulatory change?<span className="chev"></span></summary>
              <div className="faq-a">Through ongoing compliance support or a defined project, ComplyOn tracks new and amended rules relevant to your firm, assesses their impact on your program, and helps implement the policy, procedural, and operational changes they require — before an examination tests them.</div>
            </details>
            <details>
              <summary>Do you help firms govern their use of AI?<span className="chev"></span></summary>
              <div className="faq-a">Yes, as part of ComplyOn's governance, risk and controls work. That includes inventorying how AI tools are used across the firm, drafting acceptable use policies, conducting due diligence on AI vendors, reviewing Form ADV and marketing materials so AI-related claims match actual practice, addressing supervision and recordkeeping for AI-generated communications and meeting note-takers, and training staff. How advisers supervise their use of AI, and whether their representations about it are accurate, is a current focus of SEC examinations.</div>
            </details>
            <details>
              <summary>Do you use AI tools in your own work?<span className="chev"></span></summary>
              <div className="faq-a">Yes, selectively and with safeguards. ComplyOn uses enterprise-grade AI tools to work more efficiently, does not enter client confidential information into consumer or public AI tools without the client's consent, and reviews all work product personally. Responsibility for every deliverable rests with Reema, not with a tool.</div>
            </details>
            <details>
              <summary>Do you work alongside other professionals?<span className="chev"></span></summary>
              <div className="faq-a">Yes. Reema leads each engagement personally and works alongside a client's legal counsel, auditors, fund administrators, and technology providers, bringing in trusted specialist partners where an engagement calls for additional expertise or capacity. ComplyOn provides compliance consulting and does not provide legal, tax, or investment advice.</div>
            </details>
          </div>
        </div>
      </section>
  );
}
