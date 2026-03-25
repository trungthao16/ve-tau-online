import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [train, setTrain] = useState(null);
  const [seatNumber, setSeatNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrain = async () => {
      try {
        const res = await API.get(`/trains/${id}`);
        setTrain(res.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết tàu:", error);
        alert("Không tải được thông tin chuyến tàu");
      }
    };

    fetchTrain();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!seatNumber) {
      alert("Vui lòng nhập số ghế");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        trainId: id,
        seatNumber: seatNumber,
      };

      console.log("BOOKING PAYLOAD:", payload);

      const res = await API.post("/tickets", payload);

      console.log("BOOKING SUCCESS:", res.data);
      alert("Đặt vé thành công");
      navigate("/my-tickets");
    } catch (error) {
      console.error("BOOKING ERROR:", error);
      console.error("BOOKING ERROR RESPONSE:", error.response?.data);

      alert(error.response?.data?.message || "Đặt vé thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!train) return <div className="rv-container">Đang tải...</div>;

  return (
    <div className="booking-page">
      <div className="rv-container">
        <div className="booking-card">
          <div className="booking-left">
            <h1 className="booking-title">{train.name}</h1>
            <div className="booking-route">
              {train.from} → {train.to}
            </div>

            <div className="booking-info-grid">
              <div className="info-item">
                <span>Khởi hành</span>
                <strong>{train.departureTime}</strong>
              </div>

              <div className="info-item">
                <span>Đến nơi</span>
                <strong>{train.arrivalTime}</strong>
              </div>

              <div className="info-item">
                <span>Giá vé</span>
                <strong>{Number(train.price).toLocaleString("vi-VN")}đ</strong>
              </div>

              <div className="info-item">
                <span>Tổng ghế</span>
                <strong>{train.seats}</strong>
              </div>
            </div>
          </div>

          <div className="booking-right">
            <h3>Thông tin đặt vé</h3>

            <form onSubmit={handleBooking}>
              <label>Số ghế</label>
              <input
                type="text"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                placeholder="Ví dụ: 12"
              />

              <button
                type="submit"
                className="confirm-booking-btn"
                disabled={loading}
              >
                {loading ? "Đang đặt vé..." : "Xác nhận đặt vé"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;