const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// đăng ký
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      } else {
        // Xóa user chưa xác thực để đăng ký lại
        await User.deleteOne({ email });
      }
    }

    // mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: true // Đăng ký xong dùng ngay
    });

    await user.save();

    res.status(201).json({
      message: "Đăng ký thành công! Bạn có thể đăng nhập ngay.",
      email: user.email
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác." });
    }

    res.status(500).json({ message: error.message });
  }
};

// đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Quên mật khẩu - Bước 1: Kiểm tra email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Vui lòng nhập email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });

    res.json({ message: "Xác nhận email thành công. Vui lòng đặt mật khẩu mới.", email });
  } catch (error) {
    console.error("Lỗi forgotPassword:", error);
    res.status(500).json({ message: "Có lỗi xảy ra. Vui lòng thử lại." });
  }
};

// Quên mật khẩu - Bước 2: Đặt mật khẩu mới
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay." });
  } catch (error) {
    console.error("Lỗi resetPassword:", error);
    res.status(500).json({ message: "Có lỗi xảy ra. Vui lòng thử lại." });
  }
};
