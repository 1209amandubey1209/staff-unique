const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Attendance = require("../models/Attendance");
const router = express.Router();
const moment = require("moment");  // To handle dates
const xlsx = require("xlsx");
const PDFDocument = require("pdfkit");
const fs = require("fs");


// Route for marking attendance
router.post("/mark", protect, async (req, res) => {
    const { location, selfie } = req.body;

    try {
        // Create a new attendance record
        const attendance = new Attendance({
            user: req.user.id,
            location: {
                type: "Point",
                coordinates: [location.longitude, location.latitude], // Ensure the coordinates are correct
            },
            selfie,
        });

        await attendance.save();
        res.status(201).json({ message: "Attendance marked successfully", attendance });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Route for fetching attendance records (Admin only)
router.get("/", protect, async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find().populate("user", "name email role");
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Route for generating monthly attendance report (Admin only)
router.get("/report", protect, async (req, res) => {
    const { year, month } = req.query;  // Accept year and month as query parameters

    try {
        // Start and end dates for the selected month
        const startDate = moment(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = moment(`${year}-${month}-01`).endOf("month").toDate();

        // Fetch attendance data for the selected month
        const attendanceRecords = await Attendance.find({
            date: { $gte: startDate, $lte: endDate },
        }).populate("user", "name email role");

        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//excel report
router.get("/report/export", protect, async (req, res) => {
    const { year, month } = req.query;

    try {
        const startDate = moment(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = moment(`${year}-${month}-01`).endOf("month").toDate();

        const attendanceRecords = await Attendance.find({
            date: { $gte: startDate, $lte: endDate },
        }).populate("user", "name email role");

        // Convert attendance records to a format suitable for Excel
        const excelData = attendanceRecords.map((record) => ({
            Name: record.user.name,
            Email: record.user.email,
            Role: record.user.role,
            Date: moment(record.date).format("YYYY-MM-DD"),
            Location: `Lat: ${record.location.coordinates[1]}, Lon: ${record.location.coordinates[0]}`,
            Selfie: record.selfie,
        }));

        // Create Excel file
        const worksheet = xlsx.utils.json_to_sheet(excelData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

        // Generate Excel file and send it as response
        const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
        res.setHeader("Content-Disposition", "attachment; filename=attendance_report.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//pdf report
router.get("/report/export/pdf", protect, async (req, res) => {
    const { year, month } = req.query;

    try {
        const startDate = moment(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = moment(`${year}-${month}-01`).endOf("month").toDate();

        const attendanceRecords = await Attendance.find({
            date: { $gte: startDate, $lte: endDate },
        }).populate("user", "name email role");

        // Create a PDF document
        const doc = new PDFDocument();

        res.setHeader("Content-Disposition", "attachment; filename=attendance_report.pdf");
        res.setHeader("Content-Type", "application/pdf");

        doc.pipe(res);

        // Add title
        doc.fontSize(18).text("Attendance Report", { align: "center" }).moveDown();

        // Add table headers
        doc.fontSize(12).text("Name | Email | Role | Date | Location", { underline: true }).moveDown();

        // Add data for each attendance record
        attendanceRecords.forEach((record) => {
            const { name, email, role } = record.user;
            const date = moment(record.date).format("YYYY-MM-DD");
            const location = `Lat: ${record.location.coordinates[1]}, Lon: ${record.location.coordinates[0]}`;
            doc.text(`${name} | ${email} | ${role} | ${date} | ${location}`);
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
