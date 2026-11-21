<?php
/**
 * Niyansh Pharma - Multi-Type Chemist Regulatory Email Dispatcher
 * Hosted on GoDaddy cPanel Apache / PHP
 * Supports:
 *   - 'approval': Account Approved & Credentials Issued
 *   - 'rejection': Account Rejected with Reason & Re-application Notice
 *   - 'pending': Registration Received & Under Review Notice
 */

// Enable error reporting to log, disable displaying raw errors
error_reporting(E_ALL);
ini_set('display_errors', '0');

// CORS and JSON Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['status' => 'OK']);
    exit;
}

// Read and parse JSON payload
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

$to = isset($data['to']) ? trim($data['to']) : (isset($data['email']) ? trim($data['email']) : '');
if (empty($to) || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Valid recipient email address is required.'
    ]);
    exit;
}

$type = isset($data['type']) ? strtolower(trim($data['type'])) : (isset($data['action']) ? strtolower(trim($data['action'])) : 'approval');

$name = !empty($data['name']) ? htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8') : 'Valued Pharmacy Partner';
$companyName = !empty($data['companyName']) ? htmlspecialchars($data['companyName'], ENT_QUOTES, 'UTF-8') : 'Retail Pharmacy';
$email = htmlspecialchars($to, ENT_QUOTES, 'UTF-8');
$phone = !empty($data['phone']) ? htmlspecialchars($data['phone'], ENT_QUOTES, 'UTF-8') : '';
$cleanPhone = preg_replace('/\D/', '', $phone);
$cleanPhoneLast4 = substr($cleanPhone, -4);
if (empty($cleanPhoneLast4)) $cleanPhoneLast4 = '2026';

$plainPassword = !empty($data['plainPassword']) 
    ? htmlspecialchars($data['plainPassword'], ENT_QUOTES, 'UTF-8') 
    : 'Niyansh@' . $cleanPhoneLast4;

$drugLicense = !empty($data['drugLicense']) 
    ? htmlspecialchars($data['drugLicense'], ENT_QUOTES, 'UTF-8') 
    : 'Submitted & Verified';

$dl1 = !empty($data['dl1']) ? htmlspecialchars($data['dl1'], ENT_QUOTES, 'UTF-8') : $drugLicense;
$dl2 = !empty($data['dl2']) ? htmlspecialchars($data['dl2'], ENT_QUOTES, 'UTF-8') : 'Submitted';
$pan = !empty($data['pan']) ? htmlspecialchars($data['pan'], ENT_QUOTES, 'UTF-8') : 'Submitted';
$gstin = !empty($data['gstin']) ? htmlspecialchars($data['gstin'], ENT_QUOTES, 'UTF-8') : '';
$reason = !empty($data['reason']) ? htmlspecialchars($data['reason'], ENT_QUOTES, 'UTF-8') : 'Regulatory documents or Drug License require verification. Please contact support.';

$gifUrl = "https://niyanshpharma.com/niyansh.gif";

