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
 * pharmaceutical welcome & credentials email with animated GIF branding.
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
    const gifUrl = 'https://niyanshpharma.com/niyansh.gif';
    const darkLogoUrl = 'https://niyanshpharma.com/logo-dark.png';
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
          <span class="perm-check-badge" style="display:inline-block;width:18px;height:18px;line-height:18px;text-align:center;background:#dcfce7;color:#15803d;border-radius:50%;font-size:11px;font-weight:bold;">✓</span>
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
    
    /* Global Client Resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; }

    /* Light Theme Base Defaults */
    .bg-body { background-color: #f1f5f9; }
    .email-card { background-color: #ffffff; border-color: #e2e8f0; }
    .email-content { background-color: #ffffff; }
    .email-hero-header { background: #071e3d; background: linear-gradient(135deg, #071e3d 0%, #0c3d6c 60%, #1e40af 100%); }
    .text-heading { color: #0f172a; }
    .text-body { color: #334155; }
    .text-muted { color: #64748b; }
    .ref-date-bar { border-bottom-color: #f1f5f9; }
    .credentials-card { background-color: #f8fafc; border-color: #cbd5e1; }
    .cred-card-head { background-color: #0f172a; border-bottom: 2px solid #059669; }
    .cred-value-box { background-color: #ffffff; border-color: #e2e8f0; color: #0f172a; }
    .password-box { background-color: #fef3c7; border-color: #f59e0b; color: #0f172a; }
    .cta-btn-cell { background: #0c3d6c; background: linear-gradient(135deg, #071e3d 0%, #0c3d6c 100%); box-shadow: 0 4px 14px rgba(12,61,108,0.35); }
    .permissions-table { background-color: #f8fafc; border-color: #e2e8f0; }
    .perm-row { border-bottom-color: #f1f5f9; }
    .perm-check-badge { background-color: #dcfce7; color: #15803d; }
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

    /* Logo Visibility Controls */
    .light-logo-wrap { display: block !important; }
    .dark-logo-wrap { display: none !important; mso-hide: all; }

    /* HARDCORE RESPONSIVE MOBILE STYLES (Screen widths 600px and below) */
    @media only screen and (max-width: 600px) {
      .container-table { width: 100% !important; max-width: 100% !important; }
      .mobile-pad { padding: 20px 14px 18px !important; }
      .mobile-header-pad { padding: 22px 14px 18px !important; }
      .mobile-footer-pad { padding: 20px 14px !important; }
      
      /* Mobile Logo GIF / Dark Logo Scaling */
      .mobile-logo-gif { max-width: 170px !important; height: auto !important; }
      .mobile-logo-dark { max-width: 140px !important; height: auto !important; }
      
      /* Stacking Credential Columns on narrow screens (320px - 400px) */
      .cred-row { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .cred-col-label { display: block !important; width: 100% !important; box-sizing: border-box !important; padding-right: 0 !important; padding-bottom: 4px !important; }
      .cred-col-value { display: block !important; width: 100% !important; box-sizing: border-box !important; padding-left: 0 !important; margin-bottom: 12px !important; }
      
      /* Ensure full width and word-wrapping for emails on narrow screens */
      .cred-value-box { display: block !important; width: 100% !important; box-sizing: border-box !important; font-size: 13.5px !important; padding: 10px 12px !important; word-break: break-all !important; }
      .password-box { display: inline-block !important; max-width: 100% !important; font-size: 15px !important; padding: 8px 12px !important; box-sizing: border-box !important; word-break: break-all !important; }
      
      /* Mobile Full-Width Action Button */
      .btn-container { width: 100% !important; max-width: 100% !important; }
      .mobile-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; padding: 14px 16px !important; font-size: 14px !important; }
      
      /* Typography Scaling */
      .mobile-h1 { font-size: 18px !important; }
      .mobile-h2 { font-size: 17px !important; line-height: 1.35 !important; }
      .mobile-tagline { font-size: 10px !important; letter-spacing: 1px !important; }
    }

    /* COMPLETE PHARMA EXECUTIVE DARK THEME (Apple Mail, iOS, Android Gmail, Modern Webmail) */
    @media (prefers-color-scheme: dark) {
      body, .bg-body {
        background-color: #070c16 !important;
        color: #e2e8f0 !important;
      }
      .email-card {
        background-color: #0d1524 !important;
        border-color: #1a273e !important;
        box-shadow: 0 8px 28px rgba(0,0,0,0.6) !important;
      }
      .email-content {
        background-color: #0d1524 !important;
      }
      .email-hero-header {
        background: #060b14 !important;
        border-bottom: 2px solid #059669 !important;
      }
      /* Switch to Dark Mode Logo */
      .light-logo-wrap {
        display: none !important;
      }
      .dark-logo-wrap {
        display: block !important;
        mso-hide: none !important;
      }
      .text-heading {
        color: #ffffff !important;
      }
      .text-body {
        color: #cbd5e1 !important;
      }
      .text-muted {
        color: #94a3b8 !important;
      }
      .ref-date-bar {
        border-bottom-color: #1a273e !important;
      }
      .credentials-card {
        background-color: #121c2e !important;
        border-color: #243550 !important;
      }
      .cred-card-head {
        background-color: #080f1c !important;
        border-bottom: 2px solid #10b981 !important;
      }
      .cred-value-box {
        background-color: #0a111e !important;
        border-color: #243550 !important;
        color: #f8fafc !important;
      }
      .password-box {
        background-color: #261603 !important;
        border: 1.5px dashed #f59e0b !important;
        color: #fbbf24 !important;
        text-shadow: 0 0 10px rgba(245, 158, 11, 0.25) !important;
      }
      .cta-btn-cell {
        background: linear-gradient(135deg, #1d4ed8 0%, #0c3d6c 100%) !important;
        border: 1px solid #3b82f6 !important;
        box-shadow: 0 4px 18px rgba(37,99,235,0.45) !important;
      }
      .permissions-table {
        background-color: #121c2e !important;
        border-color: #243550 !important;
      }
      .perm-row {
        border-bottom-color: #1a273e !important;
      }
      .perm-check-badge {
        background-color: #064e3b !important;
        color: #34d399 !important;
      }
      .perm-title {
        color: #ffffff !important;
      }
      .perm-desc {
        color: #94a3b8 !important;
      }
      .advisory-box {
        background-color: #1f1406 !important;
        border-left: 4px solid #f59e0b !important;
      }
      .advisory-title {
        color: #fbbf24 !important;
      }
      .advisory-text {
        color: #fde68a !important;
      }
      .email-footer {
        background-color: #070b12 !important;
        border-top-color: #1a273e !important;
      }
      .footer-title {
        color: #ffffff !important;
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
        border-top-color: #1a273e !important;
      }
    }

    /* OUTLOOK & OFFICE 365 DARK MODE SELECTORS */
    [data-ogsc] body, [data-ogsc] .bg-body { background-color: #070c16 !important; }
    [data-ogsc] .email-card { background-color: #0d1524 !important; }
    [data-ogsc] .email-content { background-color: #0d1524 !important; }
    [data-ogsc] .email-hero-header { background: #060b14 !important; }
    [data-ogsc] .light-logo-wrap { display: none !important; }
    [data-ogsc] .dark-logo-wrap { display: block !important; }
    [data-ogsc] .text-heading { color: #ffffff !important; }
    [data-ogsc] .text-body { color: #cbd5e1 !important; }
    [data-ogsc] .credentials-card { background-color: #121c2e !important; }
    [data-ogsc] .cred-value-box { background-color: #0a111e !important; color: #f8fafc !important; }
    [data-ogsc] .password-box { background-color: #261603 !important; color: #fbbf24 !important; }
    [data-ogsc] .permissions-table { background-color: #121c2e !important; }
    [data-ogsc] .perm-title { color: #ffffff !important; }
    [data-ogsc] .advisory-box { background-color: #1f1406 !important; }
    [data-ogsc] .email-footer { background-color: #070b12 !important; }
    [data-ogsc] .footer-title { color: #ffffff !important; }
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
          
          <!-- Top Corporate Pharma Header (No Ugly White Patch Box) -->
          <tr>
            <td class="email-hero-header mobile-header-pad" style="background:#071e3d;background:linear-gradient(135deg, #071e3d 0%, #0c3d6c 60%, #1e40af 100%);padding:28px 24px 22px;text-align:center;">
              
              <!-- Light Mode Logo: Animated GIF (Seamless floating animation) -->
              <div class="light-logo-wrap" style="display:block;margin:0 auto 12px;text-align:center;">
                <img 
                  src="${gifUrl}" 
                  alt="Niyansh Pharma" 
                  width="180" 
                  class="mobile-logo-gif"
                  style="display:block;margin:0 auto;max-width:180px;width:100%;height:auto;border:0;outline:none;border-radius:8px;" 
                />
              </div>

              <!-- Dark Mode Logo: Dedicated Dark Mode Emblem (Seamless on dark bg) -->
              <div class="dark-logo-wrap" style="display:none;margin:0 auto 12px;text-align:center;mso-hide:all;">
                <img 
                  src="${darkLogoUrl}" 
                  alt="Niyansh Pharma" 
                  width="150" 
                  class="mobile-logo-dark"
                  style="display:block;margin:0 auto;max-width:150px;width:100%;height:auto;border:0;outline:none;" 
                />
              </div>

              <!-- Tagline -->
              <div class="mobile-tagline" style="color:#93c5fd;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;margin-top:6px;line-height:1.4;">
                Wholesale Pharmaceutical Distribution &amp; Supply Chain Hub
              </div>
              
              <!-- Security Badge -->
              <div style="margin-top:10px;display:inline-block;background:rgba(255,255,255,0.12);padding:4px 14px;border-radius:20px;color:#e0f2fe;font-size:10px;font-weight:600;letter-spacing:0.5px;border:1px solid rgba(255,255,255,0.2);">
                SECURE ADMINISTRATIVE PROVISIONING • GxP COMPLIANT
              </div>
            </td>
          </tr>

          <!-- Letter Body Content -->
          <tr>
            <td class="email-content mobile-pad" style="padding:32px 32px 26px;background-color:#ffffff;">

              <!-- Ref & Date Bar -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="ref-date-bar" style="margin-bottom:20px;border-bottom:1px solid #f1f5f9;padding-bottom:12px;">
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
                  <td class="cred-card-head" style="background:#0f172a;padding:12px 18px;border-bottom:2px solid #059669;">
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

              <!-- Big Primary Enterprise CTA Button (Opens in New Tab) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="btn-container" style="margin:0 auto;">
                      <tr>
                        <td align="center" class="cta-btn-cell" style="background:#0c3d6c;background:linear-gradient(135deg, #071e3d 0%, #0c3d6c 100%);border-radius:8px;box-shadow:0 4px 14px rgba(12,61,108,0.35);">
                          <a href="${loginUrl}" target="_blank" rel="noopener noreferrer" class="mobile-btn" style="display:inline-block;padding:15px 36px;font-size:14px;font-weight:800;color:#ffffff;text-decoration:none;letter-spacing:0.8px;text-transform:uppercase;border-radius:8px;font-family:Arial,Helvetica,sans-serif;">
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

/**
 * Sends confirmation email to Chemist right after registration
 * informing them that documents are under verification within 24 hours.
 */
async function sendChemistRegistrationPendingEmail({ to, name, companyName, drugLicense, phone }) {
  try {
    const transporter = getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Niyansh Pharma Wholesale" <info@niyanshpharma.com>';
    const emailSubject = `📋 Niyansh Pharma - Chemist Registration Received & Under Verification`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Chemist Registration Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0c3d6c 0%, #1e40af 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">NIYANSH PHARMA</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #86efac; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Care • Quality • Trust • PAN Gujarat Distribution</p>
            </td>
          </tr>

          <!-- Notice Banner -->
          <tr>
            <td style="background-color: #fef3c7; border-bottom: 2px solid #f59e0b; padding: 14px 24px; text-align: center;">
              <span style="font-size: 14px; font-weight: 700; color: #b45309;">⏳ Status: KYC & Drug License Under Verification (Within 24 Hours)</span>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="margin: 0 0 14px 0; font-size: 20px; color: #0c3d6c;">નમસ્તે ${name || 'Chemist Partner'},</h2>
              <p style="font-size: 15px; line-height: 1.65; color: #475569; margin: 0 0 20px 0;">
                તમારી ફાર્મસી <strong>"${companyName || 'Retail Pharmacy'}"</strong> ની નિયાંશ ફાર્મા B2B હોલસેલ પોર્ટલ પર નોંધણી સફળતાપૂર્વક મળી ગઈ છે.
              </p>

              <!-- Application Summary Box -->
              <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; padding: 16px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b; width: 40%;"><strong>Pharmacy / Store:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0c3d6c; font-weight: 700;">${companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Contact Person:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #1e293b;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Registered Email:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #1e293b;">${to}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Drug License No:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #1e293b; font-weight: 600;">${drugLicense || 'Submitted'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Phone:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #1e293b;">+91 ${phone}</td>
                </tr>
              </table>

              <!-- What Happens Next -->
              <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #166534; font-weight: 700;">આગળનું સ્ટેપ શું છે? (Next Step):</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #15803d; line-height: 1.6;">
                  <li>અમારી રેગ્યુલેટરી & કમ્પ્લાયન્સ ટીમ તમારા ડ્રગ લાયસન્સ (Form 20/21) અને KYC ડોક્યુમેન્ટ્સ તપાસી રહી છે.</li>
                  <li><strong>24 કલાકમાં</strong> સુપરએડમિન તરફથી વેરિફિકેશન મંજૂર (Approve) થતાં જ તમને એક્ટિવેશન ઈમેઈલ મળશે.</li>
                  <li>મંજૂરી મળતાં જ તમારું લોગિન એક્ટિવ થઈ જશે અને તમે હોલસેલ PTR રેટ્સ તથા 10+1 સ્કીમ્સ એક્સેસ કરી શકશો.</li>
                </ul>
              </div>

              <!-- Support Contact -->
              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0;">
                જો તાત્કાલિક વેરિફિકેશનની જરૂર હોય તો અમારા હોલસેલ ડેસ્ક પર સંપર્ક કરી શકો છો:<br>
                📞 <strong>+91 99099 23130</strong> | ✉️ <strong>info@niyanshpharma.com</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
              © 2026 Niyansh Pharma. Wholesale Pharma Distributor, Rajkot, Gujarat.<br>
              This is an automated regulatory acknowledgment. Please do not reply directly to this email.
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
      console.log(`[EmailService - PENDING] Chemist registration pending email prepared for ${to}`);
      return { success: false, pendingConfig: true };
    }

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: emailSubject,
      html: htmlContent
    });

    console.log(`[EmailService] Chemist pending email sent to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EmailService] Error sending chemist pending email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sends approval email to Chemist with username and password once approved by Superadmin.
 */
async function sendChemistApprovalEmail({ to, name, companyName, email, plainPassword, drugLicense }) {
  try {
    const transporter = getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Niyansh Pharma Wholesale" <info@niyanshpharma.com>';
    const emailSubject = `🎉 Congratulations! Your Niyansh Pharma Chemist Wholesale Account is Approved & Active`;

    const passwordDisplay = plainPassword ? plainPassword : 'Your chosen password at registration';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Account Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #065f46 0%, #0c3d6c 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">NIYANSH PHARMA</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #86efac; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Authorized B2B Wholesale Pharmacy Network</p>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td style="background-color: #dcfce7; border-bottom: 2px solid #22c55e; padding: 14px 24px; text-align: center;">
              <span style="font-size: 15px; font-weight: 800; color: #15803d;">✅ ACCOUNT APPROVED & ACTIVATED!</span>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="margin: 0 0 14px 0; font-size: 20px; color: #0c3d6c;">અભિનંદન ${name || 'Chemist Partner'},</h2>
              <p style="font-size: 15px; line-height: 1.65; color: #475569; margin: 0 0 20px 0;">
                તમારી ફાર્મસી <strong>"${companyName || 'Retail Pharmacy'}"</strong> ના તમામ ડ્રગ લાયસન્સ અને KYC ડોક્યુમેન્ટ્સ નિયાંશ ફાર્મા સુપરએડમિન દ્વારા <strong>મંજૂર (Approve)</strong> કરવામાં આવ્યા છે. તમારું હોલસેલ એકાઉન્ટ હવે સંપૂર્ણ સક્રિય (Active) છે!
              </p>

              <!-- Credentials Box -->
              <div style="background-color: #f8fafc; border: 2px solid #38bdf8; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0369a1; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">🔑 તમારા લોગિન ક્રેડેન્શિયલ્સ (Login Details):</h3>
                <table role="presentation" width="100%">
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #64748b; width: 35%;"><strong>Website URL:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #0c3d6c; font-weight: 700;">
                      <a href="https://niyanshpharma.com" target="_blank" style="color: #0284c7; text-decoration: none;">https://niyanshpharma.com</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Username / Email:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #0c3d6c; font-weight: 700;">${email || to}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Password:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 800; background-color: #e0f2fe; padding: 4px 8px; border-radius: 4px; display: inline-block;">${passwordDisplay}</td>
                  </tr>
                </table>
              </div>

              <!-- Unlocked Perks -->
              <div style="background-color: #f0fdf4; border-radius: 12px; padding: 18px; margin-bottom: 26px;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #166534; font-weight: 700;">હવે તમે પોર્ટલ પર શું કરી શકશો?</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #15803d; line-height: 1.7;">
                  <li><strong>ગોપનીય હોલસેલ PTR રેટ્સ:</strong> તમામ ટેબ્લેટ્સ, સિરપ અને ઇન્જેક્ટેબલ્સના વાસ્તવિક ટ્રેડ રેટ્સ અને તમારો પ્રોફિટ માર્જિન (%) જોઈ શકશો.</li>
                  <li><strong>10+1 & વોલ્યુમ સ્કીમ્સ:</strong> હોલસેલ ડીસ્કાઉન્ટ સ્કીમ્સ અને બોનસ ઓફર્સનો સીધો લાભ.</li>
                  <li><strong>ફાસ્ટ B2B ક્વિક ઓર્ડર:</strong> 1-ક્લિકમાં જથ્થાબંધ ઓર્ડર બુક કરો અને સેમ-ડે ડિસ્પેચ મેળવો.</li>
                  <li><strong>લાઈવ લેજર & બાકી રકમ:</strong> તમારું સ્ટેટમેન્ટ, ક્રેડિટ લિમિટ (₹1,00,000) અને GST ઇન્વૉઇસેસ ડાઉનલોડ કરો.</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="https://niyanshpharma.com" target="_blank" style="background: linear-gradient(135deg, #0c3d6c 0%, #1e40af 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 30px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(12, 61, 108, 0.35);">
                  🚀 એકાઉન્ટમાં લોગિન કરો (Login to Chemist Portal)
                </a>
              </div>

              <!-- Support Contact -->
              <p style="font-size: 13.5px; color: #64748b; line-height: 1.6; margin: 0; text-align: center;">
                ઓર્ડર અથવા પ્રોડક્ટ ઈન્ક્વાયરી માટે:<br>
                📞 હોલસેલ ડેસ્ક: <strong>+91 99099 23130</strong> | ✉️ <strong>info@niyanshpharma.com</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
              © 2026 Niyansh Pharma. Wholesale Pharma Distributor, Rajkot, Gujarat.<br>
              Authorized B2B Channel for WHO-GMP Pharmaceutical Formulations.
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
      console.log(`[EmailService - PENDING] Chemist approval email prepared for ${to}. Password: ${passwordDisplay}`);
      return { success: false, pendingConfig: true };
    }

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: emailSubject,
      html: htmlContent
    });

    console.log(`[EmailService] Chemist approval email successfully sent to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EmailService] Error sending chemist approval email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sends rejection / document re-upload notice to Chemist.
 */
async function sendChemistRejectionEmail({ to, name, companyName, reason }) {
  try {
    const transporter = getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Niyansh Pharma Wholesale" <info@niyanshpharma.com>';
    const emailSubject = `⚠️ Niyansh Pharma - Chemist Account Verification Notice`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Verification Notice</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background-color: #b91c1c; padding: 26px 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800;">NIYANSH PHARMA</h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #fecaca;">KYC Compliance & Regulatory Verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 24px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #991b1b;">ડ્રગ લાયસન્સ / KYC દસ્તાવેજ ચકાસણી નોટિસ</h2>
              <p style="font-size: 14.5px; line-height: 1.6; color: #475569;">
                નમસ્તે ${name || 'Chemist Partner'}, તમારી ફાર્મસી <strong>"${companyName}"</strong> ના રજીસ્ટ્રેશન દસ્તાવેજોમાં નીચે મુજબની ક્ષતિ જણાયેલ છે:
              </p>
              <div style="background-color: #fef2f2; border: 1px solid #f87171; border-radius: 8px; padding: 14px; margin: 18px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                કારણ: ${reason || 'ડ્રગ લાયસન્સ અથવા જીએસટી દસ્તાવેજ અસ્પષ્ટ છે અથવા માન્ય નથી.'}
              </div>
              <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
                કૃપા કરીને સાચા દસ્તાવેજ સાથે ફરીથી રજીસ્ટ્રેશન કરો અથવા સીધો અમારા હોલસેલ ડેસ્ક પર સંપર્ક કરો:<br>
                📞 <strong>+91 99099 23130</strong> | ✉️ <strong>info@niyanshpharma.com</strong>
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

    if (!transporter) return { success: false, pendingConfig: true };
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: emailSubject,
      html: htmlContent
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  getTransporter,
  sendAdminWelcomeEmail,
  sendChemistRegistrationPendingEmail,
  sendChemistApprovalEmail,
  sendChemistRejectionEmail
};
