import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth } from "../utils.js";

const generalRouter = express.Router();

//===========
// SUMMARY
//===========
generalRouter.get(
  "/summary",
  // isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    
  })
);

export default generalRouter;
