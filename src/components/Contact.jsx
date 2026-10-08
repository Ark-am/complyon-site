import useInquiryForm, { INQUIRY_API_URL } from '../hooks/useInquiryForm';
import { FIELD_LIMITS } from '../../server/validation';

export default function Contact() {
  const { onSubmit, status, isError, submitState } = useInquiryForm();
  return (
    <section className="tint" id="contact">
        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-info reveal">
              <span className="label">Get in touch</span>
              <h2>Let's discuss your compliance needs.</h2>
              <p>Whether you need fractional CCO support, a program assessment, or ongoing advisory, ComplyOn is ready to engage. All inquiries are handled with strict confidentiality.</p>
              <div className="cd">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><polyline points="21.5,6.5 12,13.5 2.5,6.5"/></svg>
                <div><div className="cd-k">Email</div><div className="cd-v"><a href="mailto:reema.keen@complyonllc.com">reema.keen@complyonllc.com</a></div></div>
              </div>
              <div className="cd">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21.5 16.9v2.9a2 2 0 01-2.2 2 19.6 19.6 0 01-8.5-3 19.3 19.3 0 01-6-6 19.6 19.6 0 01-3-8.6 2 2 0 012-2.2h2.9a2 2 0 012 1.7c.1 1 .3 1.9.7 2.8a2 2 0 01-.5 2.1L7.4 8.4a15.8 15.8 0 006.6 6.6l1.5-1.4a2 2 0 012.1-.5c.9.4 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>
                <div><div className="cd-k">Phone</div><div className="cd-v"><a href="tel:+16468964191">(646) 896-4191</a></div></div>
              </div>
              <div className="cd">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 10.5c0 6.5-8.5 12-8.5 12s-8.5-5.5-8.5-12a8.5 8.5 0 0117 0z"/><circle cx="12" cy="10.3" r="2.8"/></svg>
                <div><div className="cd-k">Location</div><div className="cd-v">Atlanta, Georgia</div></div>
              </div>
              <div className="cd">
                <svg className="glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5.001A2.5 2.5 0 014.98 3.5zM2.4 21h5.16V9.5H2.4V21zm7.3-11.5V21h5.16v-6.36c0-3.36 4.36-3.63 4.36 0V21h5.16v-8.14c0-8.06-9.22-7.77-9.52-3.8V9.5H9.7z"/></svg>
                <div><div className="cd-k">LinkedIn</div><div className="cd-v"><a href="https://www.linkedin.com/in/reema-keen-57a8b77/" target="_blank" rel="noopener noreferrer">Reema Keen</a></div></div>
              </div>
            </div>
    
            <form className="form reveal" id="inquiryForm" method="POST" action={INQUIRY_API_URL} noValidate onSubmit={onSubmit}>
              <div className="fg frow">
                <div><label htmlFor="fn">First name <span className="req">*</span></label><input id="fn" name="first_name" maxLength={FIELD_LIMITS.first_name} type="text" autoComplete="given-name" placeholder="Jane" required /></div>
                <div><label htmlFor="ln">Last name <span className="req">*</span></label><input id="ln" name="last_name" maxLength={FIELD_LIMITS.last_name} type="text" autoComplete="family-name" placeholder="Smith" required /></div>
              </div>
              <div className="fg"><label htmlFor="org">Organization</label><input id="org" name="organization" maxLength={FIELD_LIMITS.organization} type="text" autoComplete="organization" placeholder="Your firm" /></div>
              <div className="fg"><label htmlFor="em">Email address <span className="req">*</span></label><input id="em" name="email" maxLength={FIELD_LIMITS.email} type="email" autoComplete="email" placeholder="jane@example.com" required /></div>
              <div className="fg">
                <label htmlFor="area">Area of interest</label>
                <select id="area" name="area_of_interest" defaultValue="">
                  <option value="" disabled>Select a service area</option>
                  <option>AML / OFAC / financial crime</option>
                  <option>SEC regulatory compliance</option>
                  <option>ERISA / DOL advisory</option>
                  <option>Fractional CCO services</option>
                  <option>Governance, risk &amp; controls</option>
                  <option>AI governance</option>
                  <option>Operational due diligence</option>
                  <option>Digital asset compliance</option>
                  <option>Contract review &amp; advisory</option>
                  <option>Something else</option>
                </select>
              </div>
              <div className="fg"><label htmlFor="msg">Message <span className="req">*</span></label><textarea id="msg" name="message" maxLength={FIELD_LIMITS.message} placeholder="Tell us briefly about your compliance needs" required></textarea></div>
              <div className="hp" aria-hidden="true"><label htmlFor="company_website">Leave this field empty</label><input id="company_website" name="_gotcha" type="text" tabIndex="-1" autoComplete="off" /></div>
              <button type="submit" className="btn" id="inquirySubmit" disabled={submitState !== 'idle'}>{submitState === 'sending' ? 'Sending' : submitState === 'sent' ? 'Sent' : 'Send inquiry'}</button>
              <div className={`form-status${status ? ' show' : ''}${isError ? ' err' : ''}`} id="formStatus" role="status" aria-live="polite">{status}</div>
            </form>
          </div>
        </div>
      </section>
  );
}
