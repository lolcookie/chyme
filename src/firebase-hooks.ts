import firebase from "firebase";
import React, { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBd44OjubSb8o8aA97OjppjRUvA-v98USw",
  authDomain: "chyme-b6c35.firebaseapp.com",
  databaseURL: "https://chyme-b6c35.firebaseio.com",
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

interface User {
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
