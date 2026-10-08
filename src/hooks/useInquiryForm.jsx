import { useRef, useState } from 'react';
import { validateInquiry } from '../../server/validation';

export const INQUIRY_API_URL = import.meta.env.VITE_INQUIRY_API_URL || '/api/inquiry';

const EMAIL = 'reema.keen@complyonllc.com';

export default function useInquiryForm() {
  const sending = useRef(false);
  const [status, setStatus] = useState(null);
  const [isError, setIsError] = useState(false);
  const [submitState, setSubmitState] = useState('idle');

  function say(message, error = false) {
    setStatus(message);
    setIsError(error);
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    if (form.elements._gotcha.value) return;

    const values = {};
    ['first_name', 'last_name', 'organization', 'email', 'area_of_interest', 'message'].forEach((name) => {
      values[name] = form.elements[name].value.trim();
    });

    const result = validateInquiry(values);
    if (result.error) {
      say(result.error, true);
      return;
    }

    sending.current = true;
    setSubmitState('sending');
    say('Sending your inquiry.');
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.values, _gotcha: form.elements._gotcha.value }),
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (!response.ok) {
        setSubmitState('idle');
        say(data.error || 'Your inquiry could not be sent. Please try again shortly.', true);
        return;
      }
      if (data.ok !== true) throw new Error('Unexpected API response');
      form.reset();
      say('Thank you. Your inquiry has been sent and will be answered directly.');
      setSubmitState('sent');
    } catch {
      setSubmitState('idle');
      say(<>The form could not send. Please write to <a href={'mailto:' + EMAIL}>{EMAIL}</a> instead.</>, true);
    } finally {
      sending.current = false;
    }
  }

  return { onSubmit, status, isError, submitState };
}
