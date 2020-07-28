import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as Mux from "@mux/mux-node";

admin.initializeApp();

// assume process.env.MUX_TOKEN_ID and process.env.MUX_TOKEN_SECRET contain your credentials
// @ts-ignore
const { Video } = new Mux();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest(
  (request: any, response: any) => {
    response.send("Hello from Firebase!");
  }
);

export const createLiveStream = functions.https.onCall((data, context) => {
  const userId = context?.auth?.uid || "";

  const userDocRef = admin
    .firestore()
    .collection("users")
    .doc(userId);

  const createStream = (streamKey: string) => {
    const dateStarted = new Date();
    const title = data?.title;
    return userDocRef
      .collection("streams")
      .add({
        dateStarted,
        title
      })
      .then(docRef => {
        userDocRef
          .collection("streams")
          .doc(docRef.id)
          .set(
            {
              uid: docRef.id
            },
            { merge: true }
          );
        return admin
          .database()
          .ref("streams/" + docRef.id)
          .set({
            dateStarted: dateStarted.getTime(),
            title,
            userId
          })
          .then(() => `success ${docRef.id}`);
      });
  };
  userDocRef
    .get()
    .then(doc => {
      if (doc.exists) {
        let streamKey = "";
        console.log("Document data:", doc.data());
        if (doc.data()?.muxLiveKey) {
          console.log(doc.data()?.muxLiveKey);
          streamKey = doc.data()?.muxLiveKey?.stream_key;
          createStream(streamKey);
        } else {
          Video.LiveStreams.create({
            playback_policy: ["public"],
            new_asset_settings: { playback_policy: ["public"] }
          }).then((res: any) => {
            streamKey = res.stream_key;
            userDocRef.set(
              {
                muxLiveKey: res
              },
              { merge: true }
            );
          });
        }
        createStream(streamKey);
      } else {
        console.log("No such document!");
      }
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
      return error;
    });
});

export const realtimeToRtmp = functions.database
  .ref("/streams/{streamId}/chunks")
  .onCreate((snap, context) => {
    console.log({ snap });
    console.log({ context });
    console.log("TEST");
  });
