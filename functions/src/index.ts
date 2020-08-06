import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as Mux from '@mux/mux-node'

admin.initializeApp()

// assume process.env.MUX_TOKEN_ID and process.env.MUX_TOKEN_SECRET contain your credentials
// @ts-ignore
const { Video } = new Mux()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest(
  (request: any, response: any) => {
    response.send('Hello from Firebase!')
  }
)

export const createLiveStream = functions.https.onCall((data, context) => {
  const userId = context?.auth?.uid || ''
  console.log({ userId })
  const muxLiveKeyDocRef = admin
    .firestore()
    .collection('muxLiveKeys')
    .doc(userId)
  muxLiveKeyDocRef
    .get()
    .then((doc) => {
      if (doc.exists && doc.data()?.muxLiveKey) {
        return 'key already exists'
      } else {
        return Video.LiveStreams.create({
          playback_policy: ['public'],
          new_asset_settings: { playback_policy: ['public'] },
        }).then((res: any) => {
          return muxLiveKeyDocRef.set(res).then(() => 'key created')
        })
      }
    })
    .catch(function (error) {
      console.log('Error getting document:', error)
      return error
    })
})
