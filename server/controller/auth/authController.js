import User from "../../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import transporter from "../../config/auth/nodemailer.js"
import dotenv from "dotenv";
dotenv.config();


// Register
export const register = async (req, res) => {
  const { userName, email, password } = req.body;

  // Basic validation
  if (!userName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide username, email, and password.",
    });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists!",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User saved:", savedUser.email);

    // Generate token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path:"/"
    });

    // Send welcome email
    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_MAIL, // must be verified in Brevo
        to: email,
        subject: "Welcome to WhiteSpace",
        text: `Hello ${userName},\n\nYour account has been successfully created with email: ${email}\n\nThank you for registering!`,
      });
      console.log("Email sent:", info.response);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    // Send response
    return res.status(200).json({
      success: true,
      message: "Registration successful!",
      user: {
        id: savedUser._id,
        userName: savedUser.userName,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again.",
    });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    //  2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    //  4. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //  5. Set cookie securely
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //  6. Send response (omit sensitive data)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role, // include role if you use agent/user roles
        isAccountVerified: user.isAccountVerified, // include if verification system is used
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      pat:"/"
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ These two lines are crucial
    req.user = { _id: decoded.id };
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};



export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID found in token.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified.",
      });
    }

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    // ✅ Send OTP Email
    await transporter.sendMail({
      from: process.env.SMTP_MAIL, // verified Brevo sender
      to: user.email,
      subject: "Your WhiteSpace Verification OTP",
      text: `Hi ${user.userName},\n\nYour account verification OTP is: ${otp}\n\nThis code is valid for 1 hour.\n\n- WhiteSpace Team`,
    });

    console.log("OTP sent successfully to:", user.email);

    return res.status(200).json({
      success: true,
      message: "Verification OTP sent successfully.",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("sendVerifyOtp Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while sending OTP.",
    });
  }
};

//verify OTP
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;
  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.verifyOTP || user.verifyOTP !== otp) {
      return res.status(404).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.verifyOTPExpireAt < Date.now()) {
      return res.status(202).json({
        success: false,
        message: "OTP Expired",
      });
    }
    user.isAccountVerified = true;
    user.verifyOTP = null;
    user.verifyOTPExpireAt = null;

    const verifyUser = await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verified Successfully",
      user: {
        id: verifyUser._id,
        userName: verifyUser.userName,
        email: verifyUser.email,
      },
    });
  } catch (error) {
    console.error("Unauth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};





export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Unauth Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

//send otp for reset password
export const resetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "user not found.",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    const resetOtpUser = await user.save();

    await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: resetOtpUser.email,
      subject: "Reset OTP.",
      text: `Your OTP is ${otp}.Verify your account using this OTP.`,
    });
    return res.status(200).json({
      success: true,
      message: "Verification OTP",
      user: {
        id: resetOtpUser._id,
        userName: resetOtpUser.userName,
        email: resetOtpUser.email,
      },
    });
  } catch (error) {
    console.error("Unauth Error", error);
    return res.status(500).json({
      success: false,
      message: "Invalid or Expire token.",
    });
  }
};

//Reset password
export const ResetPassword = async (req, res) => {
  const {email,otp, newPassword } = req.body;
  if (!otp || !email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, OTP, and new password are required.",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or OTP is invalid.",
      });
    }
    if (!user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password=hashedPassword
    user.resetOtp=null
    user.resetOtpExpireAt=null

    const savedUser=await user.save();
    await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "Welcome to WEBDEV",
      text: "Your password has been successfully changed. If you did not initiate this change, please contact support immediately.",
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
      user: {
        id: savedUser._id,
        userName: savedUser.userName,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.log("Unauth Error", error);
    return res.status(500).json({
      success: false,
      message: "Invalid or Expire token.",
    });
  }
};