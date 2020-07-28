import firebase from "firebase";
import React, { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBd44OjubSb8o8aA97OjppjRUvA-v98USw",
  authDomain: "chyme-b6c35.firebaseapp.com",
  databaseURL:
    process.env.NODE_ENV === "development"
      ? `https://9000-${window.location.host.slice(
          5,
          window.location.host.length
        )}?ns=chyme-b6c35`
      : "https://chyme-b6c35.firebaseio.com",
  projectId: "chyme-b6c35",
  storageBucket: "chyme-b6c35.appspot.com",
  messagingSenderId: "1049084196941",
  appId: "1:1049084196941:web:39d7c8a25002245ca44404",
  measurementId: "G-3NZ98NSVJN"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("profile");
provider.addScope("email");

const firestoreDb = firebaseApp.firestore();
const functions = firebaseApp.functions();
const realtimeDb = firebaseApp.database();

if (process.env.NODE_ENV === "development") {
  functions.useFunctionsEmulator(
    `https://5001-${window.location.host.slice(5, window.location.host.length)}`
  );
  firestoreDb.settings({
    host: `https://8080-${window.location.host.slice(
      5,
      window.location.host.length
    )}`
  });
}

export const createLiveStream = functions.httpsCallable("createLiveStream");

export interface User {
  displayName: string;
  email: string;
  uid: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(function(user) {
      setIsAuthLoading(false);
      if (user) {
        // User is signed in.
        var displayName = user.displayName || "Anon";
        var email = user.email || "no-email";
        var uid = user.uid;

        setUser({
          displayName,
          email,
          uid
        });

        firestoreDb
          .collection("users")
          .doc(uid)
          .set({
            displayName,
            email,
            uid
          });
      } else {
        setUser(null);
      }
    });
  }, []);

  const signIn = () =>
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result: any) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      })
      .catch(console.error);

  const signOut = () => firebase.auth().signOut();

  return { user, signIn, signOut, isAuthLoading };
};

export interface UserStream {
  dateStarted: string;
  title: string;
  uid: string;
  chunks?: any[];
}

export const useUserStreams = (userId: string) => {
  const [userStreams, setUserStreams] = useState<UserStream[] | null>();
  const [isUserStreamsLoading, setIsUserStreamsLoading] = useState(true);
  useEffect(() => {
    firestoreDb
      .collection("users")
      .doc(userId)
      .collection("streams")
      .get()
      .then(docs => {
        let data: UserStream[] = [];
        setIsUserStreamsLoading(false);
        docs.forEach(doc => {
          //@ts-ignore
          data.push(doc.data());
        });
        //@ts-ignore
        setUserStreams(data);
      });
  }, []);
  return { userStreams, isUserStreamsLoading };
};

export const pushRealtimeChunk = (streamId: string, data: any) => {
  const chunkRef = realtimeDb.ref(`/streams/${streamId}/chunks`);
  console.log(data);
  const newChunkRef = chunkRef.push();
  return data
    .text()
    .then((res: string) => newChunkRef.set(res).then(console.log));
};
