const nodemailer = require('nodemailer');

// Create Nodemailer Transporter using Gmail service
const createTransporter = () => {
  const user = (process.env.EMAIL_USER || 'admin@gmail.com').trim();
  const pass = (process.env.EMAIL_PASS || 'passkey').replace(/\s+/g, '');

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    }
  });
};

/**
 * Checks if real credentials have been configured
 */
const isConfigured = () => {
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  return Boolean(user && pass && user !== 'admin@gmail.com' && pass !== 'passkey');
};

/**
 * Send Welcome Email upon student/user registration
 */
const sendWelcomeEmail = async ({ email, name }) => {
  try {
    const transporter = createTransporter();
    const sender = process.env.EMAIL_USER || 'admin@gmail.com';

    const mailOptions = {
      from: `"Campus Lost & Found - SAEC" <${sender}>`,
      to: email,
      subject: 'Welcome to Campus Lost & Found Portal!',
      text: `Hello ${name},\n\nWelcome! We're happy to have you on the S.A. Engineering College Campus Lost & Found Portal.\n\nYou can now report lost or found items, claim items with proof of ownership, and connect safely with students and faculty.\n\nRegards,\nCampus Lost & Found Team\nS.A. Engineering College (Autonomous)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 20px; border-radius: 8px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">🎓 Campus Lost & Found</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">S.A. Engineering College (Autonomous)</p>
          </div>
          <div style="padding: 24px 10px; color: #1e293b; line-height: 1.6;">
            <h2 style="color: #0f172a; margin-top: 0;">Welcome, ${name}! 👋</h2>
            <p>Thank you for registering on our university Lost & Found platform. Your account is now active.</p>
            <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
              <strong>What you can do:</strong>
              <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #475569;">
                <li>🔍 <strong>Report Lost Items:</strong> Provide details so finders can reach you.</li>
                <li>✨ <strong>Report Found Items:</strong> Help belongings find their rightful owner.</li>
                <li>🤝 <strong>Claim Items:</strong> Submit verification proofs directly to the poster.</li>
              </ul>
            </div>
            <p>If you have any questions or need assistance, feel free to visit the college student help desk.</p>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">S.A. Engineering College (Autonomous) &bull; Official Student Portal</p>
            <p style="margin: 4px 0 0 0;">Automated email notification. Please do not reply directly.</p>
          </div>
        </div>
      `
    };

    if (!isConfigured()) {
      console.log(`[Nodemailer Simulation] Welcome email simulated for: ${email} (Configure EMAIL_USER and EMAIL_PASS in server/.env for live dispatch)`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer] Welcome email delivered to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Nodemailer Error] Failed to send welcome email to ${email}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Email to Item Poster when a Claim is submitted
 */
const sendClaimNotificationEmail = async ({ ownerEmail, ownerName, itemTitle, claimantName, message }) => {
  try {
    const transporter = createTransporter();
    const sender = process.env.EMAIL_USER || 'admin@gmail.com';

    const mailOptions = {
      from: `"Campus Lost & Found - SAEC" <${sender}>`,
      to: ownerEmail,
      subject: `New Claim on your item: "${itemTitle}"`,
      text: `Hello ${ownerName},\n\nSomeone has submitted a claim on your reported item: "${itemTitle}".\n\nClaimant: ${claimantName}\nVerification Note: "${message}"\n\nPlease log in to your dashboard to review and approve/reject the claim.\n\nRegards,\nCampus Lost & Found Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1e3a8a;">New Claim Notification 🔔</h2>
          <p>Hello <strong>${ownerName}</strong>,</p>
          <p>A student has submitted an ownership claim for your posted item: <strong>${itemTitle}</strong>.</p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Claimant:</strong> ${claimantName}</p>
            <p style="margin: 0;"><strong>Verification Note:</strong> <em>"${message}"</em></p>
          </div>
          <p>Log in to your <strong>Student Dashboard</strong> to review this claim and verify details.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">S.A. Engineering College (Autonomous) &bull; Campus Lost & Found</p>
        </div>
      `
    };

    if (!isConfigured()) {
      console.log(`[Nodemailer Simulation] Claim email simulated for: ${ownerEmail} on item: ${itemTitle}`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Nodemailer Error] Failed to send claim notification to ${ownerEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Email to Claimant when their Claim is Approved or Rejected
 */
const sendClaimDecisionEmail = async ({ claimantEmail, claimantName, itemTitle, decision, ownerName, ownerPhone }) => {
  try {
    const transporter = createTransporter();
    const sender = process.env.EMAIL_USER || 'admin@gmail.com';
    const isApproved = decision === 'approved';

    const subject = isApproved
      ? `🎉 Your Claim for "${itemTitle}" Has Been Approved!`
      : `Update on your Claim for "${itemTitle}"`;

    const mailOptions = {
      from: `"Campus Lost & Found - SAEC" <${sender}>`,
      to: claimantEmail,
      subject: subject,
      text: isApproved
        ? `Hello ${claimantName},\n\nGreat news! Your claim for "${itemTitle}" has been approved by ${ownerName}.\n${ownerPhone ? `Contact Phone: ${ownerPhone}\n` : ''}\nPlease coordinate retrieval safely.\n\nRegards,\nCampus Lost & Found Team`
        : `Hello ${claimantName},\n\nYour claim for "${itemTitle}" was not approved by the reporter.\n\nRegards,\nCampus Lost & Found Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: ${isApproved ? '#059669' : '#dc2626'};">${isApproved ? 'Claim Approved! 🎉' : 'Claim Status Update'}</h2>
          <p>Hello <strong>${claimantName}</strong>,</p>
          <p>${isApproved ? `Your claim on <strong>${itemTitle}</strong> has been <strong>approved</strong> by the item reporter.` : `Your claim on <strong>${itemTitle}</strong> was declined by the item reporter.`}</p>
          ${isApproved ? `
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 8px; margin: 15px 0; color: #065f46;">
              <p style="margin: 0;"><strong>Reporter:</strong> ${ownerName}</p>
              ${ownerPhone ? `<p style="margin: 6px 0 0 0;"><strong>Contact Number:</strong> ${ownerPhone}</p>` : ''}
              <p style="margin: 8px 0 0 0; font-size: 13px;">Please coordinate safe item retrieval on campus.</p>
            </div>
          ` : ''}
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">S.A. Engineering College (Autonomous) &bull; Campus Lost & Found</p>
        </div>
      `
    };

    if (!isConfigured()) {
      console.log(`[Nodemailer Simulation] Claim decision email (${decision}) simulated for: ${claimantEmail}`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Nodemailer Error] Failed to send claim decision email to ${claimantEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createTransporter,
  sendWelcomeEmail,
  sendClaimNotificationEmail,
  sendClaimDecisionEmail
};
