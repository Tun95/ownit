import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";
import Report from "../models/reportModel.js";

const reportRouter = express.Router();

//====================
// Create a new report
//====================
reportRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const newReport = new Report({
        ...req.body,
        user: req.user._id,
        privacyPreference: req.body.privacyPreference || "public", // Default to public if not provided
      });

      const report = await newReport.save();
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

//====================
// Fetch all reports
//====================
reportRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const reports = await Report.find();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

//=================
// Filter reports
//=================
reportRouter.get(
  "/filters",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;

    const searchQuery = query.searchQuery || "all";
    const status = query.status || "all";
    const issueType = query.issueType || "all";
    const privacyPreference = query.privacyPreference || "all";
    const page = parseInt(query.page) || 1; // Page number
    const limit = parseInt(query.limit) || 10; // Limit per page

    // Filters
    const schoolNameFilter =
      searchQuery !== "all"
        ? { schoolName: { $regex: searchQuery, $options: "i" } }
        : {};

    const statusFilter =
      status !== "all"
        ? { status: { $in: status.split(",") } } // Multi-select handling
        : {};

    const issueTypeFilter =
      issueType !== "all"
        ? { issueType: { $in: issueType.split(",") } } // Multi-select handling
        : {};

    const privacyPreferenceFilter =
      privacyPreference !== "all"
        ? { privacyPreference: { $in: privacyPreference.split(",") } } // Multi-select handling
        : {};

    // Combine all filters
    const filters = {
      ...schoolNameFilter,
      ...statusFilter,
      ...issueTypeFilter,
      ...privacyPreferenceFilter,
    };

    try {
      // Fetch reports matching the filters with pagination
      const reports = await Report.find(filters)
        .sort({ createdAt: -1 }) // Sort by latest records
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
        
      // Count the total number of reports matching the filters
      const countReports = await Report.countDocuments(filters).exec();

      // Send the reports data and the count to the frontend
      res.send({ reports, countReports });
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//====================
// Fetch a report by ID
//====================
reportRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (report) {
        res.json(report);
      } else {
        res.status(404).json({ message: "Report not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

//====================
// Fetch a report by slug
//====================
reportRouter.get(
  "/slug/:slug",
  expressAsyncHandler(async (req, res) => {
    try {
      const report = await Report.findOne({ slug: req.params.slug });
      if (report) {
        res.json(report);
      } else {
        res.status(404).json({ message: "Report not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

//====================
// Approve a report
//====================
reportRouter.put(
  "/:id/approve",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (report) {
        if (report.status === "approved") {
          return res
            .status(400)
            .json({ message: "Report is already approved" });
        }
        report.status = "approved";
        const updatedReport = await report.save();
        res.json(updatedReport);
      } else {
        res.status(404).json({ message: "Report not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

//====================
// Disapprove a report
//====================
reportRouter.put(
  "/:id/disapprove",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (report) {
        if (report.status === "disapproved") {
          return res
            .status(400)
            .json({ message: "Report is already disapproved" });
        }
        report.status = "disapproved";
        const updatedReport = await report.save();
        res.json(updatedReport);
      } else {
        res.status(404).json({ message: "Report not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

//==================
// Delete a report
//==================
reportRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const result = await Report.deleteOne({ _id: req.params.id });
      if (result.deletedCount > 0) {
        res.json({ message: "Report deleted successfully" });
      } else {
        res.status(404).json({ message: "Report not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

export default reportRouter;
