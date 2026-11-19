const nodemailer = require('nodemailer');

/**
 * Creates and returns configured Nodemailer transporter
 * Defaults to GoDaddy Titan Email (smtp.titan.email:465)
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.titan.email';
  const port = Number(process.env.SMTP_PORT) || 465;
  const isSecure = process.env.SMTP_SECURE !== 'false' && (port === 465 || port === 993);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || 'info@niyanshpharma.com';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || '';

  if (!pass) {
    console.warn('[EmailService] SMTP_PASS not set. Email will not be dispatched to external SMTP.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
}

/**
 * Formats permission keys into human-friendly badge labels
 */
function formatPermissions(perms = {}) {
  const labels = [];
  if (perms.canManageProducts) labels.push('Catalog Management');
  if (perms.canBulkImport) labels.push('Prompt ERP Sync');
  if (perms.canManageOrders) labels.push('B2B Order Dispatch');
  if (perms.canManageCompanies) labels.push('Manufacturer Masters');
  if (perms.canManageNews) labels.push('Schemes & Offers');
  if (perms.canManageEnquiries) labels.push('Chemist Enquiries');
  if (perms.canManageLedgers) labels.push('Ledgers & Credit Dues');
  if (perms.canDeleteProducts) labels.push('Delete Products');
  if (perms.canClearDatabase) labels.push('Database Reset');
  return labels.length > 0 ? labels : ['Standard Admin Access'];
}

/**
 * Sends a high-polish, professional welcome & credentials email to newly created or updated admin
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Admin's full name
 * @param {string} options.password - Plaintext password
 * @param {Object} [options.permissions] - Granular permissions
 * @param {string} [options.role] - 'admin' or 'superadmin'
 * @param {boolean} [options.isUpdate] - True if credentials resent or updated
 */
async function sendAdminWelcomeEmail({
  to,
  name,
  password,
  permissions = {},
  role = 'admin',
  isUpdate = false
}) {
  try {
    const transporter = getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Niyansh Pharma Wholesale" <info@niyanshpharma.com>';
    const loginUrl = 'https://niyanshpharma.com/admin';
    const permissionBadges = formatPermissions(permissions)
      .map(
        p => `<span style="display:inline-block;background-color:#e0f2fe;color:#0369a1;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;margin:3px 4px 3px 0;">✓ ${p}</span>`
      )
      .join(' ');

    const emailSubject = isUpdate
      ? `Updated Login Credentials: Your Niyansh Pharma Admin Access - [${name}]`
      : `Welcome to Niyansh Pharma: Official Admin Staff Credentials - [${name}]`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${emailSubject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;padding:30px 15px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table role="presentation" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #0c3d6c 0%, #1e40af 100%);padding:28px 24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;letter-spacing:1px;">NIYANSH PHARMA</h1>
              <p style="color:#93c5fd;margin:6px 0 0;font-size:13px;letter-spacing:0.5px;text-transform:uppercase;font-weight:600;">Wholesale Pharmaceutical Operations</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:32px 28px;">
              <h2 style="color:#0f172a;font-size:19px;margin:0 0 12px;font-weight:700;">
                ${isUpdate ? 'Admin Credentials Re-issued' : 'Welcome to the Admin Team,'} ${name}!
              </h2>
              <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 20px;">
                Your authorized staff profile has been ${isUpdate ? 'updated' : 'configured'} on the <strong>Niyansh Pharma B2B Portal</strong>. You can now securely log in to access your administrative workspace.
              </p>

              <!-- Credentials Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;margin:20px 0 24px;overflow:hidden;">
                <tr>
                  <td style="background-color:#e2e8f0;padding:10px 18px;font-size:12px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.5px;">
                    🔐 Official Staff Login Credentials
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 20px;">
                    <table width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size:14px;">
                      <tr>
                        <td width="35%" style="color:#64748b;font-weight:600;">Portal Web URL:</td>
                        <td width="65%"><a href="${loginUrl}" target="_blank" style="color:#2563eb;font-weight:700;text-decoration:none;">niyanshpharma.com/admin</a></td>
                      </tr>
                      <tr>
                        <td style="color:#64748b;font-weight:600;">Login Username:</td>
                        <td style="color:#0f172a;font-weight:700;font-family:monospace;font-size:15px;">${to}</td>
                      </tr>
                      <tr>
                        <td style="color:#64748b;font-weight:600;">Temporary Password:</td>
                        <td style="color:#0f172a;font-weight:800;font-family:monospace;font-size:16px;background-color:#fef3c7;padding:3px 8px;border-radius:4px;display:inline-block;letter-spacing:1px;">${password}</td>
                      </tr>
                      <tr>
                        <td style="color:#64748b;font-weight:600;">Assigned Role:</td>
                        <td style="color:#15803d;font-weight:700;text-transform:capitalize;">${role === 'superadmin' ? 'Root Super Admin' : 'Staff Admin'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Permissions Section -->
              <div style="margin:20px 0 24px;">
                <div style="font-size:13px;font-weight:700;color:#475569;margin-bottom:8px;text-transform:uppercase;">
                  Assigned Operational Permissions:
                </div>
                <div>${permissionBadges}</div>
              </div>

              <!-- Action Button -->
              <div style="text-align:center;margin:30px 0 24px;">
                <a href="${loginUrl}" target="_blank" style="display:inline-block;background-color:#0c3d6c;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:12px 32px;border-radius:8px;box-shadow:0 3px 8px rgba(12,61,108,0.25);">
                  Login to Admin Console →
                </a>
              </div>

              <!-- Security Advice -->
              <div style="background-color:#fffbeb;border-left:4px solid:#f59e0b;padding:12px 14px;border-radius:4px;margin-top:20px;">
                <p style="margin:0;font-size:12px;color:#92400e;line-height:1.5;">
                  <strong>Security Best Practice:</strong> Please do not forward or share these credentials with anyone. Upon first login, we recommend updating your password via Profile Settings.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 24px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#64748b;">
                Niyansh Pharma Wholesale Operations Support Desk
              </p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Call / WhatsApp: <strong>+91 9316566894</strong> | Email: <strong>info@niyanshpharma.com</strong>
              </p>
              <p style="margin:10px 0 0;font-size:11px;color:#cbd5e1;">
                This is an automated system notification dispatched from Niyansh Pharma Admin Hub.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    if (!transporter) {
      console.log(`[EmailService - MOCK/PENDING] Welcome email prepared for ${to} (${name}) but SMTP_PASS is pending. Password: ${password}`);
      return {
        success: false,
        pendingConfig: true,
        message: 'SMTP credentials pending. Email queued/preview generated.'
      };
    }

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: emailSubject,
      html: htmlContent
    });

    console.log(`[EmailService] Admin welcome email successfully dispatched to ${to}. MessageId: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (err) {
    console.error(`[EmailService] Error dispatching welcome email to ${to}:`, err.message);
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = {
  getTransporter,
  sendAdminWelcomeEmail
};
