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
    const tiktok = process.env.TIKTOK_PROFILE_LINK;

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

      // Add unsubscribe link to the end of the email message
      const unsubscribeLink = `${process.env.SUB_DOMAIN}/unsubscribe`;
      const shopName = process.env.SHOP_NAME;

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
                }
                .icons{
                  width:25px;
                  height: 25px;
                }
                .instagram{
                  margin-top:2px;
                  width:22px;
                  height: 22px;
                  }
                .tik{
                  width: 26px;
                  height: 26px;
                  }
          </style>
        </head>
          <body>
            <div class="container">
              <div class="content">
                ${message}
                
              </div>
              <hr/>
              <div class="footer">
                <p>If you wish to unsubscribe from our newsletter, <a href="${unsubscribeLink}">click here</a>.</p>
              <div class="unsubscribe">
                <p><a href="${unsubscribeLink}">Unsubscribe</a> from our newsletter</p>
              </div>
                <p class="footer_info">For more information, visit our website:</p>
                <p class="footer_info url_link"><a href="${process.env.SUB_DOMAIN}">${process.env.SUB_DOMAIN}</a></p>
                <div class="social-icons">
                <a href=${facebook} class="social-icon">
                  <img
                    class="icons"
                    src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1693399098/facebook_e2bdv6.png"
                    alt="Facebook"
                  />
                </a>
                <a href=${instagram} class="social-icon">
                  <img
                    class="icons instagram"
                    src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1715681997/instagram_iznt7t.png"
                    alt="Instagram"
                  />
                </a>
                <a href=${tiktok} class="social-icon">
                  <img
                    class="icons tik"
                    src="https://res.cloudinary.com/dstj5eqcd/image/upload/v1715681756/tiktok_y8dkwy.png"
                    alt="Tiktok"
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
        from: `${shopName} ${process.env.EMAIL_ADDRESS}`,
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
