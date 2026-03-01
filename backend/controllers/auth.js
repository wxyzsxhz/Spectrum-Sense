import { hash } from "bcryptjs";
import user from "../models/user.js";
import { compare } from "bcryptjs";
import { genToken } from "../utils/jwt.js";
import { serverError } from "./error.js";
import { transporter } from "../utils/mailer.js";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
    
        const existing = await  user.findOne({ email });
        if (existing)
          return res.status(400).json({ message: "Email already in use." });

        const hashed = await hash(password, 10);
    
        const newUser = new user({
          name,
          email,
          password: hashed,
        });
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully.",token: genToken(newUser) });
    } catch (err) {
        console.error("Register error:", err);
        serverError(err, res);
    }
}

export const login = async (req, res) => {
    try {
        
        const { email, password } = req.body;
    
        // Check if user exists
        const existing = await user.findOne({ email });
        if (!existing) {
          return res.status(401).json({ message: "Invalid email or password." });
        }
    
        // Check password
        const isMatch = await compare(password, existing.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid email or password." });
        }
    
        // Generate JWT token
        const token = genToken(existing)
    
        // Respond with success and user info (omit password!)
        const { password: _, ...userData } = existing.toObject(); // remove password
        res.status(200).json({
          message: "Logged in successfully",
          token,
          user: userData
        });
    
    } catch (err) {
        console.error("Login error:", err);
        serverError(err, res);
    }
}

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Remove .lean() so we can use .save()
    const existing = await user.findOne({ email });

    if (!existing) {
      return res.status(404).json({ message: `There's no account for ${email}` });
    }

    const token = genToken(existing);
    existing.resetPasswordToken = token;
    existing.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await existing.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
  to: existing.email,
  subject: "Spectrum Sense | Password Reset Request",
  html: `
  <div style="margin:0; padding:0; background-color:#f4f9fb; font-family: Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Logo / Title -->
            <tr>
              <td align="center" style="padding-bottom:15px;">
                <h2 style="color:#1a9fb0; margin:0;">Spectrum Sense</h2>
                <p style="color:#777; font-size:14px; margin:5px 0 0;">
                  ASD Screening & Development Tracking
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td>
                <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;" />
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td>
                <h3 style="color:#333;">Password Reset Request</h3>

                <p style="color:#555; font-size:14px; line-height:1.6;">
                  We received a request to reset the password for your Spectrum-Sense account.
                </p>

                <p style="color:#555; font-size:14px; line-height:1.6;">
                  Click the button below to create a new password:
                </p>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding:25px 0;">
                <a href="${resetUrl}"
                   style="background-color:#1a9fb0; color:#ffffff; padding:12px 24px; 
                          text-decoration:none; border-radius:8px; 
                          font-weight:bold; display:inline-block;">
                  Reset Password
                </a>
              </td>
            </tr>

            <!-- Security Note -->
            <tr>
              <td>
                <p style="color:#777; font-size:13px; line-height:1.6;">
                  If you did not request this, you can safely ignore this email. 
                  Your account will remain secure.
                </p>

                <p style="color:#777; font-size:13px;">
                  For security reasons, this link will expire in 1 hour.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td>
                <hr style="border:none; border-top:1px solid #e5e7eb; margin:25px 0;" />
                <p style="font-size:12px; color:#999; text-align:center;">
                  © ${new Date().getFullYear()} Spectrum-Sense<br/>
                  Supporting early developmental awareness for families.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `
});

    return res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    serverError(err, res);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log(`Token : ${token} Password : ${password}`);
    

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    const account = await user.findOne({
      _id: decoded.id
    });
    console.log(account);
    
    if (!account) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    account.password = await hash(password, 10);

    // Clear reset fields
    account.resetPasswordToken = undefined;
    account.resetPasswordExpires = undefined;

    await account.save();

    res.status(201).json({ message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