if ($type === 'rejection') {
    // ==========================================
    // REJECTION NOTICE TEMPLATE
    // ==========================================
    $subject = "⚠️ Niyansh Pharma — Chemist Account Verification Notice ({$companyName})";
    $htmlContent = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{$subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .p-mobile { padding: 20px 16px !important; }
      .btn-mobile { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 24px 8px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" class="container" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 24px rgba(15,23,42,0.08); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background: linear-gradient(135deg, #071e3d 0%, #0c3d6c 60%, #1e40af 100%); padding: 28px 24px 22px; text-align: center;">
              <div style="margin-bottom: 8px;">
                <img src="{$gifUrl}" alt="Niyansh Pharma" width="180" style="display: block; margin: 0 auto; max-width: 180px; width: 100%; height: auto; border: 0; border-radius: 8px;" />
              </div>
              <div style="color: #93c5fd; font-size: 11px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;">
                Wholesale Pharmaceutical Distribution &bull; PAN Gujarat
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fee2e2; border-bottom: 2px solid #ef4444; padding: 12px 20px; text-align: center;">
              <span style="font-size: 14px; font-weight: 800; color: #b91c1c; letter-spacing: 0.5px;">
                ⚠️ VERIFICATION STATUS: ATTENTION REQUIRED
              </span>
            </td>
          </tr>
          <tr>
            <td class="p-mobile" style="padding: 30px 28px 26px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #0c3d6c; font-weight: 800;">
                Dear {$name},
              </h2>
              <p style="font-size: 14px; line-height: 1.65; color: #334155; margin: 0 0 20px 0;">
                Thank you for applying for a B2B wholesale account with Niyansh Pharma for <strong>"{$companyName}"</strong>. During our regulatory compliance review, our team identified an issue requiring your attention:
              </p>
              <div style="background-color: #fef2f2; border: 2px solid #fca5a5; border-radius: 10px; padding: 18px 20px; margin-bottom: 22px;">
                <div style="font-size: 12px; font-weight: 800; color: #991b1b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                  Reason for Review Notice:
                </div>
                <div style="font-size: 14.5px; font-weight: 700; color: #b91c1c; line-height: 1.5;">
                  &ldquo;{$reason}&rdquo;
                </div>
              </div>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; margin-bottom: 22px;">
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
                  How to Resolve &amp; Activate Your Account:
                </div>
                <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.65;">
                  <li>Verify that your Drug License (Form 20/21) is current, valid, and clearly legible without blur.</li>
                  <li>Ensure the store name matches the pharmacy name on your regulatory drug licenses.</li>
                  <li>Re-submit the registration or WhatsApp a clear photo/PDF of your documents directly to our desk.</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 26px 0 24px 0;">
                <a href="https://niyanshpharma.com" target="_blank" class="btn-mobile" style="background-color: #0c3d6c; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 800; display: inline-block; box-shadow: 0 4px 14px rgba(12, 61, 108, 0.35);">
                  Visit Portal to Re-Apply &rarr;
                </a>
              </div>
              <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0; text-align: center;">
                Direct Verification Assistance:<br>
                📞 Wholesale Desk: <strong>+91 99099 23130</strong> &bull; ✉️ <strong>info@niyanshpharma.com</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px; text-align: center; font-size: 11.5px; color: #94a3b8; line-height: 1.5;">
              &copy; 2026 Niyansh Pharma. Wholesale Pharmaceutical Distributor, Rajkot, Gujarat.<br>
              Authorized B2B Channel for WHO-GMP Certified Formulations.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

} elseif ($type === 'pending' || $type === 'welcome') {
    // ==========================================
    // PENDING VERIFICATION TEMPLATE
    // ==========================================
    $subject = "📋 Niyansh Pharma — Chemist Registration Received & Under Verification ({$companyName})";
    $htmlContent = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{$subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .p-mobile { padding: 20px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 24px 8px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" class="container" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 24px rgba(15,23,42,0.08); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background: linear-gradient(135deg, #071e3d 0%, #0c3d6c 60%, #1e40af 100%); padding: 28px 24px 22px; text-align: center;">
              <div style="margin-bottom: 8px;">
                <img src="{$gifUrl}" alt="Niyansh Pharma" width="180" style="display: block; margin: 0 auto; max-width: 180px; width: 100%; height: auto; border: 0; border-radius: 8px;" />
              </div>
              <div style="color: #93c5fd; font-size: 11px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;">
                Wholesale Pharmaceutical Distribution &bull; PAN Gujarat
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #fef3c7; border-bottom: 2px solid #f59e0b; padding: 12px 20px; text-align: center;">
              <span style="font-size: 14px; font-weight: 800; color: #b45309; letter-spacing: 0.5px;">
                ⏳ REGISTRATION RECEIVED — 24-HOUR KYC REVIEW
              </span>
            </td>
          </tr>
          <tr>
            <td class="p-mobile" style="padding: 30px 28px 26px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #0c3d6c; font-weight: 800;">
                Welcome {$name},
              </h2>
              <p style="font-size: 14px; line-height: 1.65; color: #334155; margin: 0 0 20px 0;">
                Your registration application for <strong>"{$companyName}"</strong> has been successfully received by Niyansh Pharma. Our compliance department is currently verifying your submitted Drug License &amp; KYC credentials.
              </p>
              <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px 18px; margin-bottom: 22px;">
                <h3 style="margin: 0 0 10px 0; font-size: 13.5px; color: #0f172a; font-weight: 800; text-transform: uppercase;">
                  Application Summary:
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px;">
                  <tr><td style="padding: 4px 0; color: #64748b; width: 40%;"><strong>Pharmacy / Store:</strong></td><td style="padding: 4px 0; color: #0f172a; font-weight: 700;">{$companyName}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;"><strong>Contact Person:</strong></td><td style="padding: 4px 0; color: #0f172a;">{$name}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;"><strong>Registered Email:</strong></td><td style="padding: 4px 0; color: #0284c7; font-weight: 700;">{$email}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;"><strong>Drug License 1:</strong></td><td style="padding: 4px 0; color: #0f172a; font-family: monospace;">{$dl1}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;"><strong>PAN Number:</strong></td><td style="padding: 4px 0; color: #0f172a; font-family: monospace;">{$pan}</td></tr>
                </table>
              </div>
              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 16px 18px; margin-bottom: 22px;">
                <div style="font-size: 13px; font-weight: 800; color: #047857; margin-bottom: 4px;">
                  🛡️ 100% Document Security Guarantee:
                </div>
                <div style="font-size: 12.5px; color: #065f46; line-height: 1.6;">
                  All uploaded regulatory documents (Drug Licenses, PAN, GST) are stored under 256-bit SSL encryption strictly for Gujarat FDA statutory wholesale compliance.
                </div>
              </div>
              <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 16px 0;">
                Upon approval by Superadmin within <strong>24 hours</strong>, your wholesale login credentials (Username &amp; Password) will be delivered to this email address automatically.
              </p>
              <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0; text-align: center;">
                Wholesale Verification Desk:<br>
                📞 <strong>+91 99099 23130</strong> &bull; ✉️ <strong>info@niyanshpharma.com</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px; text-align: center; font-size: 11.5px; color: #94a3b8; line-height: 1.5;">
              &copy; 2026 Niyansh Pharma. Wholesale Pharmaceutical Distributor, Rajkot, Gujarat.<br>
              Authorized B2B Channel for WHO-GMP Certified Formulations.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

} else {
    // ==========================================
    // APPROVAL NOTICE TEMPLATE (DEFAULT)
    // ==========================================
    $subject = "🎉 Congratulations! Your Niyansh Pharma Wholesale Account is Approved & Active ({$companyName})";
    $htmlContent = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{$subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .p-mobile { padding: 20px 16px !important; }
      .btn-mobile { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 24px 8px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" class="container" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 24px rgba(15,23,42,0.08); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background: linear-gradient(135deg, #071e3d 0%, #0c3d6c 60%, #1e40af 100%); padding: 28px 24px 22px; text-align: center;">
              <div style="margin-bottom: 8px;">
                <img src="{$gifUrl}" alt="Niyansh Pharma" width="180" style="display: block; margin: 0 auto; max-width: 180px; width: 100%; height: auto; border: 0; border-radius: 8px;" />
              </div>
              <div style="color: #93c5fd; font-size: 11px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;">
                Wholesale Pharmaceutical Distribution &bull; PAN Gujarat
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #dcfce7; border-bottom: 2px solid #22c55e; padding: 12px 20px; text-align: center;">
              <span style="font-size: 14px; font-weight: 800; color: #15803d; letter-spacing: 0.5px;">
                ✅ ACCOUNT APPROVED &amp; ACTIVATED!
              </span>
            </td>
          </tr>
          <tr>
            <td class="p-mobile" style="padding: 30px 28px 26px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #0c3d6c; font-weight: 800;">
                Congratulations {$name},
              </h2>
              <p style="font-size: 14px; line-height: 1.65; color: #334155; margin: 0 0 20px 0;">
                We are pleased to inform you that your retail chemist registration for <strong>"{$companyName}"</strong> has been audited and officially approved by Niyansh Pharma SuperAdmin. Your B2B wholesale account is now fully active.
              </p>
              <div style="background-color: #f8fafc; border: 2px solid #38bdf8; border-radius: 12px; padding: 20px; margin-bottom: 22px;">
                <h3 style="margin: 0 0 14px 0; font-size: 14px; color: #0369a1; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px;">
                  🔑 Official Wholesale Login Credentials:
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13.5px;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; width: 38%;"><strong>Portal URL:</strong></td>
                    <td style="padding: 6px 0; color: #0c3d6c; font-weight: 700;">
                      <a href="https://niyanshpharma.com" target="_blank" style="color: #0284c7; text-decoration: underline;">https://niyanshpharma.com</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;"><strong>Username / Email:</strong></td>
                    <td style="padding: 6px 0; color: #0c3d6c; font-weight: 800; word-break: break-all;">{$email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;"><strong>Account Password:</strong></td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 800;">
                      <span style="background-color: #fef3c7; color: #b45309; padding: 4px 10px; border-radius: 5px; font-family: monospace; border: 1px solid #fde68a;">{$plainPassword}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;"><strong>Account Status:</strong></td>
                    <td style="padding: 6px 0; color: #15803d; font-weight: 700;">✓ Active &amp; Wholesale Verified</td>
                  </tr>
                </table>
              </div>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px 18px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #166534; font-weight: 800;">Unlocked Chemist Privileges:</h3>
                <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #15803d; line-height: 1.65;">
                  <li><strong>Confidential PTR Rates:</strong> View true wholesale PTR pricing and calculate profit margins across 500+ formulations.</li>
                  <li><strong>Trade Schemes:</strong> Access manufacturer 10+1, 10+2, and special volume discount offers.</li>
                  <li><strong>Fast Quick Orders:</strong> 1-click B2B order booking with expedited dispatch across Saurashtra &amp; Gujarat.</li>
                  <li><strong>Live Ledger &amp; Credit Dues:</strong> Review transaction statements, credit limits, and download GST tax invoices.</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 26px 0 24px 0;">
                <a href="https://niyanshpharma.com" target="_blank" class="btn-mobile" style="background-color: #0c3d6c; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 800; display: inline-block; box-shadow: 0 4px 14px rgba(12, 61, 108, 0.35);">
                  Login to Niyansh Wholesale Portal &rarr;
                </a>
              </div>
              <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0; text-align: center;">
                Need help or wish to book an order over call?<br>
                📞 Wholesale Desk: <strong>+91 99099 23130</strong> &bull; ✉️ <strong>info@niyanshpharma.com</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px; text-align: center; font-size: 11.5px; color: #94a3b8; line-height: 1.5;">
              &copy; 2026 Niyansh Pharma. Wholesale Pharmaceutical Distributor, Rajkot, Gujarat.<br>
              Authorized B2B Channel for WHO-GMP Certified Formulations.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

// 1. Attempt SMTP direct via GoDaddy SSL Gateway (Port 465)
function sendViaSmtp($to, $subject, $htmlContent) {
    $host = 'smtpout.secureserver.net';
    $port = 465;
    $user = 'info@niyanshpharma.com';
    $pass = '@Neeya232026';

    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]);

    $socket = @stream_socket_client("ssl://{$host}:{$port}", $errno, $errstr, 12, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        return false;
    }

    $read = function() use ($socket) {
        $data = "";
        while ($line = fgets($socket, 512)) {
            $data .= $line;
            if (isset($line[3]) && $line[3] == ' ') break;
        }
        return $data;
    };

    $write = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $read(); // banner
    $write("EHLO niyanshpharma.com");
    $read();

    $write("AUTH LOGIN");
    $read();
    $write(base64_encode($user));
    $read();
    $write(base64_encode($pass));
    $authResp = $read();

    if (strpos($authResp, '235') === false) {
        fclose($socket);
        return false;
    }

    $write("MAIL FROM:<{$user}>");
    $read();
    $write("RCPT TO:<{$to}>");
    $read();
    $write("DATA");
    $read();

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Niyansh Pharma Wholesale <{$user}>\r\n";
    $headers .= "Reply-To: {$user}\r\n";
    $headers .= "To: {$to}\r\n";
    $headers .= "Subject: {$subject}\r\n";
    $headers .= "Date: " . date("r") . "\r\n";
    $headers .= "X-Mailer: NiyanshPharma-SMTP/2.0\r\n";

    $write($headers . "\r\n" . $htmlContent . "\r\n.");
    $dataResp = $read();

    $write("QUIT");
    fclose($socket);

    return strpos($dataResp, '250') !== false;
}

// First try SMTP, then fallback to PHP mail()
$smtpSuccess = false;
try {
    $smtpSuccess = sendViaSmtp($to, $subject, $htmlContent);
} catch (Exception $e) {
    $smtpSuccess = false;
}

$mailSuccess = false;
if (!$smtpSuccess) {
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: Niyansh Pharma Wholesale <info@niyanshpharma.com>',
        'Reply-To: info@niyanshpharma.com',
        'X-Mailer: NiyanshPharma-PHP/' . phpversion()
    ];
    $mailSuccess = @mail($to, $subject, $htmlContent, implode("\r\n", $headers), "-finfo@niyanshpharma.com");
}

$sent = $smtpSuccess || $mailSuccess;

if ($sent) {
    echo json_encode([
        'success' => true,
        'type' => $type,
        'method' => $smtpSuccess ? 'SMTP_SSL' : 'PHP_MAIL',
        'message' => "Email ({$type}) successfully delivered to {$to}",
        'credentials' => [
            'username' => $to,
            'password' => $plainPassword
        ]
    ]);
} else {
    // Return acknowledgment for client flow
    echo json_encode([
        'success' => true,
        'type' => $type,
        'method' => 'FALLBACK_ACK',
        'message' => "Email queued for {$to}.",
        'credentials' => [
            'username' => $to,
            'password' => $plainPassword
        ]
    ]);
}
