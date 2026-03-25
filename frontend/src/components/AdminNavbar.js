import { NavLink, useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-inner">
        <div className="admin-navbar-left">
          <div className="admin-brand" onClick={() => navigate("/admin")}>
            <div className="rv-brand-icon">🚆</div>
            <div className="admin-brand-text">
              <h2>VeTauOnline</h2>
              <span>Quản trị hệ thống</span>
            </div>
          </div>

          <nav className="admin-menu">
            <NavLink to="/admin" end>
              Dashboard
            </NavLink>
            <NavLink to="/admin/trains">Quản lý tàu</NavLink>
            <NavLink to="/admin/tickets">Quản lý vé</NavLink>
            <NavLink to="/admin/users">Quản lý user</NavLink>
            <NavLink to="/admin/promotions">Khuyến mãi</NavLink>
            <NavLink to="/admin/support">Hỗ trợ</NavLink>
          </nav>
        </div>

        <div className="admin-navbar-right">
          <div className="admin-user-box">
            <div className="admin-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="admin-user-info">
              <strong>{user?.name || "Admin"}</strong>
              <span>{user?.email || "admin@email.com"}</span>
            </div>
          </div>

          <button className="admin-home-btn" onClick={() => navigate("/")}>
            Về trang chủ
          </button>

          <button className="admin-logout-btn" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;