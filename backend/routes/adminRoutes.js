


// import React from "react";
// import { Navigate } from "react-router-dom";

// const AdminRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!user || user.role !== "admin") {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default AdminRoute;

const express = require('express'); // Đổi từ import sang require
const router = express.Router();

// Các route của bạn ở đây...
router.get('/', (req, res) => {
    res.json({ message: "Admin API working" });
});

module.exports = router; // Đổi từ export default sang module.exports