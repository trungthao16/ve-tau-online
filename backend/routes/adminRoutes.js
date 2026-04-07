


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

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Các route của bạn ở đây...
router.get('/', (req, res) => {
    res.json({ message: "Admin API working" });
});

router.get('/stats', adminController.getStats);

module.exports = router;