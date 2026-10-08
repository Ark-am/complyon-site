export const FIELD_LIMITS = {
  first_name: 100,
  last_name: 100,
  organization: 200,
  email: 254,
  area_of_interest: 100,
  message: 5000,
};

// Pure validation shared by the browser and API; no server configuration here.
export function validateInquiry(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'Please submit a valid inquiry.' };
  }

  const values = {};
  for (const [name, limit] of Object.entries(FIELD_LIMITS)) {
    const value = input[name] ?? '';
    if (typeof value !== 'string') {
      return { error: 'Please submit text values for all inquiry fields.' };
    }
    values[name] = value.trim();
    if (values[name].length > limit) {
      return { error: `${name.replaceAll('_', ' ')} must be ${limit} characters or fewer.` };
    }
    // Names and addresses must not contain header delimiters/control characters.
    const invalid = name === 'message' ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/;
    if (invalid.test(values[name])) {
      return { error: 'Please remove unsupported characters from your inquiry.' };
    }
  }

  if (!values.first_name || !values.last_name || !values.email || !values.message) {
    return { error: 'Please complete your name, email address, and message.' };
  }
  if (!/^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(values.email)
      || values.email.split('@')[0].length > 64
      || values.email.startsWith('.')
      || values.email.includes('..')
      || values.email.includes('.@')) {
    return { error: 'That email address does not look right. Please check it and try again.' };
  }

  return { values };
}
