import * as functions from "firebase-functions";
import * as Mux from '@mux/mux-node'; 

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

export const startLiveStream = functions.https.onRequest(
  (request: any, response: any) => {
      Video.LiveStreams.create({
          "playback_policy": ["public"], "new_asset_settings": { "playback_policy": ["public"] } 
      }).then((res: any) => 
          response.send(res)
      )
  }
);
