const mongoose = require("mongoose");
const { google } = require("googleapis");
// Connect to MongoDB
function connect() {
  mongoose
    .connect(
      "mongodb+srv://nguyenphatssj0612:s8xZNFRib12rM7kj@csdlthktcnweb.z79w7bu.mongodb.net/?retryWrites=true&w=majority&appName=csdlthktcnweb",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Failed to connect to MongoDB", error);
    });
}
// Google Drive API
function drive() {
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    "10126963541-cf37hhl3o0l4tkg4iquto9uinbr2oajg.apps.googleusercontent.com",
    "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",
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token:
      "1//04i42AVvfa845CgYIARAAGAQSNwF-L9IriRTByxjseQEeM-2ItNAWZ6N2XiQJNucXKdfUlnUWVxxmIVdpiMIP3-s4OTrsJet2Xtw",
  });

  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });
  return drive;
}
module.exports = { connect, drive };
