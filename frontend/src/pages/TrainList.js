// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import API from "../api/axios";

// function TrainList() {
//   const [outboundTrains, setOutboundTrains] = useState([]);
//   const [returnTrains, setReturnTrains] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const location = useLocation();
//   const navigate = useNavigate();

//   const query = new URLSearchParams(location.search);
//   const from = query.get("from") || "";
//   const to = query.get("to") || "";
//   const date = query.get("date") || "";
//   const tripType = query.get("tripType") || "oneway";
//   const returnDate = query.get("returnDate") || "";
//   const groupSize = query.get("groupSize") || "";

//   useEffect(() => {
//     const fetchTrains = async () => {
//       try {
//         setLoading(true);

//         const res = await API.get("/trains");
//         const trains = Array.isArray(res.data) ? res.data : [];

//         const goTrips = trains.filter((t) => {
//           const trainDate = t.departureDate
//             ? new Date(t.departureDate).toISOString().split("T")[0]
//             : "";

//           return (
//             t.from?.toLowerCase().includes(from.toLowerCase()) &&
//             t.to?.toLowerCase().includes(to.toLowerCase()) &&
//             trainDate === date
//           );
//         });

//         let finalGoTrips = goTrips;
//         let backTrips = [];

//         if (tripType === "group" && groupSize) {
//           const groupNumber = parseInt(groupSize, 10);

//           if (!isNaN(groupNumber)) {
//             finalGoTrips = goTrips.filter(
//               (t) => (t.totalSeats || t.seats || 0) >= groupNumber
//             );
//           }
//         }

//         if (tripType === "roundtrip" && returnDate) {
//           backTrips = trains.filter((t) => {
//             const trainDate = t.departureDate
//               ? new Date(t.departureDate).toISOString().split("T")[0]
//               : "";

//             return (
//               t.from?.toLowerCase().includes(to.toLowerCase()) &&
//               t.to?.toLowerCase().includes(from.toLowerCase()) &&
//               trainDate === returnDate
//             );
//           });
//         }

//         setOutboundTrains(finalGoTrips);
//         setReturnTrains(backTrips);
//       } catch (error) {
//         console.error("Lỗi lấy danh sách tàu:", error);
//         setOutboundTrains([]);
//         setReturnTrains([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrains();
//   }, [from, to, date, returnDate, tripType, groupSize]);

//   const renderTrainCard = (train) => (
//     <div className="train-card" key={train._id}>
//       <div className="train-top">
//         <div>
//           <span className="train-badge">Tàu chạy</span>
//           <h3>{train.trainName || train.name || "Chuyến tàu"}</h3>
//         </div>
//         <div className="train-price">
//           {Number(train.price || 0).toLocaleString("vi-VN")}đ
//         </div>
//       </div>

//       <div className="train-route">
//         <div>
//           <p>Ga đi</p>
//           <h4>{train.from || "Chưa có"}</h4>
//         </div>
//         <div className="route-arrow">→</div>
//         <div>
//           <p>Ga đến</p>
//           <h4>{train.to || "Chưa có"}</h4>
//         </div>
//       </div>

//       <div className="train-meta">
//         <div>
//           <span>Ngày khởi hành</span>
//           <strong>
//             {train.departureDate
//               ? new Date(train.departureDate).toLocaleDateString("vi-VN")
//               : "Chưa có"}
//           </strong>
//         </div>

//         <div>
//           <span>Khởi hành</span>
//           <strong>{train.departureTime || "Chưa có"}</strong>
//         </div>

//         <div>
//           <span>Đến nơi</span>
//           <strong>{train.arrivalTime || "Chưa có"}</strong>
//         </div>

//         <div>
//           <span>Số ghế</span>
//           <strong>{train.totalSeats || train.seats || 0}</strong>
//         </div>
//       </div>

//       <button
//         className="book-btn"
//         onClick={() => navigate(`/booking/${train._id}`)}
//       >
//         Đặt vé ngay
//       </button>
//     </div>
//   );

//   return (
//     <div className="trainlist-page">
//       <div className="rv-container trainlist-wrap">
//         <div className="trainlist-header">
//           <p className="section-label">Kết quả tìm kiếm</p>
//           <h1 className="trainlist-title">Danh sách chuyến tàu</h1>
//           <p className="trainlist-sub">
//             Tuyến: <strong>{from || "Tất cả"}</strong> →{" "}
//             <strong>{to || "Tất cả"}</strong>
//             {date && (
//               <>
//                 {" "}
//                 | Ngày đi: <strong>{date}</strong>
//               </>
//             )}
//             {tripType === "roundtrip" && returnDate && (
//               <>
//                 {" "}
//                 | Ngày về: <strong>{returnDate}</strong>
//               </>
//             )}
//             {tripType === "group" && groupSize && (
//               <>
//                 {" "}
//                 | Đoàn: <strong>{groupSize}</strong>
//               </>
//             )}
//           </p>
//         </div>

//         {loading ? (
//           <div className="empty-box">Đang tải dữ liệu chuyến tàu...</div>
//         ) : (
//           <>
//             <h2 style={{ marginBottom: "12px" }}>
//               Chuyến đi ({from} → {to})
//             </h2>

//             {outboundTrains.length === 0 ? (
//               <div className="empty-box">Không có chuyến đi phù hợp.</div>
//             ) : (
//               <div className="train-grid">
//                 {outboundTrains.map((train) => renderTrainCard(train))}
//               </div>
//             )}

//             {tripType === "roundtrip" && (
//               <>
//                 <h2 style={{ marginTop: "30px", marginBottom: "12px" }}>
//                   Chuyến về ({to} → {from})
//                 </h2>

