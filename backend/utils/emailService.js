const nodemailer = require('nodemailer');

/**
 * Creates and returns configured Nodemailer transporter
 * Outgoing SMTP: GoDaddy SecureServer Gateway (smtpout.secureserver.net:465 SSL)
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtpout.secureserver.net';
  const port = Number(process.env.SMTP_PORT) || 465;
  const isSecure = process.env.SMTP_SECURE !== 'false' && (port === 465 || port === 993);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || 'info@niyanshpharma.com';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || '@Neeya232026';

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
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
  });
}

/**
 * Formats permission keys into professional pharmaceutical operations badges
 */
function formatPermissions(perms = {}) {
  const badges = [];
  if (perms.canManageProducts) badges.push({ title: 'Medicine Catalog & Inventory', desc: 'Add, update & monitor wholesale SKUs' });
  if (perms.canBulkImport) badges.push({ title: 'Prompt ERP Desktop Sync', desc: 'Sync live stock, rates & batches' });
  if (perms.canManageOrders) badges.push({ title: 'B2B Consignments & Dispatch', desc: 'Process orders, verify packing & dispatch' });
  if (perms.canManageCompanies) badges.push({ title: 'Pharma Company Masters', desc: 'Manage manufacturer brands & divisions' });
  if (perms.canManageNews) badges.push({ title: 'Trade Schemes & Price Offers', desc: 'Publish retailer promotional bulletins' });
  if (perms.canManageEnquiries) badges.push({ title: 'Chemist Inquiries & Leads', desc: 'Review & resolve chemist quotes' });
  if (perms.canManageLedgers) badges.push({ title: 'Retailer Ledger & Credit Dues', desc: 'Access outstanding balances & receipts' });
  if (perms.canDeleteProducts) badges.push({ title: 'Catalog Deletion Rights', desc: 'Authorized to archive obsolete drugs' });
  if (perms.canClearDatabase) badges.push({ title: 'System Database Governance', desc: 'Root database reset & maintenance' });
  
  if (badges.length === 0) {
    badges.push({ title: 'Standard Admin Access', desc: 'General wholesale operations dashboard' });
  }
  return badges;
}

