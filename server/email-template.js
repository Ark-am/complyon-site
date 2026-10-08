function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function getInquirySubject(values) {
  return `ComplyOn website inquiry — ${values.organization || `${values.first_name} ${values.last_name}`}`;
}

export function renderInquiryEmail(values) {
  const name = `${values.first_name} ${values.last_name}`;
  const email = escapeHtml(values.email);
  // Keep the address separator literal: mailto uses local-part@domain.
  // Encoding it as %40 can cause mail clients to drop the recipient.
  // Encode reserved characters within the address, including ?, & and #.
  // https://www.rfc-editor.org/rfc/rfc6068.html#section-2
  const recipient = encodeURIComponent(values.email).replace('%40', '@');
  const mailto = escapeHtml(`mailto:${recipient}`);
  const subject = getInquirySubject(values);
  const quotedMessage = values.message.split(/\r\n|\r|\n/).map(line => `> ${line}`).join('\r\n');
  const replyBody = [
    '',
    '',
    '--- Original inquiry ---',
    `From: ${name} <${values.email}>`,
    `Organization: ${values.organization || 'Not provided'}`,
    `Subject: ${subject}`,
    `Area of interest: ${values.area_of_interest || 'Not specified'}`,
    '',
    quotedMessage,
  ].join('\r\n');
  const replyUrl = escapeHtml(`mailto:${recipient}?subject=${encodeURIComponent(`Re: ${subject}`)}&body=${encodeURIComponent(replyBody)}`);
  const message = escapeHtml(values.message).replace(/\r\n|\r|\n/g, '<br>');
  const preheader = escapeHtml(`New inquiry from ${name}${values.organization ? ` at ${values.organization}` : ''}. ${values.area_of_interest || 'View their message and reply directly.'}`);

  // Tables and inline styles keep the core layout usable when email clients
  // strip embedded CSS. No remote images or fonts are needed to read it.
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>New ComplyOn inquiry</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    a:focus-visible { outline: 2px solid #7b68a8; outline-offset: 4px; }
    @media only screen and (max-width: 600px) {
      .outer-pad { padding: 16px 8px !important; }
      .content-pad { padding-left: 24px !important; padding-right: 24px !important; }
      .email-title { font-size: 30px !important; }
      .contact-name { font-size: 25px !important; }
      .reply-button { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:#f4f2f7;color:#3d3950;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;font-size:1px;color:#f4f2f7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f2f7" style="width:100%;background-color:#f4f2f7;">
    <tr><td class="outer-pad" align="center" style="padding:40px 16px;">
      <!--[if mso]><table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;table-layout:fixed;">
        <tr><td style="background-color:#4a3570;border-radius:16px 16px 0 0;" bgcolor="#4a3570">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;">
            <tr><td class="content-pad" style="padding:32px 40px 26px;">
              <p style="margin:0;color:#ffffff;font-family:Georgia,'Times New Roman',serif;font-size:29px;line-height:36px;letter-spacing:-1px;">Comply<span style="color:#d5c9ed;">On</span><span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#d5c9ed;"> &nbsp; LLC</span></p>
              <p style="margin:6px 0 0;font-size:10px;line-height:17px;letter-spacing:2px;color:#e6e0f0;text-transform:uppercase;">Compliance &amp; risk advisory</p>
            </td></tr>
            <tr><td class="content-pad" style="padding:0 40px;"><div style="height:1px;line-height:1px;background-color:#7b68a8;">&nbsp;</div></td></tr>
            <tr><td class="content-pad" style="padding:28px 40px 36px;">
              <p style="margin:0 0 12px;font-size:11px;line-height:18px;letter-spacing:2px;font-weight:bold;color:#e6e0f0;text-transform:uppercase;">From your website</p>
              <h1 class="email-title" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:36px;line-height:1.2;letter-spacing:-0.5px;color:#ffffff;">New website inquiry<span style="color:#c8b6e4;">.</span></h1>
              <p style="margin:14px 0 0;font-size:14px;line-height:23px;color:#e6e0f0;">Someone would like to connect with ComplyOn.<br>Their details and message are below.</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td bgcolor="#ffffff" style="background-color:#ffffff;border:1px solid #e4deed;border-top:0;border-radius:0 0 16px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;">
            <tr><td class="content-pad" style="padding:34px 40px 28px;overflow-wrap:anywhere;word-wrap:break-word;word-break:break-word;">
              <p style="margin:0 0 10px;font-size:10px;line-height:17px;letter-spacing:1.8px;font-weight:bold;text-transform:uppercase;color:#7b68a8;">Contact details</p>
              <h2 class="contact-name" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:29px;font-weight:normal;line-height:1.3;color:#14121c;">${escapeHtml(name)}</h2>
              <p style="margin:6px 0 16px;font-size:15px;line-height:24px;color:#5f5a6e;">${escapeHtml(values.organization || 'Organization not provided')}</p>
              <p style="margin:0;font-size:14px;line-height:24px;"><a href="${mailto}" style="color:#4a3570;text-decoration:underline;overflow-wrap:anywhere;word-break:break-word;">${email}</a></p>
            </td></tr>
            <tr><td class="content-pad" style="padding:0 40px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f2f7" style="width:100%;table-layout:fixed;background-color:#f4f2f7;border-radius:8px;">
                <tr><td style="padding:18px 20px;border-left:3px solid #7b68a8;overflow-wrap:anywhere;word-wrap:break-word;word-break:break-word;">
                  <p style="margin:0 0 6px;font-size:10px;line-height:17px;letter-spacing:1.5px;font-weight:bold;text-transform:uppercase;color:#5f5a6e;">Area of interest</p>
                  <p style="margin:0;font-size:15px;line-height:24px;font-weight:bold;color:#4a3570;">${escapeHtml(values.area_of_interest || 'Not specified')}</p>
                </td></tr>
              </table>
            </td></tr>
            <tr><td class="content-pad" style="padding:0 40px;"><div style="height:1px;line-height:1px;background-color:#ebe8f1;">&nbsp;</div></td></tr>
            <tr><td class="content-pad" style="padding:28px 40px 32px;overflow-wrap:anywhere;word-wrap:break-word;word-break:break-word;">
              <h2 style="margin:0 0 16px;font-size:11px;line-height:18px;letter-spacing:1.8px;font-weight:bold;text-transform:uppercase;color:#7b68a8;">Message</h2>
              <div style="margin:0;font-size:16px;line-height:28px;color:#3d3950;overflow-wrap:anywhere;word-wrap:break-word;word-break:break-word;">${message}</div>
            </td></tr>
            <tr><td class="content-pad" style="padding:0 40px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
                <tr><td align="center" bgcolor="#4a3570" style="background-color:#4a3570;border-radius:6px;mso-padding-alt:16px 28px;">
                  <a class="reply-button" href="${replyUrl}" style="display:inline-block;padding:16px 28px;border:1px solid #4a3570;border-radius:6px;font-size:14px;line-height:20px;font-weight:bold;color:#ffffff;text-decoration:none;mso-padding-alt:0;">Reply to inquiry &nbsp; &#8594;</a>
                </td></tr>
              </table>
              <p style="margin:16px 0 0;font-size:12px;line-height:20px;color:#5f5a6e;overflow-wrap:anywhere;word-wrap:break-word;word-break:break-word;">You can also reply directly to this email.<br>Your reply will go to ${escapeHtml(name)}.</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:24px 20px 0;">
          <p style="margin:0;font-size:11px;line-height:19px;color:#5f5a6e;">ComplyOn LLC &nbsp;&middot;&nbsp; Website inquiries</p>
          <p style="margin:4px 0 0;font-size:11px;line-height:19px;color:#5f5a6e;">Contains contact information. Please handle with care.</p>
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
</html>`;
}
