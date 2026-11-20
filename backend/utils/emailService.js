const nodemailer = require('nodemailer');

/**
 * Creates and returns configured Nodemailer transporter
 * Outgoing SMTP: Enterprise SSL Gateway (Port 465 SSL)
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
 * Sends an enterprise-grade, hardcore responsive, dark/light mode compatible
 * pharmaceutical welcome & credentials email.
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
    const fromAddress = process.env.EMAIL_FROM || '"Niyansh Pharma" <info@niyanshpharma.com>';
    const loginUrl = 'https://niyanshpharma.com/admin';
    const logoUrl = 'https://niyanshpharma.com/logo.jpg';
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
      <tr class="perm-row" style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 12px;vertical-align:top;" width="26">
          <span style="display:inline-block;width:18px;height:18px;line-height:18px;text-align:center;background:#dcfce7;color:#15803d;border-radius:50%;font-size:11px;font-weight:bold;">✓</span>
        </td>
        <td style="padding:10px 12px 10px 2px;">
          <div class="perm-title" style="font-size:13px;font-weight:700;color:#0f172a;">${b.title}</div>
          <div class="perm-desc" style="font-size:11.5px;color:#64748b;margin-top:2px;line-height:1.4;">${b.desc}</div>
        </td>
      </tr>
    `).join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <title>${emailSubject}</title>
  
  <style type="text/css">
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    
    /* Global Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; }

    /* Base Styling Defaults (Light Mode) */
    .bg-body { background-color: #f1f5f9; }
    .email-card { background-color: #ffffff; border-color: #e2e8f0; }
    .email-content { background-color: #ffffff; }
    .text-heading { color: #0f172a; }
    .text-body { color: #334155; }
    .text-muted { color: #64748b; }
    .credentials-card { background-color: #f8fafc; border-color: #cbd5e1; }
    .cred-value-box { background-color: #ffffff; border-color: #e2e8f0; color: #0f172a; }
    .password-box { background-color: #fef3c7; border-color: #f59e0b; color: #0f172a; }
    .permissions-table { background-color: #f8fafc; border-color: #e2e8f0; }
    .perm-row { border-bottom-color: #f1f5f9; }
    .perm-title { color: #0f172a; }
    .perm-desc { color: #64748b; }
    .advisory-box { background-color: #fffbeb; border-color: #f59e0b; }
    .advisory-title { color: #92400e; }
    .advisory-text { color: #78350f; }
    .email-footer { background-color: #f8fafc; border-top-color: #e2e8f0; }
    .footer-title { color: #0f172a; }
    .footer-sub { color: #475569; }
    .footer-contact { color: #334155; }
    .footer-link { color: #0c3d6c; }
    .footer-legal { color: #94a3b8; border-top-color: #e2e8f0; }

    /* HARDCORE RESPONSIVE MOBILE STYLES (Screen widths 600px and below) */
    @media only screen and (max-width: 600px) {
      .container-table { width: 100% !important; max-width: 100% !important; }
      .mobile-pad { padding: 22px 14px 20px !important; }
      .mobile-header-pad { padding: 26px 14px 22px !important; }
      .mobile-footer-pad { padding: 20px 14px !important; }
      
      /* Stacking Credential Columns on narrow screens */
      .cred-row { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .cred-col-label { display: block !important; width: 100% !important; box-sizing: border-box !important; padding-right: 0 !important; padding-bottom: 4px !important; }
      .cred-col-value { display: block !important; width: 100% !important; box-sizing: border-box !important; padding-left: 0 !important; margin-bottom: 14px !important; }
      
      /* Ensure full width and word-wrapping for emails on narrow screens */
      .cred-value-box { display: block !important; width: 100% !important; box-sizing: border-box !important; font-size: 13.5px !important; padding: 10px 12px !important; word-break: break-all !important; }
      .password-box { display: inline-block !important; max-width: 100% !important; font-size: 15px !important; padding: 8px 12px !important; box-sizing: border-box !important; word-break: break-all !important; }
      
      /* Mobile Full-Width Action Button */
      .btn-container { width: 100% !important; max-width: 100% !important; }
      .mobile-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; padding: 14px 16px !important; font-size: 14px !important; }
      
      /* Typography Scaling */
      .mobile-h1 { font-size: 18px !important; }
      .mobile-h2 { font-size: 17px !important; line-height: 1.35 !important; }
      .mobile-logo { max-width: 110px !important; height: auto !important; }
      .mobile-tagline { font-size: 10px !important; letter-spacing: 1px !important; }
    }

    /* DARK MODE STYLES (iOS Mail, Apple Mail, Android Gmail, Modern Webmail) */
    @media (prefers-color-scheme: dark) {
      body, .bg-body {
        background-color: #0b0f19 !important;
        color: #e2e8f0 !important;
      }
      .email-card {
        background-color: #111827 !important;
        border-color: #1f2937 !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
      }
      .email-content {
        background-color: #111827 !important;
      }
      .text-heading {
        color: #f8fafc !important;
      }
      .text-body {
        color: #cbd5e1 !important;
      }
      .text-muted {
        color: #94a3b8 !important;
      }
      .credentials-card {
        background-color: #1e293b !important;
        border-color: #334155 !important;
      }
      .cred-value-box {
        background-color: #0f172a !important;
        border-color: #334155 !important;
        color: #f1f5f9 !important;
      }
      .password-box {
        background-color: #291804 !important;
        border-color: #d97706 !important;
        color: #fef08a !important;
      }
      .permissions-table {
        background-color: #1e293b !important;
        border-color: #334155 !important;
      }
      .perm-row {
        border-bottom-color: #334155 !important;
      }
      .perm-title {
        color: #f1f5f9 !important;
      }
      .perm-desc {
        color: #94a3b8 !important;
      }
      .advisory-box {
        background-color: #1c1917 !important;
        border-left-color: #d97706 !important;
      }
      .advisory-title {
        color: #fef08a !important;
      }
      .advisory-text {
        color: #fde68a !important;
      }
      .email-footer {
        background-color: #090d16 !important;
        border-top-color: #1f2937 !important;
      }
      .footer-title {
        color: #f1f5f9 !important;
      }
      .footer-sub {
        color: #94a3b8 !important;
      }
      .footer-contact {
        color: #cbd5e1 !important;
      }
      .footer-link {
        color: #60a5fa !important;
      }
      .footer-legal {
        color: #64748b !important;
        border-top-color: #1f2937 !important;
      }
    }

    /* OUTLOOK & OFFICE 365 DARK MODE SELECTORS */
    [data-ogsc] body, [data-ogsc] .bg-body { background-color: #0b0f19 !important; }
    [data-ogsc] .email-card { background-color: #111827 !important; }
    [data-ogsc] .email-content { background-color: #111827 !important; }
    [data-ogsc] .text-heading { color: #f8fafc !important; }
    [data-ogsc] .text-body { color: #cbd5e1 !important; }
    [data-ogsc] .credentials-card { background-color: #1e293b !important; }
    [data-ogsc] .cred-value-box { background-color: #0f172a !important; color: #f1f5f9 !important; }
    [data-ogsc] .password-box { background-color: #291804 !important; color: #fef08a !important; }
    [data-ogsc] .permissions-table { background-color: #1e293b !important; }
    [data-ogsc] .perm-title { color: #f1f5f9 !important; }
    [data-ogsc] .advisory-box { background-color: #1c1917 !important; }
    [data-ogsc] .email-footer { background-color: #090d16 !important; }
    [data-ogsc] .footer-title { color: #f1f5f9 !important; }
    [data-ogsc] .footer-link { color: #60a5fa !important; }
  </style>
</head>
<body class="bg-body" style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#1e293b;">
  
  <!-- Pre-header Teaser Text (Hidden) -->
  <div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    Official Administrative Access Provisioning for ${name} at Niyansh Pharma Wholesale Enterprise B2B Hub. Confidential security credentials enclosed.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="bg-body" style="background-color:#f1f5f9;padding:24px 8px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container (Responsive 600px max) -->
        <table role="presentation" width="100%" class="container-table email-card" style="max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);border:1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Top Corporate Pharma Header -->
          <tr>
            <td class="mobile-header-pad" style="background:linear-gradient(135deg, #071e3d 0%, #0c3d6c 60%, #1e40af 100%);padding:32px 28px 26px;text-align:center;">
              
              <!-- Unique Official Logo Card Lockup -->
              <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 14px;">
                <tr>
                  <td align="center" style="background:#ffffff;padding:8px 16px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.22);border:1px solid rgba(255,255,255,0.4);">
                    <img 
                      src="${logoUrl}" 
                      alt="Niyansh Pharma" 
                      width="130" 
                      class="mobile-logo"
                      style="display:block;max-width:130px;height:auto;object-fit:contain;border:0;outline:none;" 
                    />
                  </td>
                </tr>
              </table>

              <!-- Tagline -->
              <div class="mobile-tagline" style="color:#93c5fd;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;margin-top:6px;line-height:1.4;">
                Wholesale Pharmaceutical Distribution &amp; Supply Chain Hub
              </div>
              
              <!-- Security Badge -->
              <div style="margin-top:12px;display:inline-block;background:rgba(255,255,255,0.12);padding:4px 14px;border-radius:20px;color:#e0f2fe;font-size:10.5px;font-weight:600;letter-spacing:0.5px;border:1px solid rgba(255,255,255,0.2);">
                SECURE ADMINISTRATIVE PROVISIONING • GxP COMPLIANT
              </div>
            </td>
          </tr>

          <!-- Letter Body Content -->
          <tr>
            <td class="email-content mobile-pad" style="padding:32px 32px 26px;background-color:#ffffff;">

              <!-- Ref & Date Bar -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:20px;border-bottom:1px solid #f1f5f9;padding-bottom:12px;">
                <tr>
                  <td class="text-muted" style="font-size:11.5px;color:#64748b;font-weight:600;">
                    REF: <span class="text-heading" style="color:#0f172a;font-family:monospace;font-weight:700;">NP-AUTH-${Math.random().toString(36).substring(2, 7).toUpperCase()}</span>
                  </td>
                  <td align="right" class="text-muted" style="font-size:11.5px;color:#64748b;font-weight:600;">
                    Date: <span class="text-heading" style="color:#0f172a;font-weight:700;">${currentDate}</span>
                  </td>
                </tr>
              </table>

              <!-- Formal Salutation -->
              <h2 class="text-heading mobile-h2" style="color:#0f172a;font-size:19px;margin:0 0 12px;font-weight:800;letter-spacing:-0.2px;">
                Dear ${name},
              </h2>

              <p class="text-body" style="color:#334155;font-size:13.5px;line-height:1.65;margin:0 0 14px;">
                ${isUpdate
                  ? 'Your administrative security credentials and operational access privileges for the <strong>Niyansh Pharma Wholesale Enterprise Portal</strong> have been refreshed by system governance.'
                  : 'We are pleased to welcome you to the <strong>Niyansh Pharma</strong> administrative operations team. Your staff management account has been officially provisioned on our enterprise B2B pharmaceutical distribution system.'}
              </p>

              <p class="text-muted" style="color:#475569;font-size:13px;line-height:1.6;margin:0 0 22px;">
                As an authorized staff member, you have direct administrative access to oversee medicine stock, track retailer consignments, interface with Prompt ERP billing data, and ensure smooth wholesale fulfillment across Gujarat.
              </p>

              <!-- High-Security Credentials Card (Hardcore Responsive Stacked Layout) -->
              <table role="presentation" width="100%" class="credentials-card" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:12px;margin:22px 0 26px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.02);">
                <tr>
                  <td style="background:#0f172a;padding:12px 18px;border-bottom:2px solid #059669;">
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="color:#ffffff;font-size:11.5px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">
                          🔒 Official Staff Login Credentials
                        </td>
                        <td align="right">
                          <span style="display:inline-block;background:${roleTagBg};color:${roleTagColor};font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:12px;letter-spacing:0.3px;">
                            ${roleTitle}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 18px 16px;">
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      
                      <!-- Username / Email Row -->
                      <tr class="cred-row">
                        <td class="cred-col-label" style="padding-bottom:12px;vertical-align:middle;" width="38%">
                          <div class="text-muted" style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Authorized Login ID</div>
                          <div class="text-muted" style="font-size:11px;color:#94a3b8;margin-top:2px;">(Registered Work Email)</div>
                        </td>
                        <td class="cred-col-value" style="padding-bottom:12px;vertical-align:middle;" width="62%">
                          <div class="cred-value-box" style="font-size:14px;color:#0f172a;font-weight:700;font-family:SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;word-break:break-all;background:#ffffff;padding:8px 12px;border-radius:6px;border:1px solid #e2e8f0;box-sizing:border-box;">
                            ${to}
                          </div>
                        </td>
                      </tr>

                      <!-- Password Row -->
                      <tr class="cred-row">
                        <td class="cred-col-label" style="padding-top:4px;vertical-align:middle;" width="38%">
                          <div class="text-muted" style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Assigned Access Password</div>
                          <div class="text-muted" style="font-size:11px;color:#94a3b8;margin-top:2px;">(Case-Sensitive)</div>
                        </td>
                        <td class="cred-col-value" style="padding-top:4px;vertical-align:middle;" width="62%">
                          <div class="password-box" style="display:inline-block;font-size:15.5px;color:#0f172a;font-weight:800;font-family:SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;letter-spacing:1.5px;background:#fef3c7;border:1.5px dashed #f59e0b;padding:8px 14px;border-radius:6px;box-sizing:border-box;word-break:break-all;">
                            ${password}
                          </div>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- Big Primary Enterprise CTA Button (Responsive Full Width on Mobile) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="btn-container" style="margin:0 auto;">
                      <tr>
                        <td align="center" style="background:linear-gradient(135deg, #071e3d 0%, #0c3d6c 100%);border-radius:8px;box-shadow:0 4px 14px rgba(12,61,108,0.35);">
                          <a href="${loginUrl}" target="_blank" class="mobile-btn" style="display:inline-block;padding:15px 36px;font-size:14px;font-weight:800;color:#ffffff;text-decoration:none;letter-spacing:0.8px;text-transform:uppercase;border-radius:8px;font-family:Arial,Helvetica,sans-serif;">
                            Secure Sign In to Admin Console &nbsp;→
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div class="text-muted" style="font-size:11.5px;color:#94a3b8;margin-top:10px;">
                      Click the button above to launch your administrative console securely.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Operational Scope Section -->
              <div style="margin:26px 0 22px;border-top:1px solid #f1f5f9;padding-top:20px;">
                <div class="text-heading" style="font-size:12px;font-weight:800;color:#334155;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px;">
                  📋 Your Operational Scope &amp; Granted Permissions:
                </div>
                
                <table role="presentation" width="100%" class="permissions-table" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                  ${permissionsHtml}
                </table>
              </div>

              <!-- Enterprise GxP & Security Protocol Advisory -->
              <table role="presentation" width="100%" class="advisory-box" cellspacing="0" cellpadding="0" border="0" style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:6px;margin:24px 0 10px;padding:14px 16px;">
                <tr>
                  <td style="vertical-align:top;padding-right:10px;" width="22">
                    <span style="font-size:18px;">🛡️</span>
                  </td>
                  <td>
                    <div class="advisory-title" style="font-size:12px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
                      Data Governance &amp; Security Compliance
                    </div>
                    <ul class="advisory-text" style="margin:4px 0 0;padding-left:16px;font-size:11.5px;color:#78350f;line-height:1.55;">
                      <li><strong>Confidentiality Mandate:</strong> Do not share, forward, or record these credentials on unsecured devices. Niyansh Pharma IT and senior management will never ask for your password.</li>
                      <li><strong>Password Security:</strong> We strongly advise updating your password immediately after your initial sign-in via <em>Profile Settings</em> in the top-left menu.</li>
                      <li><strong>Audit Logging:</strong> All administrative activities, inventory adjustments, and status changes are permanently logged with timestamp and IP address for drug regulatory and audit compliance.</li>
                    </ul>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Formal Corporate Footer (100% White-Labeled, Zero Third-Party Mentions) -->
          <tr>
            <td class="email-footer mobile-footer-pad" style="background-color:#f8fafc;padding:24px 28px;border-top:1px solid #e2e8f0;text-align:center;">
              
              <!-- Company Legal Info -->
              <div class="footer-title" style="font-size:13px;font-weight:800;color:#0f172a;letter-spacing:0.3px;">
                NIYANSH PHARMA
              </div>
              <div class="footer-sub" style="font-size:11.5px;color:#475569;margin-top:3px;line-height:1.5;">
                Authorized Wholesale Pharmaceutical Distributor &amp; Supply Chain Partner<br />
                Block no. 52B, Panchayat Nagar-3, Ram Park Main Road, University Rd, Rajkot, Gujarat - 360005.
              </div>

              <!-- Support Desk (Primary requested number: +91 99099 23130) -->
              <div class="footer-contact" style="margin:14px 0 12px;font-size:12px;color:#334155;">
                <strong>Administrative Helpdesk:</strong> 
                <a href="tel:+919909923130" class="footer-link" style="color:#0c3d6c;text-decoration:none;font-weight:700;">+91 99099 23130</a> &nbsp;|&nbsp; 
                <a href="mailto:info@niyanshpharma.com" class="footer-link" style="color:#0c3d6c;text-decoration:none;font-weight:700;">info@niyanshpharma.com</a>
              </div>

              <!-- Regulatory & Gateway Notice (Zero Vendor Names) -->
              <div class="footer-legal" style="font-size:10.5px;color:#94a3b8;line-height:1.5;margin-top:14px;border-top:1px solid #e2e8f0;padding-top:12px;">
                CONFIDENTIALITY NOTICE: This transmission is intended solely for the authorized administrative personnel named above. It contains confidential, proprietary, and legally privileged pharmaceutical trade information. If you have received this transmission in error, please immediately notify info@niyanshpharma.com and permanently delete all records.<br />
                Dispatched securely via Niyansh Pharma Enterprise Distribution Gateway • 256-Bit SSL Encrypted Transmission.
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
