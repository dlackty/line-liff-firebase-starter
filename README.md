# LIFF v2 starter app with Firebase

This repo shows you how to connect Firebase Custom Auth with LINE LIFF.

## Deploy method

We use Firebase Hosting to host the LIFF application, obviously.

### Prerequisite

You need to create a Firebase project with:

1. `firebase functions:config:set liff.id=YOUR_LIFF_ID line.channel_id=YOUR_CHANNEL_ID`
2. [Enable IAM API](https://console.developers.google.com/apis/api/iam.googleapis.com/overview?project=686085416329)
3. Because of Cloud Function's restriction, you need to enter billing info to enable external network access for LINE's APIs

### Deployment

Use following commands:

```bash
firebase init
firebase deploy
```

## Credit and License

This project is derived from LINE's official [line-liff-v2-starter](https://github.com/line/line-liff-v2-starter) project but with major rewrite to demo Firebase integration.