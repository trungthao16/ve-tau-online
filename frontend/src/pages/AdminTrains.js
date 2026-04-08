import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

function AdminTrains() {
  const [trains, setTrains] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    trainName: "",
    from: "",
    to: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    totalSeats: "",
  });

  const fetchTrains = async () => {
    try {
      const res = await API.get("/trains");
      setTrains(res.data);
    } catch (error) {
      console.log("FETCH ERROR:", error);
      console.log("FETCH DATA:", error.response?.data);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      trainName: "",
      from: "",
      to: "",
      departureDate: "",
      departureTime: "",
      arrivalTime: "",
      price: "",
      totalSeats: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/trains/${editingId}`, form);
        toast.success("Cập nhật tàu thành công");
      } else {
        await API.post("/trains", form);
        toast.success("Thêm tàu thành công");
      }

      resetForm();
      fetchTrains();
    } catch (error) {
      console.log("SUBMIT ERROR:", error);
      console.log("SUBMIT RESPONSE:", error.response);
      console.log("SUBMIT DATA:", error.response?.data);

      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleEdit = (train) => {
    setEditingId(train._id);
    setForm({
      trainName: train.trainName || "",
      from: train.from || "",
      to: train.to || "",
      departureDate: train.departureDate
        ? train.departureDate.slice(0, 10)
        : "",
      departureTime: train.departureTime || "",
      arrivalTime: train.arrivalTime || "",
      price: train.price || "",
      totalSeats: train.totalSeats || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa tàu này?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/trains/${id}`);
      toast.success("Xóa tàu thành công");
      fetchTrains();
    } catch (error) {
      console.log("DELETE ERROR:", error);
      console.log("DELETE DATA:", error.response?.data);
      toast.error(error.response?.data?.message || "Xóa thất bại");
    }
  };

  return (
    <div className="rv-container admin-trains-page">
      <div className="trainlist-header">
        <p className="section-label">Quản trị hệ thống</p>
        <h1 className="trainlist-title">Quản lý tàu</h1>
      </div>

      <div className="train-card admin-form-card">
        <h3 className="admin-form-title">
          {editingId ? "Sửa chuyến tàu" : "Thêm chuyến tàu"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <input
              type="text"
              name="trainName"
              placeholder="Tên tàu"
              value={form.trainName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="from"
              placeholder="Ga đi"
              value={form.from}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="to"
              placeholder="Ga đến"
              value={form.to}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="departureDate"
              value={form.departureDate}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="departureTime"
              placeholder="Giờ khởi hành"
              onFocus={(e) => (e.target.type = "time")}
              onBlur={(e) => (e.target.type = "text")}
              value={form.departureTime}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="arrivalTime"
              placeholder="Giờ đến"
              onFocus={(e) => (e.target.type = "time")}
              onBlur={(e) => (e.target.type = "text")}
              value={form.arrivalTime}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Giá vé"
              value={form.price}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="totalSeats"
              placeholder="Tổng số ghế"
              value={form.totalSeats}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="book-btn admin-main-btn">
              {editingId ? "Cập nhật" : "Thêm tàu"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn admin-cancel-btn"
                onClick={resetForm}
              >
                Hủy sửa
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="train-card admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-trains-table">
            <thead>
              <tr>
                <th>Tên tàu</th>
                <th>Ga đi</th>
                <th>Ga đến</th>
                <th>Ngày khởi hành</th>
                <th>Giá</th>
                <th>Giờ đi</th>
                <th>Giờ đến</th>
                <th>Ghế</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {trains.length > 0 ? (
                trains.map((train) => (
                  <tr key={train._id}>
                    <td>{train.trainName}</td>
                    <td>{train.from}</td>
                    <td>{train.to}</td>
                    <td>
                      {train.departureDate
                        ? new Date(train.departureDate).toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </td>
                    <td>{Number(train.price).toLocaleString("vi-VN")}đ</td>
                    <td>{train.departureTime}</td>
                    <td>{train.arrivalTime}</td>
                    <td>{train.totalSeats}</td>
                    <td>
                      <div className="admin-action-buttons">
                        <button
                          type="button"
                          onClick={() => handleEdit(train)}
                          className="admin-edit-btn"
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(train._id)}
                          className="admin-delete-btn"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="admin-empty">
                    Chưa có chuyến tàu nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminTrains;