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
    const twitter = process.env.TWITTER_PROFILE_LINK;

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
      const emailMessageWithUnsubscribe = `
        <html>
         <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
           
            p {
              margin-bottom: 16px;
            }
            .anchor {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007BFF;
              color: #FFFFFF !important;
              text-decoration: none;
              border-radius: 4px;
            }
              .footer {
                  margin-top: 20px;
                  
                }
              .footer_info {
                  color: #666;
                  margin: 10px 0;
                }
                  a{
                  text-decoration: none;
                  }
               
                .social-icons {
                  margin-top: 10px;
                  display: flex;
                  align-items: center;
                }
                .social-icon {
                  margin: 0 5px;
                  font-size: 24px;
                  color: #333;
                  display: flex;
                  gap: 10px;
                }
                .icons{
                  width:23px;
                  height: 23px;
                }
                .instagram{
                  margin-top:2px;
                  width:20px;
                  height: 20px;
                  padding:0px 6px;
                  }
                .tik{
                  width: 23px;
                  height: 23px;
                  }
          </style>
        </head>
          <body>
            <div class="container">
              <div class="content">
                ${message}
                
              </div>
              <hr/>
                <p class="footer_info">For more information, visit our website:</p>
                <p class="footer_info url_link"><a href="${process.env.SUB_DOMAIN}">${process.env.SUB_DOMAIN}</a></p>
                <div class="social-icons d_flex">
                <a href=${facebook} class="social-icon">
                  <img
                    class="icons"
                    src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730788740/facebook_e2bdv6_xjbjcj.png"
                    alt="Facebook"
                  />
                </a>
                <a href=${instagram} class="social-icon">
                  <img
                    class="icons instagram"
                    src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730788019/insta_xnz8ru.png"
                    alt="Instagram"
                  />
                </a>
                <a href=${twitter} class="social-icon">
                  <img
                    class="icons tik"
                    src="https://res.cloudinary.com/dtvwnonbi/image/upload/v1730788019/twit_gbrknm.png"
                    alt="Twitter"
                  />
                </a>
              </div>
            </div>
          </body>
        </html>
      `;

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
