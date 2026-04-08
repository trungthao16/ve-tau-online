import React from "react";

function CancelTicketModal({ ticket, onConfirm, onClose }) {
  if (!ticket) return null;

  // Tái sử dụng logic tính toán từ MyTickets.js để đảm bảo đồng nhất
  const now = new Date();
  const depDate = new Date(ticket.train?.departureDate);
  const [hours, minutes] = (ticket.train?.departureTime || "00:00").split(":");
  depDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

  const timeDiffMs = depDate - now;
  const hoursDiff = timeDiffMs / (1000 * 60 * 60);

  let refundPercent = 0;
  let feePercent = 100;

  if (hoursDiff > 24) {
    refundPercent = 90;
    feePercent = 10;
  } else if (hoursDiff >= 4) {
    refundPercent = 50;
    feePercent = 50;
  } else {
    refundPercent = 0;
    feePercent = 100;
  }

  const fee = Math.round(ticket.price * (feePercent / 100));
  const refund = ticket.price - fee;

  return (
    <div className="cancel-modal-overlay">
      <div className="cancel-modal-card">
        <div className="cancel-modal-header">
          <div className="warning-icon">⚠️</div>
          <h2>Xác nhận hủy vé</h2>
        </div>
        
        <div className="cancel-modal-body">
          <p className="modal-intro">
            Bạn đang yêu cầu hủy mã vé <strong>#{String(ticket._id).slice(-6).toUpperCase()}</strong>. 
            Vui lòng kiểm tra kỹ chi tiết hoàn tiền bên dưới:
          </p>
          
          <div className="refund-breakdown">
            <div className="breakdown-row">
              <span className="row-label">Giá vé gốc</span>
              <span className="row-value">{ticket.price.toLocaleString("vi-VN")}đ</span>
            </div>
            
            <div className="breakdown-row fee">
              <span className="row-label">Phí hủy ({feePercent}%)</span>
              <span className="row-value">-{fee.toLocaleString("vi-VN")}đ</span>
            </div>
            
            <div className="breakdown-divider"></div>
            
            <div className="breakdown-row total-refund">
              <span className="row-label">Số tiền hoàn lại</span>
              <span className="row-value">{refund.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
          
          <div className="modal-notice">
            {refundPercent === 0 ? (
              <p className="error-text">⚠️ Theo quy định, vé hủy dưới 4h trước giờ khởi hành không được hoàn tiền.</p>
            ) : (
              <p className="success-text">✅ Tiền sẽ được hoàn trả về tài khoản đã thanh toán trong 3-5 ngày làm việc.</p>
            )}
          </div>
        </div>
        
        <div className="cancel-modal-footer">
          <button className="btn-no" onClick={onClose}>Giữ lại vé</button>
          <button className="btn-yes" onClick={onConfirm}>Xác nhận hủy</button>
        </div>
      </div>
    </div>
  );
}

export default CancelTicketModal;