//                 {returnTrains.length === 0 ? (
//                   <div className="empty-box">Không có chuyến về phù hợp.</div>
//                 ) : (
//                   <div className="train-grid">
//                     {returnTrains.map((train) => renderTrainCard(train))}
//                   </div>
//                 )}
//               </>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default TrainList;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

function TrainList() {
  const [outboundTrains, setOutboundTrains] = useState([]);
  const [returnTrains, setReturnTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const from = query.get("from") || "";
  const to = query.get("to") || "";
  const date = query.get("date") || "";
  const tripType = query.get("tripType") || "oneway";
  const returnDate = query.get("returnDate") || "";
  const groupSize = query.get("groupSize") || "";

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setLoading(true);

        const res = await API.get("/trains");
        const trains = Array.isArray(res.data) ? res.data : [];

        const hasSearchFilter = from || to || date;

        let goTrips = trains;

        if (hasSearchFilter) {
          goTrips = trains.filter((t) => {
            const trainDate = t.departureDate
              ? new Date(t.departureDate).toISOString().split("T")[0]
              : "";

            const matchFrom = from
              ? t.from?.toLowerCase().includes(from.toLowerCase())
              : true;

            const matchTo = to
              ? t.to?.toLowerCase().includes(to.toLowerCase())
              : true;

            const matchDate = date ? trainDate === date : true;

            return matchFrom && matchTo && matchDate;
          });
        }

        let finalGoTrips = goTrips;
        let backTrips = [];

        if (tripType === "group" && groupSize) {
          const groupNumber = parseInt(groupSize, 10);

          if (!isNaN(groupNumber)) {
            finalGoTrips = goTrips.filter(
              (t) => (t.totalSeats || t.seats || 0) >= groupNumber
            );
          }
        }

        if (tripType === "roundtrip" && returnDate) {
          backTrips = trains.filter((t) => {
            const trainDate = t.departureDate
              ? new Date(t.departureDate).toISOString().split("T")[0]
              : "";

            return (
              t.from?.toLowerCase().includes(to.toLowerCase()) &&
              t.to?.toLowerCase().includes(from.toLowerCase()) &&
              trainDate === returnDate
            );
          });
        }

        setOutboundTrains(finalGoTrips);
        setReturnTrains(backTrips);
      } catch (error) {
        console.error("Lỗi lấy danh sách tàu:", error);
        setOutboundTrains([]);
        setReturnTrains([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, [from, to, date, returnDate, tripType, groupSize]);

  const renderTrainCard = (train) => (
    <div className="train-card" key={train._id}>
      <div className="train-top">
        <div>
          <span className="train-badge">Tàu chạy</span>
          <h3>{train.trainName || train.name || "Chuyến tàu"}</h3>
        </div>
        <div className="train-price">
          {Number(train.price || 0).toLocaleString("vi-VN")}đ
        </div>
      </div>

      <div className="train-route">
        <div>
          <p>Ga đi</p>
          <h4>{train.from || "Chưa có"}</h4>
        </div>
        <div className="route-arrow">→</div>
        <div>
          <p>Ga đến</p>
          <h4>{train.to || "Chưa có"}</h4>
        </div>
      </div>

      <div className="train-meta">
        <div>
          <span>Ngày khởi hành</span>
          <strong>
            {train.departureDate
              ? new Date(train.departureDate).toLocaleDateString("vi-VN")
              : "Chưa có"}
          </strong>
        </div>

        <div>
          <span>Khởi hành</span>
          <strong>{train.departureTime || "Chưa có"}</strong>
        </div>

        <div>
          <span>Đến nơi</span>
          <strong>{train.arrivalTime || "Chưa có"}</strong>
        </div>

        <div>
          <span>Số ghế</span>
          <strong>{train.totalSeats || train.seats || 0}</strong>
        </div>
      </div>

      <button
        className="book-btn"
        onClick={() => navigate(`/booking/${train._id}`)}
      >
        Đặt vé ngay
      </button>
    </div>
  );

  return (
    <div className="trainlist-page">
      <div className="rv-container trainlist-wrap">
        <div className="trainlist-header">
          <p className="section-label">Kết quả tìm kiếm</p>
          <h1 className="trainlist-title">Danh sách chuyến tàu</h1>
          <p className="trainlist-sub">
            Tuyến: <strong>{from || "Tất cả"}</strong> →{" "}
            <strong>{to || "Tất cả"}</strong>
            {date && <> | Ngày đi: <strong>{date}</strong></>}
            {tripType === "roundtrip" && returnDate && (
              <> | Ngày về: <strong>{returnDate}</strong></>
            )}
            {tripType === "group" && groupSize && (
              <> | Đoàn: <strong>{groupSize}</strong></>
            )}
          </p>
        </div>

        {loading ? (
          <div className="empty-box">Đang tải dữ liệu chuyến tàu...</div>
        ) : (
          <>
            <h2 style={{ marginBottom: "12px" }}>
              Chuyến đi ({from || "Tất cả"} → {to || "Tất cả"})
            </h2>

            {outboundTrains.length === 0 ? (
              <div className="empty-box">Không có chuyến đi phù hợp.</div>
            ) : (
              <div className="train-grid">
                {outboundTrains.map((train) => renderTrainCard(train))}
              </div>
            )}

            {tripType === "roundtrip" && (
              <>
                <h2 style={{ marginTop: "30px", marginBottom: "12px" }}>
                  Chuyến về ({to || "Tất cả"} → {from || "Tất cả"})
                </h2>

                {returnTrains.length === 0 ? (
                  <div className="empty-box">Không có chuyến về phù hợp.</div>
                ) : (
                  <div className="train-grid">
                    {returnTrains.map((train) => renderTrainCard(train))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TrainList;