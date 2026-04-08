import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

// Bước 1: Nhập email 
// Bước 2: Nhập OTP gửi về mail
// Bước 3: Đổi mật khẩu
function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) { setError("Vui lòng nhập email"); return; }
    try {
      setLoading(true); setError(""); setMessage("");
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi gửi email");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otpCode || !newPassword || !confirmPassword) { setError("Vui lòng điền đủ thông tin"); return; }
    if (newPassword !== confirmPassword) { setError("Mật khẩu xác nhận không khớp"); return; }
    if (newPassword.length < 6) { setError("Mật khẩu phải có ít nhất 6 ký tự"); return; }

    try {
      setLoading(true); setError(""); setMessage("");
      await API.post("/auth/reset-password", { email, otpCode, newPassword });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {step === 1 && (
          <>
            <p className="section-label">Hỗ trợ tài khoản</p>
            <h1>Quên Mật Khẩu</h1>
            <p className="auth-sub">Nhập email đã đăng ký để nhận mã OTP.</p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSendEmail} className="auth-form">
              <label>Địa chỉ Email</label>
              <input
                type="email"
                placeholder="Nhập email đã đăng ký"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi Mã OTP"}
              </button>
            </form>
            <p className="auth-footer">
              Nhớ mật khẩu rồi? <Link to="/login">Đăng nhập</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <p className="section-label">Xác minh danh tính</p>
            <h1>Đặt Lại Mật Khẩu</h1>
            <p className="auth-sub">Nhập mã OTP đã gửi đến <strong>{email}</strong></p>

            {message && <div style={styles.success}>{message}</div>}
            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleResetPassword} className="auth-form">
              <label>Mã OTP</label>
              <input
                type="text"
                placeholder="VD: 123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength="6"
                required
              />

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
                {loading ? "Đang cập nhật..." : "Đổi Mật Khẩu"}
              </button>
            </form>

            <p className="auth-footer">
              <button onClick={() => setStep(1)} style={styles.linkBtn}>← Quay lại đổi email</button>
            </p>
          </>
        )}

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
  error: {
    padding: "12px 16px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    marginBottom: "16px",
    fontSize: "14px"
  },
  success: {
    padding: "12px 16px",
    backgroundColor: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    borderRadius: "10px",
    marginBottom: "16px",
    fontSize: "14px"
  },
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
