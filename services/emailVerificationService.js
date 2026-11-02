import emailjs from "@emailjs/browser";

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_campuslf"; // You'll need to set this up
const EMAILJS_TEMPLATE_ID = "template_verify"; // You'll need to create this template
const EMAILJS_PUBLIC_KEY = "your_public_key"; // You'll get this from EmailJS

class EmailVerificationService {
  constructor() {
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // Generate 6-digit verification code
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send verification email using EmailJS
  async sendVerificationEmail(
    toEmail,
    verificationCode,
    fullName,
    universityName
  ) {
    try {
      const templateParams = {
        to_email: toEmail,
        to_name: fullName,
        verification_code: verificationCode,
        university_name: universityName,
        from_name: "Campus Lost Found",
        reply_to: "noreply@campuslostfound.com",
        subject: "Campus Lost Found - Email Verification Code",
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        return {
          success: true,
          message: "Verification email sent successfully!",
        };
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      return {
        success: false,
        message: "Failed to send verification email. Please try again.",
      };
    }
  }

  // Fallback: Use a simple backend service if EmailJS fails
  async sendVerificationEmailFallback(
    toEmail,
    verificationCode,
    fullName,
    universityName
  ) {
    try {
      // This is a simple implementation using a webhook service like Formspree or similar
      const response = await fetch("https://formspree.io/f/your-form-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: toEmail,
          subject: "Campus Lost Found - Email Verification Code",
          message: `
Hello ${fullName},

Welcome to Campus Lost Found!

Your email verification code is: ${verificationCode}

Please enter this code in the signup form to complete your registration for ${universityName}.

This code will expire in 10 minutes.

Best regards,
Campus Lost Found Team
          `,
        }),
      });

      if (response.ok) {
        return {
          success: true,
          message: "Verification email sent successfully!",
        };
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Fallback Email Error:", error);
      return {
        success: false,
        message: "Failed to send verification email. Please try again.",
      };
    }
  }

  // Main method that tries EmailJS first, then fallback
  async sendEmail(toEmail, verificationCode, fullName, universityName) {
    // Try EmailJS first
    let result = await this.sendVerificationEmail(
      toEmail,
      verificationCode,
      fullName,
      universityName
    );

    // If EmailJS fails, try fallback
    if (!result.success) {
      console.log("EmailJS failed, trying fallback method...");
      result = await this.sendVerificationEmailFallback(
        toEmail,
        verificationCode,
        fullName,
        universityName
      );
    }

    return result;
  }
}

export default EmailVerificationService;
