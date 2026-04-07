import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:5173/oauth2callback';

if (!CLIENT_ID || CLIENT_ID.includes('PASTE')) {
    console.error("Missing Google GCP credentials in .env.local!");
    process.exit(1);
}

// 1. Initialize the Google OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// 2. Define the exact permissions we need from the user
const scopes = [
  'https://www.googleapis.com/auth/webmasters.readonly' // Read-only access to their Google Search Console data
];

/**
 * Generates the "Log In With Google" URL
 */
function generateAuthUrl() {
    const url = oauth2Client.generateAuthUrl({
        // 'offline' gets us a refresh token so the user doesn't have to log in every single day
        access_type: 'offline', 
        scope: scopes,
        prompt: 'consent'
    });

    console.log("\n🔗 -- OAUTH INTEGRATION SUCCESS --\n");
    console.log("Your Google Client is configured properly!");
    console.log("When a user clicks 'Connect Google Search Console' in your SaaS, direct them to this exact link:\n");
    console.log(url);
    console.log("\nWhen they log in, Google will redirect them back to your localhost callback link with a massive 'code' parameter in the URL.");
}

// Run the generator
generateAuthUrl();
