import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

// Bước 1: Nhập email → Xác nhận tồn tại
// Bước 2: Nhập mật khẩu mới (không cần OTP)
// Bước 3: Thành công
function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Bước 1: Kiểm tra email có tồn tại không
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }
    try {
      setLoading(true);
      await API.post("/auth/forgot-password", { email });
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không tìm thấy email trong hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Đặt mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/reset-password", { email, newPassword });
      toast.success("Đặt lại mật khẩu thành công!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Bước 1: Nhập email */}
        {step === 1 && (
          <>
            <p className="section-label">Hỗ trợ tài khoản</p>
            <h1>Quên Mật Khẩu</h1>
            <p className="auth-sub">Nhập email đã đăng ký để tiếp tục đặt lại mật khẩu.</p>

            <form onSubmit={handleCheckEmail} className="auth-form">
              <label>Địa chỉ Email</label>
              <input
                type="email"
                placeholder="Nhập email đã đăng ký"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Đang kiểm tra..." : "Tiếp tục"}
              </button>
            </form>
            <p className="auth-footer">
              Nhớ mật khẩu rồi? <Link to="/login">Đăng nhập</Link>
            </p>
          </>
        )}

        {/* Bước 2: Nhập mật khẩu mới */}
        {step === 2 && (
          <>
            <p className="section-label">Đặt lại mật khẩu</p>
            <h1>Mật Khẩu Mới</h1>
            <p className="auth-sub">Đặt mật khẩu mới cho tài khoản <strong>{email}</strong></p>

            <form onSubmit={handleResetPassword} className="auth-form">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                placeholder="Ít nhất 6 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <label>Xác nhận mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Đang cập nhật..." : "Đặt Lại Mật Khẩu"}
              </button>
            </form>

            <p className="auth-footer">
              <button onClick={() => setStep(1)} style={styles.linkBtn}>← Quay lại</button>
            </p>
          </>
        )}

        {/* Bước 3: Thành công */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>✅</div>
            <p className="section-label">Hoàn thành</p>
            <h1>Đặt Lại Thành Công!</h1>
            <p className="auth-sub">Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập ngay bây giờ.</p>
            <button className="auth-btn" style={{ marginTop: "16px" }} onClick={() => navigate("/login")}>
              Đăng Nhập Ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  linkBtn: {
    background: "none",
    border: "none",
    color: "#c9503a",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
    fontWeight: "700"
  }
};

export default ForgotPassword;
