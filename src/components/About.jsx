import portrait from '../assets/reema-keen.jpg';

export default function About() {
  return (
    <section className="about tint" id="about">
        <div className="wrap">
          <div className="about-grid">
            <figure className="portrait reveal">
              <div className="portrait-frame">
                <img src={portrait} alt="Reema Keen, Founder and Principal of ComplyOn LLC" width="936" height="1245" loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <div className="portrait-name">Reema Keen</div>
                <div className="portrait-role">Founder &amp; Principal, ComplyOn LLC</div>
              </figcaption>
            </figure>
            <div className="about-text reveal">
              <span className="label">About the firm</span>
              <h2 className="s-title" style={{ marginBottom: '1.8rem' }}>Senior compliance expertise, delivered with precision.</h2>
              <p>ComplyOn LLC is an Atlanta-based independent compliance and risk advisory practice founded by Reema Keen, a compliance leader with more than sixteen years of experience building and overseeing regulatory compliance programs across SEC-registered investment advisers, institutional pension funds, broker-dealers, and global financial institutions.</p>
              <p>Most recently, Reema served as Managing Director and Chief Compliance Officer at a $3 billion SEC-registered outsourced chief investment officer (OCIO) firm, where she institutionalized and enhanced the compliance program and brought the firm to full SEC examination readiness. Before that, she held senior compliance and operations leadership roles at UPS Investments Group, a $50B+ institutional pension fund, overseeing governance and due diligence across more than 200 investment managers. Earlier in her career, she supported enterprise-wide AML/BSA remediation following a DOJ consent order.</p>
              <p>ComplyOn pairs senior-level judgment with a collaborative, scalable delivery model. Reema leads each engagement personally and works alongside clients' legal counsel, auditors, and administrators, drawing on trusted specialist partners and technology where a mandate calls for additional expertise or capacity. The aim is a long-term partnership: the right expertise, applied at the right scale, as each firm grows.</p>
              <div className="creds-k">Areas of expertise</div>
              <div className="creds">
                <span>SEC regulatory compliance</span>
                <span>AML, OFAC &amp; financial crime</span>
                <span>ERISA &amp; DOL advisory</span>
                <span>Governance, risk &amp; controls</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
