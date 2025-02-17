export const createPurchaseConfirmationEmail = (assetName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          background: linear-gradient(135deg, #40b3e5 0%, #1e4b9e 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .logo {
          max-width: 300px;
          margin-bottom: 40px;
        }
        .title {
          font-size: 32px;
          margin-bottom: 30px;
        }
        .message {
          font-size: 20px;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .cta-button {
          background-color: #e94dad;
          color: white;
          padding: 15px 40px;
          text-decoration: none;
          border-radius: 30px;
          display: inline-block;
          margin: 30px 0;
          font-size: 18px;
          font-weight: bold;
        }
        .partners {
          margin-top: 60px;
        }
        .partners-title {
          font-size: 24px;
          margin-bottom: 30px;
        }
        .social-links {
          margin-top: 40px;
        }
        .footer {
          font-size: 14px;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="[YOUR_LOGO_URL]" alt="FIFA COLLECT" class="logo">
        
        <div class="title">Congratulations!</div>
        
        <div class="message">
          You are the proud new owner of ${assetName}.
        </div>
        
        <div class="message">
          The asset is being transferred to your FIFA Collect wallet and is now available for viewing in your collection.
        </div>
        
        <a href="[YOUR_COLLECTION_URL]" class="cta-button">VIEW YOUR COLLECTION</a>
        
        <div class="partners">
          <div class="partners-title">FIFA PARTNERS</div>
          <!-- Add partner logos here -->
        </div>
        
        <div class="social-links">
          <div class="partners-title">JOIN THE COMMUNITY</div>
          <!-- Add social media icons/links here -->
        </div>
        
        <div class="footer">
          Modex Tech Ltd, 57/63 Line Wall Road Gibraltar GX11 1AA, Gibraltar, Gibraltar
        </div>
      </div>
    </body>
    </html>
  `;
};
