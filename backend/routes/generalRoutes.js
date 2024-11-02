import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth } from "../utils.js";
import Report from "../models/reportModel.js";
import User from "../models/userModel.js";

const generalRouter = express.Router();

//===========
// SUMMARY
//===========
generalRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      // Total registered users
      const totalUsersCount = await User.countDocuments();

      // Total reports
      const totalReportsCount = await Report.countDocuments();

      // Breakdown of report statuses
      const approvedReportsCount = await Report.countDocuments({ status: "approved" });
      const pendingReportsCount = await Report.countDocuments({ status: "pending" });
      const disapprovedReportsCount = await Report.countDocuments({ status: "disapproved" });

      // Last 10 days
      const last10Days = Array.from(
        { length: 10 },
        (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      ).reverse();

      // Last 10 days registered users
      const last10DaysUsers = await User.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            totalUsers: { $sum: 1 },
          },
        },
        {
          $match: {
            _id: { $in: last10Days },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by date ascending for the response
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            totalUsers: 1,
          },
        },
      ]);

      // Last 10 days submitted reports
      const last10DaysReports = await Report.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            totalReports: { $sum: 1 },
          },
        },
        {
          $match: {
            _id: { $in: last10Days },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by date ascending for the response
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            totalReports: 1,
          },
        },
      ]);

      // Initialize merged result array
      const mergedResults = last10Days.map((date) => {
        const usersData = last10DaysUsers.find((user) => user.date === date) || { totalUsers: 0 };
        const reportsData = last10DaysReports.find((report) => report.date === date) || { totalReports: 0 };

        return {
          date,
          totalUsers: usersData.totalUsers,
          totalReports: reportsData.totalReports,
        };
      });

      res.send({
        totalUsers: totalUsersCount,
        totalReports: totalReportsCount,
        reportStatusCounts: {
          approved: approvedReportsCount,
          pending: pendingReportsCount,
          disapproved: disapprovedReportsCount,
        },
        last10DaysData: mergedResults,
      });
    } catch (error) {
      console.error("Error fetching summary:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  })
);


export default generalRouter;
