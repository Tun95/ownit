import express from "express";
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";

const sendEmailRouter = express.Router();

//Send News Letter email
sendEmailRouter.post(
  "/send",
  // isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { subject, message } = req.body;

    const facebook = process.env.FACEBOOK_PROFILE_LINK;
    const instagram = process.env.INSTAGRAM_PROFILE_LINK;

    try {
      // Retrieve all email addresses from the database
      const allUsers = await User.find({});

      // Check if there are subscribers
      if (allUsers.length === 0) {
        // Respond to the client indicating that there are no subscribers
        return res.status(400).json({ message: "No subscribers found" });
      }

      // Extract email addresses into an array
      const mailList = allUsers.map((user) => user.email);

      // Create a SMTP transport for sending emails
      const smtpTransport = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASS,
        },
      });

      const webname = process.env.WEB_NAME;

      // Your email template
      // const emailMessageWithUnsubscribe = `
      //   <html>
      //    <head>
      //     <style>
      //       body {
      //         font-family: Arial, sans-serif;
      //       }
           
      //       p {
      //         margin-bottom: 16px;
      //       }
      //       .anchor {
      //         display: inline-block;
      //         padding: 10px 20px;
      //         background-color: #007BFF;
      //         color: #FFFFFF !important;
      //         text-decoration: none;
      //         border-radius: 4px;
      //       }
      //         .footer {
      //             margin-top: 20px;
                  
      //           }
      //         .footer_info {
      //             color: #666;
      //             margin: 10px 0;
      //           }
      //             a{
      //             text-decoration: none;
      //             }
               
      //           .social-icons {
      //             margin-top: 10px;
      //             display: flex;
      //             align-items: center;
      //           }
      //           .social-icon {
      //             margin: 0 5px;
      //             font-size: 24px;
      //             color: #333;
      //             display: flex;
      //             gap: 10px;
      //           }
      //           .icons{
      //             width:23px;
      //             height: 23px;
      //           }
      //           .instagram{
      //             margin-top:2px;
      //             width:20px;
      //             height: 20px;
      //             padding:0px 6px;
      //             }
      //           .tik{
      //             width: 23px;
      //             height: 23px;
      //             }
      //     </style>
      //   </head>
      //     <body>
      //       <div class="container">
      //         <div class="content">
      //           ${message}
                
      //         </div>
      //         <hr/>
      //           <p class="footer_info">For more information, visit our website:</p>
      //           <p class="footer_info url_link"><a href="${process.env.SUB_DOMAIN}">${process.env.SUB_DOMAIN}</a></p>
      //           <div class="social-icons d_flex">
      //           <a href=${facebook} class="social-icon">
      //             <img
      //               class="icons"
      //               src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730788740/facebook_e2bdv6_xjbjcj.png"
      //               alt="Facebook"
      //             />
      //           </a>
      //           <a href=${instagram} class="social-icon">
      //             <img
      //               class="icons instagram"
      //               src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730788019/insta_xnz8ru.png"
      //               alt="Instagram"
      //             />
      //           </a>
      //           <a href=${twitter} class="social-icon">
      //             <img
      //               class="icons tik"
      //               src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730788019/twit_gbrknm.png"
      //               alt="Twitter"
      //             />
      //           </a>
      //         </div>
      //       </div>
      //     </body>
      //   </html>
      // `;

      const emailMessageWithUnsubscribe = `<html >
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
            <div class="message_text">
              <div class="text">
                <div class="content">
                ${message}
               </div>   
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

      // Configure mail options
      const mailOptions = {
        to: [], // Add your "to" email addresses here if needed
        bcc: mailList, // Use bcc for sending to multiple recipients
        from: `${webname} ${process.env.EMAIL_ADDRESS}`,
        subject,
        html: emailMessageWithUnsubscribe,
      };

      // Send the email
      await smtpTransport.sendMail(mailOptions);

      // Respond to the client
      res.send("Mail sent to " + mailList);
      console.log("Mail sent to " + mailList);
    } catch (err) {
      console.error(err);
      req.flash(
        "error",
        "We seem to be experiencing issues. Please try again later."
      );
      res.redirect("/");
    }
  })
);

export default sendEmailRouter;
