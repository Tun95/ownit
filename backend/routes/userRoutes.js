import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { generateToken, isAdmin, isAuth } from "../utils.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../models/userModel.js";
import { OAuth2Client } from "google-auth-library";

const userRouter = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//============
// GOOGLE AUTH
//============
userRouter.post(
  "/google-auth",
  expressAsyncHandler(async (req, res) => {
    const { token } = req.body;
    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const webName = process.env.WEB_NAME;

    try {
      // Verify Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { sub: googleId, email, name, picture } = payload;
      const [firstName, lastName] = name.split(" ");

      // Check if the user exists by email
      let user = await User.findOne({ email });

      let isNewUser = false;

      // If the user does not exist, create a new user
      if (!user) {
        isNewUser = true; // Mark this as a new user
        user = new User({
          firstName,
          lastName,
          email,
          googleId,
          image: picture,
          role: "user",
          isAccountVerified: true,
        });
        await user.save();
      }

      // If the user is blocked, prevent login
      if (user.isBlocked) {
        return res.status(403).send({
          message: "😲 This account has been blocked by Admin.",
        });
      }

      // Generate token with the existing `generateToken` function
      const authToken = generateToken(user);

      // Send welcome email to new users
      if (isNewUser) {
        const emailMessage = `<html >
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
          }
          a { text-decoration: none; }
         
          .a_flex {
            display: flex;
            align-items: center;
          }
       
          .header {
            background-color: #00463e;
            height: 50px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
         
          .logo_img {
            width: 100px;
          }
          .head {
            flex-direction: column;
          }
         .email{
            width:200px
          }
          .message_text {
            padding: 0px 10px;
          }
          .message_text p {
            color: #434343;
            font-size: 15px;
          }
          .message_text .otp_box {
            margin: -18px 0px;
          }
          .otp_box h2 {
            background-color: #e7e7e7;
            color: #3462fa;
            padding: 5px 10px;
            border-radius: 5px;
            letter-spacing: 3px;
            width: fit-content;
          }
          .out_greeting h5 {
            line-height: 2px;
            font-size: 15px;
            color: #222222;
          }
          .footer {
            border-top: 1px solid #a5a5a5;
          }
          .footer img {
            width: 30px;
          }
          .footer p{
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <table role="presentation" width="100%">
            <tr>
              <td align="center">
                <img
                  src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730887212/logo_oodxma.png"
                  alt="logo"
                  width="100"
                  style="display: block;"
                />
              </td>
            </tr>
          </table>
          </div>
          <div class="body_text">
            <div class="head ">
             <table role="presentation" width="100%">
              <tr>
              <td align="center">
                <img
                  src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/ed1_xpf1zq.png"
                  alt="email"
                  class="email"
                />
               </td>
              
              </tr>
              <tr>
                <td align="center">
                 <div class="head_text">
                 <h2>Email Confirmed</h2>
                 </div>
                </td> 
               </tr>
             </table>
            </div>
            <div class="message_text">
              <div class="greetings">
                <h3>Hi ${user.firstName},</h3>
              </div>
              <div class="text">
                <p>
                  We are thrilled to inform you that your email has been successfully confirmed!
                </p>
                <p>
                  You can now enjoy all the features and benefits we offer, including exclusive access to key features, special discount and personalized content.
                </p>
                <table role="presentation" width="100%" style="padding: -10px 0px; margin: -15px 0px;">
                  <tr>
                    <td align="center"  style="padding: -10px 0px; margin: -15px 0px;">
                       <a href=${`${process.env.SUB_DOMAIN}/report`} style="display: inline-block; margin: 8px 0; padding: 8px 30px; background-color: #00eacd; color: #000B09; text-decoration: none; border-radius: 4px;">Proceed To Report</a>
                     </td>
                  </tr>
                </table>
              </div>
              <div class="out_greeting">
                <h5>Regards,</h5>
                <h5 class="closing">The ${webName} Team.</h5>
              </div>
            </div>
          </div>
          <div class="footer">
            <table role="presentation" width="100%">
              <tr>
                <td align="left" style="padding: 10px;">
                  <p style="margin: 0;">Edquity by Outside Lab</p>
                </td>
                <td align="right" style="padding: 10px;">
                  <a href="${facebook}" style="margin-right: 10px;">
                    <img
                      src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886760/face_z4zb3n.png"
                      alt="Facebook"
                      width="30"
                      style="display: inline-block; vertical-align: middle;"
                    />
                  </a>
                  <a href="${instagram}">
                    <img
                      src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/insta_olwhmd.png"
                      alt="Instagram"
                      width="30"
                      style="display: inline-block; vertical-align: middle;"
                    />
                  </a>
                </td>
              </tr>
            </table>
          </div>

        </div>
      </body>
    </html>`;

        // Configure Nodemailer transport
        const smtpTransport = nodemailer.createTransport({
          service: process.env.MAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Email options
        const mailOptions = {
          to: user.email,
          from: `${webName} <${process.env.EMAIL_ADDRESS}>`,
          subject: "Welcome to Our Platform!",
          html: emailMessage,
        };

        // Send the email
        await smtpTransport.sendMail(mailOptions);
        console.log("Mail sent to " + user.email);
      }

      // Send back the token and user data
      res.send({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        isAdmin: user.isAdmin,
        role: user.role,
        isBlocked: user.isBlocked,
        isAccountVerified: user.isAccountVerified,
        token: authToken,
      });
    } catch (error) {
      console.error(error);
      res.status(401).send({ message: "Google authentication failed" });
    }
  })
);

//============
// ADMIN SIGN IN
//============
userRouter.post(
  "/admin/signin",
  expressAsyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Admin Login Attempt:", { email, password });

      const admin = await User.findOne({
        email: email,
        role: "admin",
      });

      if (!admin) {
        return res
          .status(401)
          .send({ message: "No admin found with this email" });
      }
      if (admin.isBlocked) {
        return res.status(403).send({
          message: "😲 It appears this account has been blocked by Admin",
        });
      }
      if (!admin.isAccountVerified) {
        return res.status(401).send({ message: "Account not verified" });
      }
      if (await admin.isPasswordMatch(password)) {
        console.log("Password Match Successful");
        res.send({
          _id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          image: admin.image,
          isAdmin: admin.isAdmin,
          role: admin.role,
          isBlocked: admin.isBlocked,
          isAccountVerified: admin.isAccountVerified,
          token: generateToken(admin),
        });
        return;
      }
      console.log("Password Match Failed");
      res.status(401).send({ message: "Invalid email or password" });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  })
);