/**
 * Sends an enterprise-grade, high-polish pharmaceutical welcome & credentials email
 * Dispatched from info@niyanshpharma.com via verified GoDaddy SMTP Gateway
 * 
 * @param {Object} options
 * @param {string} options.to - Recipient email (e.g. haripatel267998@gmail.com)
 * @param {string} options.name - Admin's full name (e.g. Hari Patel)
 * @param {string} options.password - Plaintext password
 * @param {Object} [options.permissions] - Granular permissions object
 * @param {string} [options.role] - 'admin' or 'superadmin'
 * @param {boolean} [options.isUpdate] - True if credentials resent or profile updated
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
    const fromAddress = process.env.EMAIL_FROM || '"Niyansh Pharma - Operations Desk" <info@niyanshpharma.com>';
    const loginUrl = 'https://niyanshpharma.com/admin';
    const badges = formatPermissions(permissions);
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const isSuper = role === 'superadmin';
    const roleTitle = isSuper ? 'Root Super Administrator' : 'Operations Administrator';
    const roleTagBg = isSuper ? '#fef3c7' : '#e0f2fe';
    const roleTagColor = isSuper ? '#92400e' : '#0369a1';

    const emailSubject = isUpdate
      ? `[SECURITY NOTICE] Updated Login Credentials — Niyansh Pharma B2B Portal (${name})`
      : `Official Welcome & Portal Access Provisioning — Niyansh Pharma (${name})`;

    const permissionsHtml = badges.map(b => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;vertical-align:top;" width="28">
          <span style="display:inline-block;width:20px;height:20px;line-height:20px;text-align:center;background:#dcfce7;color:#15803d;border-radius:50%;font-size:12px;font-weight:bold;">✓</span>
        </td>
        <td style="padding:10px 14px 10px 4px;border-bottom:1px solid #f1f5f9;">
          <div style="font-size:13.5px;font-weight:700;color:#0f172a;">${b.title}</div>
          <div style="font-size:11.5px;color:#64748b;margin-top:2px;">${b.desc}</div>
        </td>
      </tr>
    `).join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${emailSubject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#1e293b;">
  
  <!-- Pre-header Teaser Text (Hidden) -->
  <div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Official Administrative Access Provisioning for ${name} at Niyansh Pharma Wholesale B2B Distribution Hub. Confidential security credentials enclosed.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;padding:36px 12px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width:620px;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);border:1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Top Corporate Pharma Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #071e3d 0%, #0c3d6c 60%, #1e40af 100%);padding:36px 32px 30px;text-align:center;">
              
              <!-- Emblem & Brand -->
              <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:12px;">
                <tr>
                  <td style="background:#ffffff;padding:8px 16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
                    <span style="font-size:20px;font-weight:900;letter-spacing:1.5px;color:#0c3d6c;font-family:Arial,Helvetica,sans-serif;">
                      NIYANSH <span style="color:#059669;">PHARMA</span>
                    </span>
                  </td>
                </tr>
              </table>

              <div style="color:#93c5fd;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;margin-top:8px;">
                Wholesale Pharmaceutical Distribution &amp; Healthcare Supply Chain
              </div>
              <div style="margin-top:14px;display:inline-block;background:rgba(255,255,255,0.12);padding:5px 14px;border-radius:20px;color:#e0f2fe;font-size:11px;font-weight:600;letter-spacing:0.5px;border:1px solid rgba(255,255,255,0.2);">
                SECURE ADMINISTRATIVE PROVISIONING • GxP COMPLIANT
              </div>
            </td>
          </tr>

          <!-- Letter Body Content -->
          <tr>
            <td style="padding:36px 36px 28px;">

              <!-- Ref & Date Bar -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;border-bottom:1px solid #f1f5f9;padding-bottom:14px;">
                <tr>
                  <td style="font-size:12px;color:#64748b;font-weight:600;">
                    REF: <span style="color:#0f172a;font-family:monospace;">NP-AUTH-${Math.random().toString(36).substring(2, 7).toUpperCase()}</span>
                  </td>
                  <td align="right" style="font-size:12px;color:#64748b;font-weight:600;">
                    Date: <span style="color:#0f172a;">${currentDate}</span>
                  </td>
                </tr>
              </table>

              <!-- Formal Salutation -->
              <h2 style="color:#0f172a;font-size:20px;margin:0 0 14px;font-weight:800;letter-spacing:-0.2px;">
                Dear ${name},
              </h2>

              <p style="color:#334155;font-size:14px;line-height:1.65;margin:0 0 16px;">
                ${isUpdate
                  ? 'Your administrative security credentials and operational access privileges for the <strong>Niyansh Pharma Wholesale Enterprise Portal</strong> have been refreshed by system governance.'
                  : 'We are pleased to welcome you to the <strong>Niyansh Pharma</strong> administrative operations team. Your staff management account has been officially provisioned on our enterprise B2B pharmaceutical distribution system.'}
              </p>

              <p style="color:#475569;font-size:13.5px;line-height:1.6;margin:0 0 24px;">
                As an authorized staff member, you have direct administrative access to oversee medicine stock, track retailer consignments, interface with Prompt ERP billing data, and ensure smooth wholesale fulfillment across Gujarat.
              </p>

              <!-- High-Security Credentials Card (NO RAW URL ROW!) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:12px;margin:24px 0 28px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.02);">
                <tr>
                  <td style="background:#0f172a;padding:12px 20px;border-bottom:2px solid #059669;">
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="color:#ffffff;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">
                          🔒 Official Staff Login Credentials
                        </td>
                        <td align="right">
                          <span style="display:inline-block;background:${roleTagBg};color:${roleTagColor};font-size:11px;font-weight:700;padding:3px 10px;border-radius:12px;letter-spacing:0.3px;">
                            ${roleTitle}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:22px 22px 20px;">
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      
                      <!-- Username / Email Row -->
                      <tr>
                        <td style="padding-bottom:14px;" width="38%">
                          <div style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Authorized Login ID</div>
                          <div style="font-size:11px;color:#94a3b8;margin-top:2px;">(Registered Work Email)</div>
                        </td>
                        <td style="padding-bottom:14px;" width="62%">
                          <div style="font-size:15px;color:#0f172a;font-weight:700;font-family:SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;word-break:break-all;background:#ffffff;padding:8px 12px;border-radius:6px;border:1px solid #e2e8f0;">
                            ${to}
                          </div>
                        </td>
                      </tr>

                      <!-- Password Row -->
                      <tr>
                        <td style="padding-top:4px;">
                          <div style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Assigned Access Password</div>
                          <div style="font-size:11px;color:#94a3b8;margin-top:2px;">(Case-Sensitive)</div>
                        </td>
                        <td style="padding-top:4px;">
                          <div style="display:inline-block;font-size:16px;color:#0f172a;font-weight:800;font-family:SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;letter-spacing:1.5px;background:#fef3c7;border:1.5px dashed #f59e0b;padding:8px 14px;border-radius:6px;">
                            ${password}
                          </div>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- Big Primary Enterprise CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:26px 0 32px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="background:linear-gradient(135deg, #071e3d 0%, #0c3d6c 100%);border-radius:8px;box-shadow:0 4px 14px rgba(12,61,108,0.35);">
                          <a href="${loginUrl}" target="_blank" style="display:inline-block;padding:15px 38px;font-size:14.5px;font-weight:800;color:#ffffff;text-decoration:none;letter-spacing:0.8px;text-transform:uppercase;border-radius:8px;font-family:Arial,Helvetica,sans-serif;">
                            Secure Sign In to Admin Console &nbsp;→
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="font-size:11.5px;color:#94a3b8;margin-top:10px;">
                      Click the button above to launch your administrative console securely.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Operational Scope Section -->
              <div style="margin:28px 0 24px;border-top:1px solid #f1f5f9;padding-top:22px;">
                <div style="font-size:12px;font-weight:800;color:#334155;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px;">
                  📋 Your Operational Scope &amp; Granted Permissions:
                </div>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                  ${permissionsHtml}
                </table>
              </div>

              <!-- Enterprise GxP & Security Protocol Advisory -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:6px;margin:26px 0 10px;padding:16px 18px;">
                <tr>
                  <td style="vertical-align:top;padding-right:12px;" width="22">
                    <span style="font-size:18px;">🛡️</span>
                  </td>
                  <td>
                    <div style="font-size:12.5px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
                      Data Governance &amp; Security Compliance
                    </div>
                    <ul style="margin:4px 0 0;padding-left:16px;font-size:12px;color:#78350f;line-height:1.55;">
                      <li><strong>Confidentiality Mandate:</strong> Do not share, forward, or record these credentials on unsecured devices. Niyansh Pharma IT and senior management will never ask for your password.</li>
                      <li><strong>Password Security:</strong> We strongly advise updating your password immediately after your initial sign-in via <em>Profile Settings</em> in the top-left menu.</li>
                      <li><strong>Audit Logging:</strong> All administrative activities, inventory adjustments, and status changes are permanently logged with timestamp and IP address for drug regulatory and audit compliance.</li>
                    </ul>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Formal Corporate Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:26px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              
              <!-- Company Legal Info -->
              <div style="font-size:13px;font-weight:800;color:#0f172a;letter-spacing:0.3px;">
                NIYANSH PHARMA
              </div>
              <div style="font-size:11.5px;color:#475569;margin-top:3px;line-height:1.5;">
                Authorized Wholesale Pharmaceutical Distributor &amp; Supply Chain Partner<br />
                Block no. 52B, Panchayat Nagar-3, Ram Park Main Road, University Rd, Rajkot, Gujarat - 360005.
              </div>

              <!-- Support Desk -->
              <div style="margin:14px 0 12px;font-size:12px;color:#334155;">
                <strong>Administrative Helpdesk:</strong> 
                <a href="tel:+919316566894" style="color:#0c3d6c;text-decoration:none;font-weight:700;">+91 9316566894</a> &nbsp;|&nbsp; 
                <a href="mailto:info@niyanshpharma.com" style="color:#0c3d6c;text-decoration:none;font-weight:700;">info@niyanshpharma.com</a>
              </div>

              <!-- Regulatory & Gateway Notice -->
              <div style="font-size:10.5px;color:#94a3b8;line-height:1.5;margin-top:14px;border-top:1px solid #e2e8f0;padding-top:12px;">
                CONFIDENTIALITY NOTICE: This transmission is intended solely for the authorized administrative personnel named above. It contains confidential, proprietary, and legally privileged pharmaceutical trade information. If you have received this transmission in error, please immediately notify info@niyanshpharma.com and permanently delete all records.<br />
                Dispatched securely via verified GoDaddy Outbound Gateway (smtpout.secureserver.net).
              </div>

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
