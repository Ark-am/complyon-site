export default function Clients() {
  return (
    <section className="tint" id="clients">
        <div className="wrap">
          <div className="head-split">
            <div>
              <span className="label">Who we serve</span>
              <h2 className="s-title">Firms where the regulatory stakes are highest.</h2>
            </div>
            <p className="lead">Engagements span institutional investors and the managers who serve them.</p>
          </div>
          <div className="reveal">
            <div className="client-row">
              <div className="client-name">Investment advisers</div>
              <div className="client-desc">SEC-registered RIAs, hedge funds, and private equity managers.</div>
            </div>
            <div className="client-row">
              <div className="client-name">OCIO firms</div>
              <div className="client-desc">Outsourced Chief Investment Officer platforms managing multi-manager, institutional-scale portfolios, where sub-adviser oversight and manager due diligence carry their own compliance demands.</div>
            </div>
            <div className="client-row">
              <div className="client-name">Pension funds</div>
              <div className="client-desc">Corporate and public pension funds navigating ERISA, DOL, and fiduciary requirements.</div>
            </div>
            <div className="client-row">
              <div className="client-name">Endowments &amp; foundations</div>
              <div className="client-desc">Nonprofit endowments and foundations navigating UPMIFA and prudent-investor governance standards.</div>
            </div>
            <div className="client-row">
              <div className="client-name">Digital asset managers &amp; funds</div>
              <div className="client-desc">Investment advisers and funds with digital asset exposure building AML, custody, and safeguarding frameworks aligned with SEC, CFTC, and FinCEN requirements.</div>
            </div>
            <div className="client-row">
              <div className="client-name">Venture &amp; emerging managers</div>
              <div className="client-desc">Emerging and established venture capital fund managers, including those backing digital asset and blockchain companies, building institutional-grade compliance programs and navigating regulatory change as they raise capital and grow.</div>
            </div>
          </div>
        </div>
      </section>
  );
}