//===========
// ADMIN SIGNUP
//===========
userRouter.post(
  "/admin/signup",
  expressAsyncHandler(async (req, res) => {
    try {
      // Prevent new user registration
      return res.status(403).send({
        message: "Registration is currently disabled. Please try again later.",
      });

      const userExists = await User.findOne({ email: req.body?.email });
      if (userExists) {
        return res.status(400).send({ message: "User already exists" });
      }

      // Check if there's an existing admin user
      const isFirstAdmin = (await User.countDocuments({ role: "admin" })) === 0;

      const newAdmin = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        role: "admin",
        isAdmin: isFirstAdmin, // Set isAdmin to true if this is the first admin
        googleId: undefined, 
      });

      const admin = await newAdmin.save();
      res.send({
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        image: user.image,
        isAdmin: admin.isAdmin,
        role: admin.role,
        isBlocked: admin.isBlocked,
        isAccountVerified: admin.isAccountVerified,
        token: generateToken(admin),
      });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  })
);

//============
// USER SIGN IN
//============
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).send({ message: "Invalid email or password" });
      }
      if (user.isBlocked) {
        return res.status(403).send({
          message: "😲 It appears this account has been blocked by Admin",
        });
      }
      if (!user.isAccountVerified) {
        return res.status(401).send({ message: "Account not verified" });
      }
      if (await user.isPasswordMatch(password)) {
        res.send({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
          isAdmin: user.isAdmin,
          role: user.role,
          isBlocked: user.isBlocked,
          isAccountVerified: user.isAccountVerified,
          token: generateToken(user),
        });
        return;
      }
      res.status(401).send({ message: "Invalid email or password" });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  })
);

//===========
// USER SIGNUP
//===========
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    try {
      const userExists = await User.findOne({ email: req.body?.email });
      if (userExists) {
        return res.status(400).send({ message: "User already exists" });
      }

      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        role: "user",
        googleId: undefined,
      });

      const user = await newUser.save();
      res.send({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        role: user.role,
        isBlocked: user.isBlocked,
        isAccountVerified: user.isAccountVerified,
        token: generateToken(user),
      });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).send({ message: "Internal server error" });
    }
  })
);

