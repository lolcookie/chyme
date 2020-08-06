import firebase from 'firebase'
import React, { useEffect, useState } from 'react'

const firebaseConfig = {
  apiKey: 'AIzaSyBd44OjubSb8o8aA97OjppjRUvA-v98USw',
  authDomain: 'chyme-b6c35.firebaseapp.com',
  databaseURL:
    process.env.NODE_ENV === 'development'
      ? `http://localhost:9000?ns=chyme-b6c35`
      : 'https://chyme-b6c35.firebaseio.com',
  projectId: 'chyme-b6c35',
  storageBucket: 'chyme-b6c35.appspot.com',
  messagingSenderId: '1049084196941',
  appId: '1:1049084196941:web:39d7c8a25002245ca44404',
  measurementId: 'G-3NZ98NSVJN',
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

var provider = new firebase.auth.GoogleAuthProvider()
provider.addScope('profile')
provider.addScope('email')

const firestoreDb = firebaseApp.firestore()
const functions = firebaseApp.functions()

if (process.env.NODE_ENV === 'development') {
  console.log('DEVELOPMENT')
  functions.useFunctionsEmulator(`http://localhost:5001`)
  firestoreDb.settings({
    host: `localhost:8080`,
    ssl: false,
  })
}

export const createLiveStream = functions.httpsCallable('createLiveStream')

export interface AuthUser {
  displayName: string
  email: string
  uid: string
}

export const useAuth = () => {
  const [authUser, setAuthUser] = useState<AuthUser | null>()
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(function (user) {
      setIsAuthLoading(false)
      if (user) {
        // User is signed in.
        var displayName = user.displayName || 'Anon'
        var email = user.email || 'no-email'
        var uid = user.uid

        setAuthUser({
          displayName,
          email,
          uid,
        })

        firestoreDb.collection('users').doc(uid).set(
          {
            displayName,
            email,
            uid,
          },
          { merge: true }
        )
      } else {
        setAuthUser(null)
      }
    })
  }, [])

  const signIn = () =>
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result: any) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken
        // The signed-in user info.
        var user = result.user
        // ...
      })
      .catch(console.error)

  const signOut = () => firebase.auth().signOut()

  return { authUser, signIn, signOut, isAuthLoading }
}

export interface MuxLiveKey {
  stream_key: string
}

export const useMuxLiveKey = (userId: string) => {
  const [muxLiveKey, setMuxLiveKey] = useState<MuxLiveKey | null>()
  const [isMuxLiveKeyLoading, setIsMuxLiveKeyLoading] = useState(true)
  useEffect(() => {
    firestoreDb
      .collection('muxLiveKeys')
      .doc(userId)
      .onSnapshot((doc) => {
        //@ts-ignore
        setMuxLiveKey(doc.data())
        console.log({ MuxLiveKeyDoc: doc.data() })
        setIsMuxLiveKeyLoading(false)
      })
  }, [userId])
  return { muxLiveKey, isMuxLiveKeyLoading }
}
