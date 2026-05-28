const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || user.startsWith('your_')) {
    return null; // Not configured yet
  }

  const port = parseInt(process.env.SMTP_PORT || '587');
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mail.yahoo.com',
    port,
    secure: port === 465, // SSL for 465, STARTTLS for 587
    auth: { user, pass },
  });

  return transporter;
}

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
const SITE_NAME = 'Neptune Therapy';
const BRAND_COLOR = '#1a5dd8';

// ─── Shared HTML wrapper ──────────────────────────────────────────────────────
function wrap(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND_COLOR};padding:28px 36px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:38px;height:38px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;line-height:38px;text-align:center;">N</div>
              <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">${SITE_NAME}</span>
            </div>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">${title}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 36px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">
              This is an automated notification from ${SITE_NAME}.<br/>
              Log in to your <a href="${process.env.SITE_URL || 'http://localhost:5173'}/admin" style="color:${BRAND_COLOR};text-decoration:none;">admin panel</a> to manage submissions.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function field(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:8px 12px;background:#f8fafc;border-radius:6px;margin-bottom:6px;">
        <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">${label}</span>
        <p style="margin:2px 0 0;font-size:14px;color:#1e293b;font-weight:500;">${value}</p>
      </td>
    </tr>
    <tr><td style="height:6px;"></td></tr>`;
}

// ─── Contact Form Notification ────────────────────────────────────────────────
async function sendContactNotification({ name, email, message }) {
  const t = getTransporter();
  if (!t) return logSkipped('contact notification');

  const body = `
    <h2 style="margin:0 0 6px;font-size:20px;color:#1e293b;">New Contact Message</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:14px;">Someone submitted the contact form on your website.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${field('Name', name)}
      ${field('Email', `<a href="mailto:${email}" style="color:${BRAND_COLOR};text-decoration:none;">${email}</a>`)}
    </table>

    <div style="background:#f8fafc;border-left:4px solid ${BRAND_COLOR};border-radius:0 8px 8px 0;padding:16px;margin:20px 0;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
      <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.7;white-space:pre-wrap;">${message}</p>
    </div>

    <a href="mailto:${email}?subject=Re: Your inquiry to Neptune Therapy"
       style="display:inline-block;background:${BRAND_COLOR};color:#fff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px;text-decoration:none;margin-top:8px;">
      Reply to ${name}
    </a>`;

  await t.sendMail({
    from: `"${SITE_NAME}" <${process.env.SMTP_USER}>`,
    to: NOTIFY_EMAIL,
    subject: `New message from ${name} — ${SITE_NAME}`,
    html: wrap('New Contact Form Submission', body),
  });

  console.log(`✉️  Contact notification sent to ${NOTIFY_EMAIL}`);
}

// ─── Application Notification ─────────────────────────────────────────────────
async function sendApplicationNotification(app) {
  const t = getTransporter();
  if (!t) return logSkipped('application notification');

  const fullName = `${app.first_name} ${app.last_name}`;
  const address = [app.address, app.city, app.state, app.zip].filter(Boolean).join(', ');

  const body = `
    <h2 style="margin:0 0 6px;font-size:20px;color:#1e293b;">New Employment Application</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:14px;">A new application has been submitted for review.</p>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;margin-bottom:24px;display:flex;align-items:center;gap:10px;">
      <span style="font-size:20px;">🩺</span>
      <div>
        <p style="margin:0;font-size:15px;font-weight:700;color:#1e293b;">${fullName}</p>
        <p style="margin:2px 0 0;font-size:13px;color:#92400e;">${app.position}</p>
      </div>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${field('Email', `<a href="mailto:${app.email}" style="color:${BRAND_COLOR};text-decoration:none;">${app.email}</a>`)}
      ${field('Phone', app.phone)}
      ${address ? field('Address', address) : ''}
      ${field('ID Type', app.id_type)}
      ${field('Years of Experience', app.years_experience)}
      ${field('Highest Qualification', app.qualification)}
      ${field('Coverage Area (Zip Codes)', app.coverage_area)}
    </table>

    ${(app.ref1_name || app.ref2_name) ? `
    <h3 style="margin:24px 0 12px;font-size:15px;color:#1e293b;font-weight:700;">References</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${app.ref1_name ? field('Reference 1', `${app.ref1_name} — ${app.ref1_contact || ''}`) : ''}
      ${app.ref2_name ? field('Reference 2', `${app.ref2_name} — ${app.ref2_contact || ''}`) : ''}
    </table>` : ''}

    <div style="display:flex;gap:12px;margin-top:28px;">
      <a href="mailto:${app.email}?subject=Re: Your Neptune Therapy Application"
         style="display:inline-block;background:${BRAND_COLOR};color:#fff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px;text-decoration:none;">
        Contact Applicant
      </a>
      <a href="${process.env.SITE_URL || 'http://localhost:5173'}/admin/applications"
         style="display:inline-block;background:#f1f5f9;color:#1e293b;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px;text-decoration:none;border:1px solid #e2e8f0;">
        View in Admin Panel
      </a>
    </div>`;

  await t.sendMail({
    from: `"${SITE_NAME}" <${process.env.SMTP_USER}>`,
    to: NOTIFY_EMAIL,
    subject: `New application: ${fullName} (${app.position}) — ${SITE_NAME}`,
    html: wrap('New Employment Application', body),
  });

  console.log(`✉️  Application notification sent to ${NOTIFY_EMAIL}`);
}

// ─── Applicant Confirmation ───────────────────────────────────────────────────
async function sendApplicationConfirmation(app) {
  const t = getTransporter();
  if (!t) return logSkipped('application confirmation');

  const fullName = `${app.first_name} ${app.last_name}`;

  const body = `
    <h2 style="margin:0 0 6px;font-size:20px;color:#1e293b;">Thank You, ${app.first_name}!</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.7;">
      We've received your application for the <strong>${app.position}</strong> position at ${SITE_NAME}. Our team will review your details and reach out to you shortly.
    </p>

    <div style="background:#eff8ff;border:1px solid #bfe3fe;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1a5dd8;text-transform:uppercase;letter-spacing:0.05em;">What happens next?</p>
      <ol style="margin:0;padding-left:18px;color:#1e293b;font-size:14px;line-height:1.9;">
        <li>Our team reviews your credentials and experience</li>
        <li>We'll contact you within 2–3 business days</li>
        <li>If selected, we'll schedule an introductory call</li>
        <li>Onboarding and your first patient assignments</li>
      </ol>
    </div>

    <p style="margin:0 0 20px;color:#64748b;font-size:14px;">
      In the meantime, feel free to reach out with any questions at
      <a href="mailto:${NOTIFY_EMAIL}" style="color:${BRAND_COLOR};text-decoration:none;">${NOTIFY_EMAIL}</a>
      or call us at <strong>(346) 630-0084</strong>.
    </p>`;

  await t.sendMail({
    from: `"${SITE_NAME}" <${process.env.SMTP_USER}>`,
    to: app.email,
    subject: `We received your application — ${SITE_NAME}`,
    html: wrap('Application Received', body),
  });

  console.log(`✉️  Confirmation sent to ${app.email}`);
}

function logSkipped(type) {
  console.log(`⚠️  Email skipped (${type}): SMTP not configured. Set SMTP_USER and SMTP_PASS in .env`);
}

module.exports = {
  sendContactNotification,
  sendApplicationNotification,
  sendApplicationConfirmation,
};