//===================
// ADMIN ADD NEW USER ROUTE
//===================
userRouter.post(
  "/add-user",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const webName = process.env.WEB_NAME;

    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
    });

    const otp = await newUser.createAccountVerificationOtp();
    const createdUser = await newUser.save();

    const emailMessage = `<html >
       <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
          }
          a { text-decoration: none; }
         
          .a_flex {
            display: flex;
            align-items: center;
          }
       
          .header {
            background-color: #00463e;
            height: 50px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
         
          .logo_img {
            width: 100px;
          }
          .head {
            flex-direction: column;
          }
         .email{
            width:200px
          }
          .message_text {
            padding: 0px 10px;
          }
          .message_text p {
            color: #434343;
            font-size: 15px;
          }
          .message_text .otp_box {
            margin: -18px 0px;
          }
          .otp_box h2 {
            background-color: #e7e7e7;
            color: #3462fa;
            padding: 5px 10px;
            border-radius: 5px;
            letter-spacing: 3px;
            width: fit-content;
          }
          .out_greeting h5 {
            line-height: 2px;
            font-size: 15px;
            color: #222222;
          }
          .footer {
            border-top: 1px solid #a5a5a5;
          }
          .footer img {
            width: 30px;
          }
          .footer p{
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <table role="presentation" width="100%">
            <tr>
              <td align="center">
                <img
                  src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730887212/logo_oodxma.png"
                  alt="logo"
                  width="100"
                  style="display: block;"
                />
              </td>
            </tr>
          </table>
          </div>
          <div class="body_text">
            <div class="head ">
             <table role="presentation" width="100%">
              <tr>
              <td align="center">
                <img
                  src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/ed1_xpf1zq.png"
                  alt="email"
                  class="email"
                />
               </td>
              
              </tr>
              <tr>
                <td align="center">
                 <div class="head_text">
                 <h2>Account Verification</h2>
                 </div>
                </td> 
               </tr>
             </table>
            </div>
            <div class="message_text">
              <div class="greetings">
                <h3>Hi ${newUser.firstName},</h3>
              </div>
              <div class="text">
                <p>
                  You have received this email because you have been requested to
                  verify your account.
                </p>
                <table role="presentation" width="100%" style="padding: -10px 0px; margin: -15px 0px;">
                 <tr>
                  <td align="center"  style="padding: -10px 0px; margin: -15px 0px;">
                   <div class="otp_box">
                    <h2>${otp}</h2>
                   </div>
                  </td>
                  </tr>
                 </table>
               <p>Your password is: <strong>${password}</strong></p>
                <p>
                  If you did not request this verification, you can safely ignore
                  this email.
                </p>
                <p>This verification code is valid for the next 10 minutes.</p>
              </div>
              <div class="out_greeting">
                <h5>Regards,</h5>
                <h5 class="closing">The ${webName} Team.</h5>
              </div>
            </div>
          </div>
          <div class="footer">
            <table role="presentation" width="100%">
              <tr>
                <td align="left" style="padding: 10px;">
                  <p style="margin: 0;">Edquity by Outside Lab</p>
                </td>
                <td align="right" style="padding: 10px;">
                  <a href="${facebook}" style="margin-right: 10px;">
                    <img
                      src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886760/face_z4zb3n.png"
                      alt="Facebook"
                      width="30"
                      style="display: inline-block; vertical-align: middle;"
                    />
                  </a>
                  <a href="${instagram}">
                    <img
                      src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/insta_olwhmd.png"
                      alt="Instagram"
                      width="30"
                      style="display: inline-block; vertical-align: middle;"
                    />
                  </a>
                </td>
              </tr>
            </table>
          </div>

        </div>
      </body>
    </html>`;

    // Configure Nodemailer transport
    const smtpTransport = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      to: createdUser.email,
      from: `${process.env.WEB_NAME} <${process.env.EMAIL_ADDRESS}>`,
      subject: "Account Verification",
      html: emailMessage,
    };

    try {
      // Send email with Nodemailer
      await smtpTransport.sendMail(mailOptions);

      res.status(201).send({
        message: "User created. Verification email sent.",
        userId: createdUser._id,
      });
    } catch (error) {
      console.error("Failed to send email", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  })
);

