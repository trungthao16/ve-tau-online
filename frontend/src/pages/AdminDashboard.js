import { useEffect, useState } from "react";
import API from "../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrains: 0,
    totalTickets: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      icon: "👥",
      note: "Tài khoản đã đăng ký",
      className: "users",
    },
    {
      title: "Tổng chuyến tàu",
      value: stats.totalTrains,
      icon: "🚆",
      note: "Chuyến đang quản lý",
      className: "trains",
    },
    {
      title: "Tổng vé",
      value: stats.totalTickets,
      icon: "🎫",
      note: "Vé đã được đặt",
      className: "tickets",
    },
    {
      title: "Tổng doanh thu",
      value: `${Number(stats.totalRevenue || 0).toLocaleString("vi-VN")} VNĐ`,
      icon: "💰",
      note: "Doanh thu hiện tại",
      className: "revenue",
    },
  ];

  return (
    <div className="admin-dashboard-page">
      <div className="rv-container">
        <div className="admin-dashboard-hero">
          <div className="admin-dashboard-hero-content">
            <p className="admin-dashboard-label">TRUNG TÂM QUẢN TRỊ</p>
            <h1 className="admin-dashboard-title">Dashboard Admin</h1>
            <p className="admin-dashboard-sub">
              Theo dõi nhanh tình trạng hệ thống, số lượng người dùng, vé tàu,
              chuyến tàu và doanh thu trên một giao diện trực quan hơn.
            </p>
          </div>
        </div>

        <div className="admin-dashboard-grid">
          {statCards.map((item, index) => (
            <div
              className={`admin-dashboard-card ${item.className}`}
              key={index}
            >
              <div className="admin-dashboard-card-top">
                <div className="admin-dashboard-icon">{item.icon}</div>
                <span className="admin-dashboard-mini-badge">Live</span>
              </div>

              <div className="admin-dashboard-card-body">
                <p>{item.title}</p>
                <h3>{item.value}</h3>
                <span>{item.note}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-dashboard-bottom">
          <div className="admin-dashboard-panel">
            <p className="admin-dashboard-panel-label">TỔNG QUAN</p>
            <h3>Hiệu suất quản trị hệ thống</h3>
            <p>
              Dashboard này giúp admin nắm nhanh số liệu chính của hệ thống bán
              vé tàu. Bạn có thể dùng khu vực này để mở rộng thêm biểu đồ doanh
              thu, số vé theo ngày, hoặc số người dùng mới.
            </p>
          </div>

          <div className="admin-dashboard-panel dark">
            <p className="admin-dashboard-panel-label gold">GỢI Ý NÂNG CẤP</p>
            <h3>Mở rộng thêm biểu đồ & báo cáo</h3>
            <ul className="admin-dashboard-list">
              <li>Biểu đồ doanh thu theo tháng</li>
              <li>Biểu đồ số vé đã đặt / đã hủy</li>
              <li>Top tuyến tàu được đặt nhiều nhất</li>
              <li>Thống kê user mới theo thời gian</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;