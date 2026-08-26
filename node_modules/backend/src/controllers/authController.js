const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const { success, error } = require('../utils/responseHelper');
const sendEmail = require('../utils/sendEmail');

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, phone, password, role } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return error(res, 'Email is already registered', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const userRole = role === 'owner' ? 'owner' : 'customer';

      const newUser = await UserModel.createUser({
        name,
        email,
        phone,
        passwordHash,
        role: userRole,
      });

      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);

      await UserModel.updateRefreshToken(newUser.id, refreshToken);

      // Send welcome email
      sendEmail({
        to: email,
        subject: 'Welcome to SalonBook LK!',
        text: `Hello ${name}, welcome to SalonBook LK! Your account has been successfully created.`,
        html: `<h2>Welcome to SalonBook LK!</h2><p>Hello <strong>${name}</strong>, thank you for joining Sri Lanka's leading salon booking platform as a <strong>${userRole}</strong>.</p>`,
      });

      return success(
        res,
        {
          user: newUser,
          accessToken,
          refreshToken,
        },
        'Registration successful',
        201
      );
    } catch (err) {
      console.error(err);
      return error(res, err.message || 'Registration failed');
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return error(res, 'Invalid email or password', 401);
      }

      if (!user.is_active) {
        return error(res, 'Account is suspended due to violations or multiple no-shows', 403);
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return error(res, 'Invalid email or password', 401);
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      await UserModel.updateRefreshToken(user.id, refreshToken);

      const userObj = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar_url: user.avatar_url,
        warning_strikes: user.warning_strikes,
      };

      return success(
        res,
        {
          user: userObj,
          accessToken,
          refreshToken,
        },
        'Login successful'
      );
    } catch (err) {
      console.error(err);
      return error(res, err.message || 'Login failed');
    }
  }

  static async logout(req, res) {
    try {
      if (req.user?.id) {
        await UserModel.updateRefreshToken(req.user.id, null);
      }
      return success(res, null, 'Logged out successfully');
    } catch (err) {
      return error(res, err.message || 'Logout failed');
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return error(res, 'Refresh token required', 400);
      }

      const decoded = verifyRefreshToken(refreshToken);
      const user = await UserModel.findById(decoded.id);

      if (!user || !user.is_active) {
        return error(res, 'Invalid token or inactive account', 401);
      }

      const accessToken = generateAccessToken(user);

      return success(res, { accessToken }, 'Token refreshed');
    } catch (err) {
      return error(res, 'Invalid or expired refresh token', 401);
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return success(res, null, 'If that email is registered, a reset link was sent.');
      }

      const resetToken = generateAccessToken(user);
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

      await sendEmail({
        to: email,
        subject: 'Password Reset Request - SalonBook LK',
        text: `Reset your password by visiting: ${resetLink}`,
        html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
      });

      return success(res, null, 'If that email is registered, a reset link was sent.');
    } catch (err) {
      return error(res, err.message || 'Forgot password request failed');
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const decoded = verifyAccessToken(token);

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      await UserModel.updatePassword(decoded.id, passwordHash);

      return success(res, null, 'Password reset successful');
    } catch (err) {
      return error(res, 'Invalid or expired reset token', 400);
    }
  }

  static async verifyEmail(req, res) {
    try {
      return success(res, null, 'Email verified successfully');
    } catch (err) {
      return error(res, 'Verification failed');
    }
  }
}

module.exports = AuthController;
