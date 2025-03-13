import { google } from "googleapis";

const credentialsJson = Buffer.from(
  process.env.CREDENTIALS_JSON_BASE64!,
  "base64",
).toString("utf-8");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(credentialsJson),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

export default auth;