//=================================
// Route to handle OTP generation and email verification for user registration and login
//=================================
userRouter.post(
  "/otp-verification",
  expressAsyncHandler(async (req, res) => {
    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const webName = process.env.WEB_NAME;

    try {
      // Get user information from the registration request
      const { email } = req.body;

      // Find the user by email in the database
      const user = await User.findOne({ email });

      // Check if the user exists
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Generate and save OTP for account verification
      const verificationOtp = await user.createAccountVerificationOtp();
      await user.save();

      const emailMessage = `<html >
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                  }
                  .container {
                    width: 100%;
                    max-width: 600px;
                    margin: auto;
                  }
                  a { text-decoration: none; }
                 
                  .a_flex {
                    display: flex;
                    align-items: center;
                  }
               
                  .header {
                    background-color: #00463e;
                    height: 50px;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                 
                  .logo_img {
                    width: 100px;
                  }
                  .head {
                    flex-direction: column;
                  }
                 .email{
                    width:200px
                  }
                  .message_text {
                    padding: 0px 10px;
                  }
                  .message_text p {
                    color: #434343;
                    font-size: 15px;
                  }
                  .message_text .otp_box {
                    margin: -18px 0px;
                  }
                  .otp_box h2 {
                    background-color: #e7e7e7;
                    color: #3462fa;
                    padding: 5px 10px;
                    border-radius: 5px;
                    letter-spacing: 3px;
                    width: fit-content;
                  }
                  .out_greeting h5 {
                    line-height: 2px;
                    font-size: 15px;
                    color: #222222;
                  }
                  .footer {
                    border-top: 1px solid #a5a5a5;
                  }
                  .footer img {
                    width: 30px;
                  }
                  .footer p{
                    font-size: 16px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <table role="presentation" width="100%">
                    <tr>
                      <td align="center">
                        <img
                          src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730887212/logo_oodxma.png"
                          alt="logo"
                          width="100"
                          style="display: block;"
                        />
                      </td>
                    </tr>
                  </table>
                  </div>
                  <div class="body_text">
                    <div class="head ">
                     <table role="presentation" width="100%">
                      <tr>
                      <td align="center">
                        <img
                          src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/ed1_xpf1zq.png"
                          alt="email"
                          class="email"
                        />
                       </td>
                      
                      </tr>
                      <tr>
                        <td align="center">
                         <div class="head_text">
                         <h2>Email Verification</h2>
                         </div>
                        </td> 
                       </tr>
                     </table>
                    </div>
                    <div class="message_text">
                      <div class="greetings">
                        <h3>Hi ${user.firstName},</h3>
                      </div>
                      <div class="text">
                        <p>
                          You have received this email because you have been requested to
                          verify your account.
                        </p>
                        <table role="presentation" width="100%" style="padding: -10px 0px; margin: -15px 0px;">
                         <tr>
                          <td align="center"  style="padding: -10px 0px; margin: -15px 0px;">
                           <div class="otp_box">
                            <h2>${verificationOtp}</h2>
                           </div>
                          </td>
                          </tr>
                         </table>
                        <p>
                          If you did not request this verification, you can safely ignore
                          this email.
                        </p>
                        <p>This verification code is valid for the next 10 minutes.</p>
                      </div>
                      <div class="out_greeting">
                        <h5>Regards,</h5>
                        <h5 class="closing">The ${webName} Team.</h5>
                      </div>
                    </div>
                  </div>
                  <div class="footer">
                    <table role="presentation" width="100%">
                      <tr>
                        <td align="left" style="padding: 10px;">
                          <p style="margin: 0;">Edquity by Outside Lab</p>
                        </td>
                        <td align="right" style="padding: 10px;">
                          <a href="${facebook}" style="margin-right: 10px;">
                            <img
                              src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886760/face_z4zb3n.png"
                              alt="Facebook"
                              width="30"
                              style="display: inline-block; vertical-align: middle;"
                            />
                          </a>
                          <a href="${instagram}">
                            <img
                              src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/insta_olwhmd.png"
                              alt="Instagram"
                              width="30"
                              style="display: inline-block; vertical-align: middle;"
                            />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>

                </div>
              </body>
            </html>`;

      // Configure Nodemailer transport
      const smtpTransport = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Email options
      const mailOptions = {
        to: user.email,
        from: `${webName} <${process.env.EMAIL_ADDRESS}>`,
        subject: "Verify your email address",
        html: emailMessage,
      };

      // Send the email
      await smtpTransport.sendMail(mailOptions);

      res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//===============
//OTP Verification
//===============
userRouter.put(
  "/verify-otp",
  expressAsyncHandler(async (req, res) => {
    const { otp } = req?.body;

    try {
      // Find user by OTP and check if the entered OTP matches
      const userFound = await User.findOne({
        accountVerificationOtp: otp,
        accountVerificationOtpExpires: { $gt: new Date() },
      });

      if (!userFound) {
        return res
          .status(400)
          .json({ message: "Invalid OTP or OTP expired. Please try again." });
      }

      // Mark the user as verified and clear OTP-related fields
      userFound.isAccountVerified = true;
      userFound.accountVerificationOtp = undefined;
      userFound.accountVerificationOtpExpires = undefined;
      await userFound.save();

      res.json({
        message: "OTP successfully verified.",
        isAccountVerified: userFound.isAccountVerified,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//===============
//USER OTP Verification
//===============
userRouter.put(
  "/verify-user-otp",
  expressAsyncHandler(async (req, res) => {
    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const webName = process.env.WEB_NAME;

    const { otp } = req?.body;

    try {
      // Find user by OTP and check if the entered OTP matches
      const userFound = await User.findOne({
        accountVerificationOtp: otp,
        accountVerificationOtpExpires: { $gt: new Date() },
      });

      if (!userFound) {
        return res
          .status(400)
          .json({ message: "Invalid OTP or OTP expired. Please try again." });
      }

      // Mark the user as verified and clear OTP-related fields
      userFound.isAccountVerified = true;
      userFound.accountVerificationOtp = undefined;
      userFound.accountVerificationOtpExpires = undefined;
      await userFound.save();
      const emailMessage = `<html >
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
          }
          a { text-decoration: none; }
         
          .a_flex {
            display: flex;
            align-items: center;
          }
       
          .header {
            background-color: #00463e;
            height: 50px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
         
          .logo_img {
            width: 100px;
          }
          .head {
            flex-direction: column;
          }
         .email{
            width:200px
          }
          .message_text {
            padding: 0px 10px;
          }
          .message_text p {
            color: #434343;
            font-size: 15px;
          }
          .message_text .otp_box {
            margin: -18px 0px;
          }
          .otp_box h2 {
            background-color: #e7e7e7;
            color: #3462fa;
            padding: 5px 10px;
            border-radius: 5px;
            letter-spacing: 3px;
            width: fit-content;
          }
          .out_greeting h5 {
            line-height: 2px;
            font-size: 15px;
            color: #222222;
          }
          .footer {
            border-top: 1px solid #a5a5a5;
          }
          .footer img {
            width: 30px;
          }
          .footer p{
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <table role="presentation" width="100%">
            <tr>
              <td align="center">
                <img
                  src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730887212/logo_oodxma.png"
                  alt="logo"
                  width="100"
                  style="display: block;"
                />
              </td>
            </tr>
          </table>
          </div>
          <div class="body_text">
            <div class="head ">
             <table role="presentation" width="100%">
              <tr>
              <td align="center">
                <img
                  src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/ed1_xpf1zq.png"
                  alt="email"
                  class="email"
                />
               </td>
              
              </tr>
              <tr>
                <td align="center">
                 <div class="head_text">
                 <h2>Email Confirmed</h2>
                 </div>
                </td> 
               </tr>
             </table>
            </div>
            <div class="message_text">
              <div class="greetings">
                <h3>Hi ${userFound.firstName},</h3>
              </div>
              <div class="text">
                <p>
                  We are thrilled to inform you that your email has been successfully confirmed!
                </p>
                <p>
                  You can now enjoy all the features and benefits we offer, including exclusive access to key features, special discount and personalized content.
                </p>
                <table role="presentation" width="100%" style="padding: -10px 0px; margin: -15px 0px;">
                  <tr>
                    <td align="center"  style="padding: -10px 0px; margin: -15px 0px;">
                       <a href=${`${process.env.SUB_DOMAIN}/report`} style="display: inline-block; margin: 8px 0; padding: 8px 30px; background-color: #00eacd; color: #000B09; text-decoration: none; border-radius: 4px;">Proceed To Report</a>
                     </td>
                  </tr>
                </table>
              </div>
              <div class="out_greeting">
                <h5>Regards,</h5>
                <h5 class="closing">The ${webName} Team.</h5>
              </div>
            </div>
          </div>
          <div class="footer">
            <table role="presentation" width="100%">
              <tr>
                <td align="left" style="padding: 10px;">
                  <p style="margin: 0;">Edquity by Outside Lab</p>
                </td>
                <td align="right" style="padding: 10px;">
                  <a href="${facebook}" style="margin-right: 10px;">
                    <img
                      src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886760/face_z4zb3n.png"
                      alt="Facebook"
                      width="30"
                      style="display: inline-block; vertical-align: middle;"
                    />
                  </a>
                  <a href="${instagram}">
                    <img
                      src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/insta_olwhmd.png"
                      alt="Instagram"
                      width="30"
                      style="display: inline-block; vertical-align: middle;"
                    />
                  </a>
                </td>
              </tr>
            </table>
          </div>

        </div>
      </body>
    </html>`;

      // Configure Nodemailer transport
      const smtpTransport = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Email options
      const mailOptions = {
        to: userFound.email,
        from: `${webName} <${process.env.EMAIL_ADDRESS}>`,
        subject: "Your Email Has Been Verified Successfully!",
        html: emailMessage,
      };

      // Send the email
      await smtpTransport.sendMail(mailOptions);

      res.json({
        message: "OTP successfully verified, and confirmation email sent.",
        isAccountVerified: userFound.isAccountVerified,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//====================
// ADMIN USER INFO FETCHING
//====================
userRouter.get(
  "/info/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: "User Not Found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error fetching user information" });
    }
  })
);

//=====================
// ADMIN USER LIST FETCHING
//=====================
userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await User.find({}).sort("-createdAt");
      res.send(users);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

//=====================
// ADMIN USER LIST FETCHING - ONLY 10 USERS
//=====================
userRouter.get(
  "/limited",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await User.find({}).sort("-createdAt").limit(10); // Limit the result to 10 users
      res.send(users);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

//==================
// ADMIN USER DELETE
//==================
userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    // Prevent any user from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).send({ message: "Cannot delete yourself" });
    }

    // Restrict deletion of admin users unless the requester is Super Admin
    if (user.role === "admin" && !req.user.isAdmin) {
      return res.status(400).send({ message: "Cannot Delete Admin User" });
    }

    try {
      await User.deleteOne({ _id: req.params.id });
      res.send({ message: "User Deleted Successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

//=================
// ADMIN BLOCK USER
//=================
userRouter.put(
  "/block/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    // Prevent any user from blocking themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).send({ message: "Cannot block yourself" });
    }

    // Restrict blocking of admin users unless the requester is Super Admin
    if (user.role === "admin" && !req.user.isAdmin) {
      return res.status(400).send({ message: "Cannot Block Admin User" });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true, runValidators: true }
      );
      res.send(updatedUser);
    } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

//==================
// ADMIN UNBLOCK USER
//==================
userRouter.put(
  "/unblock/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    // Prevent any user from unblocking themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).send({ message: "Cannot unblock yourself" });
    }

    // Restrict unblocking of admin users unless the requester is Super Admin
    if (user.role === "admin" && !req.user.isAdmin) {
      return res.status(400).send({ message: "Cannot Unblock Admin User" });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true, runValidators: true }
      );
      res.send(updatedUser);
    } catch (error) {
      console.error("Error unblocking user:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

//=================
// ADMIN USER UPDATE
//=================
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.isAdmin = Boolean(req.body.isAdmin);
        user.isBlocked =
          req.body.isBlocked !== undefined
            ? Boolean(req.body.isBlocked)
            : user.isBlocked;

        const updatedUser = await user.save();
        res.send({
          message: "User Updated Successfully",
          user: updatedUser,
        });
      } else {
        res.status(404).send({ message: "User Not Found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error updating user" });
    }
  })
);

//===============
//Password Reset Token
//===============
userRouter.post(
  "/password-token",
  expressAsyncHandler(async (req, res) => {
    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const tiktok = process.env.TIKTOK_PROFILE_LINK;
    const webName = process.env.WEB_NAME;

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not Found");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();

      // HTML message
      const resetURL = `<html >
                <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                  }
                  .container {
                    width: 100%;
                    max-width: 600px;
                    margin: auto;
                  }
                  a { text-decoration: none; }
                  
                  .a_flex {
                    display: flex;
                    align-items: center;
                  }
                
                  .header {
                    background-color: #00463e;
                    height: 50px;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                  
                  .logo_img {
                    width: 100px;
                  }
                  .head {
                    flex-direction: column;
                    margin-top: 20px;
                  }
                  .email{
                    width:200px
                  }
                  .message_text {
                    padding: 0px 10px;
                  }
                  .message_text p {
                    color: #434343;
                    font-size: 15px;
                  }
                  .message_text .otp_box {
                    margin: -18px 0px;
                  }
                  .otp_box h2 {
                    background-color: #e7e7e7;
                    color: #3462fa;
                    padding: 5px 10px;
                    border-radius: 5px;
                    letter-spacing: 3px;
                    width: fit-content;
                  }
                  .out_greeting h5 {
                    line-height: 2px;
                    font-size: 15px;
                    color: #222222;
                  }
                  .footer {
                    border-top: 1px solid #a5a5a5;
                  }
                  .footer img {
                    width: 30px;
                  }
                  .footer p{
                    font-size: 16px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <table role="presentation" width="100%">
                    <tr>
                      <td align="center">
                        <img
                          src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730887212/logo_oodxma.png"
                          alt="logo"
                          width="100"
                          style="display: block;"
                        />
                      </td>
                    </tr>
                  </table>
                  </div>
                  <div class="body_text">
                    <div class="head ">
                      <table role="presentation" width="100%">
                      <tr>
                      <td align="center">
                        <img
                          src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/ed2_rwigks.png"
                          alt="email"
                          class="email"
                        />
                        </td>
                      
                      </tr>
                      <tr>
                        <td align="center">
                          <div class="head_text">
                          <h2>Reset Your Password</h2>
                          </div>
                        </td> 
                        </tr>
                      </table>
                    </div>
                    <div class="message_text">
                      <div class="greetings">
                        <h3>Hi ${user.firstName},</h3>
                      </div>
                      <div class="text">
                        <p>
                          You recently requested to reset your password. If you did not make this request, Kindly ignore this email.
                        </p>
                      
                        <p>
                         To reset your password, please click the button below.
                        </p>
                        <table role="presentation" width="100%" style="padding: -10px 0px; margin: -15px 0px;">
                         <tr>
                          <td align="center"  style="padding: -10px 0px; margin: -15px 0px;">
                           <a href=${`${process.env.SUB_DOMAIN}/${user.id}/new-password/${token}`} style="display: inline-block; margin: 8px 0; padding: 8px 30px; background-color: #00eacd; color: #000B09; text-decoration: none; border-radius: 4px;">Reset Password</a>
                         </td>
                        </tr>
                       </table>
                        </div>
                      <div class="out_greeting">
                        <h5>Regards,</h5>
                        <h5 class="closing">The ${webName} Team.</h5>
                      </div>
                    </div>
                  </div>
                  <div class="footer">
                    <table role="presentation" width="100%">
                      <tr>
                        <td align="left" style="padding: 10px;">
                          <p style="margin: 0;">Edquity by Outside Lab</p>
                        </td>
                        <td align="right" style="padding: 10px;">
                          <a href="${facebook}" style="margin-right: 10px;">
                            <img
                              src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886760/face_z4zb3n.png"
                              alt="Facebook"
                              width="30"
                              style="display: inline-block; vertical-align: middle;"
                            />
                          </a>
                          <a href="${instagram}">
                            <img
                              src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/insta_olwhmd.png"
                              alt="Instagram"
                              width="30"
                              style="display: inline-block; vertical-align: middle;"
                            />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>

                </div>
              </body>
            </html>`;

      const smtpTransport = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `${process.env.WEB_NAME} ${process.env.EMAIL_ADDRESS}`,
        to: email,
        subject: "Reset Password",
        html: resetURL,
      };
      // Send the email
      smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).json({ message: "Failed to send email" });
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).json({
            message: `A verification email has been successfully sent to ${user?.email}. Reset now within 10 minutes.`,
          });
        }
      });
    } catch (error) {
      res.send(error);
    }
  })
);

//===============
//Password Reset
//===============
userRouter.put(
  "/:id/reset-password",
  expressAsyncHandler(async (req, res) => {
    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;
    const webName = process.env.WEB_NAME;

    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Log token details for debugging
    console.log("Received Token:", token);
    console.log("Hashed Token:", hashedToken);

    try {
      // Find user by hashed token and check if token is still valid
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
      });

      if (!user) {
        console.log("Invalid token or token expired");
        return res.status(400).json({
          message: "Invalid token or token expired, please try again",
        });
      }

      // Check if the new password is the same as the old password
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return res.status(400).json({
          message: "New password cannot be the same as the old password",
        });
      }

      // Update user password
      user.password = bcrypt.hashSync(password, 10);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      const emailMessage = `<html >
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
          }
          a { text-decoration: none;
              color: #0062EA;
           }
         
          .a_flex {
            display: flex;
            align-items: center;
          }
       
          .header {
            background-color: #00463e;
            height: 50px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
         
          .logo_img {
            width: 100px;
          }
          .head {
            flex-direction: column;
          }
         .email{
            width: 110px;
            margin-top: 10px;
          }
          .message_text {
            padding: 0px 10px;
          }
          .message_text p {
            color: #434343;
            font-size: 15px;
          }
          .message_text .otp_box {
            margin: -18px 0px;
          }
          .otp_box h2 {
            background-color: #e7e7e7;
            color: #3462fa;
            padding: 5px 10px;
            border-radius: 5px;
            letter-spacing: 3px;
            width: fit-content;
          }
          .out_greeting h5 {
            line-height: 2px;
            font-size: 15px;
            color: #222222;
          }
          .footer {
            border-top: 1px solid #a5a5a5;
          }
          .footer img {
            width: 30px;
          }
          .footer p{
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <table role="presentation" width="100%">
            <tr>
              <td align="center">
                <img
                  src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730887212/logo_oodxma.png"
                  alt="logo"
                  width="100"
                  style="display: block;"
                />
              </td>
            </tr>
          </table>
          </div>
          <div class="body_text">
            <div class="head ">
             <table role="presentation" width="100%">
              <tr>
              <td align="center">
                <img
                  src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/ed3_y1xwb9.png"
                  alt="email"
                  class="email"
                />
               </td>
              
              </tr>
              <tr>
                <td align="center">
                 <div class="head_text">
                 <h2>Password Reset Complete</h2>
                 </div>
                </td> 
               </tr>
             </table>
            </div>
            <div class="message_text">
              <div class="greetings">
                <h3>Hi ${user.firstName},</h3>
              </div>
              <div class="text">
                <p>
                  The password for your Telex account has been successfully changed. You can now access your account  <a href=${`${process.env.SUB_DOMAIN}/lost-password`}>here</a>.
                </p>
                <p>
                 If you didn't change your password, please immediately reset your Telex account by clicking on the link: <a href=${`${process.env.SUB_DOMAIN}/lost-password`}>${
        process.env.SUB_DOMAIN
      }/lost-password</a>
                </p>
               
              </div>
              <div class="out_greeting">
                <h5>Regards,</h5>
                <h5 class="closing">The ${webName} Team.</h5>
              </div>
            </div>
          </div>
          <div class="footer">
            <table role="presentation" width="100%">
              <tr>
                <td align="left" style="padding: 10px;">
                  <p style="margin: 0;">Edquity by Outside Lab</p>
                </td>
                <td align="right" style="padding: 10px;">
                  <a href="${facebook}" style="margin-right: 10px;">
                    <img
                      src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886760/face_z4zb3n.png"
                      alt="Facebook"
                      width="30"
                      style="display: inline-block; vertical-align: middle;"
                    />
                  </a>
                  <a href="${instagram}">
                    <img
                      src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730886761/insta_olwhmd.png"
                      alt="Instagram"
                      width="30"
                      style="display: inline-block; vertical-align: middle;"
                    />
                  </a>
                </td>
              </tr>
            </table>
          </div>

        </div>
      </body>
    </html>`;

      // Configure Nodemailer transport
      const smtpTransport = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Email options
      const mailOptions = {
        to: user.email,
        from: `${webName} <${process.env.EMAIL_ADDRESS}>`,
        subject: "Password Reset Successful",
        html: emailMessage,
      };

      // Send the email
      await smtpTransport.sendMail(mailOptions);

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error during password reset:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

export default userRouter;
