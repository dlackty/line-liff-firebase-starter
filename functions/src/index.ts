import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

const myLiffId = functions.config().liff.id;
const myLineChannelId = functions.config().line.channel_id;

const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendId = functions.https.onRequest((_, res) => {
  res.json({ id: myLiffId });
});

export const createCustomToken = functions.https.onRequest(async (req, res) => {
  try {
    const customAuthToken = await verifyLineToken(req.body.access_token);
    res.send({
      firebase_token: customAuthToken,
    });
  } catch (err) {
    res.status(403).send({
      error_message: `Authentication error: ${err}`,
    });
  }
});

async function verifyLineToken(access_token: string) {
  const resp = await fetch(
    `https://api.line.me/oauth2/v2.1/verify?access_token=${access_token}`
  );
  const jsonResponse = await resp.json();
  if (jsonResponse.client_id !== myLineChannelId) {
    throw new Error(
      `LINE channel ID mismatched ${JSON.stringify(jsonResponse)}`
    );
  }
  const profileResponse = await fetch("https://api.line.me/v2/profile", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const profileJsonResponse = await profileResponse.json();
  const userRecord = await getFirebaseUser(profileJsonResponse);
  return admin.auth().createCustomToken(userRecord.uid);
}

async function getFirebaseUser(body: any) {
  const firebaseUid = `line:${body.userId}`;

  try {
    const userRecord = await admin.auth().getUser(firebaseUid);
    return userRecord;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return admin.auth().createUser({
        uid: firebaseUid,
        displayName: body.displayName,
        photoURL: body.pictureUrl,
      });
    }
    return Promise.reject(error);
  }
}
