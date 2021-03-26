import Layout from "../components/Layout";
import "../styles/index.css";
import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyAxio45RoVcMHwwjYnl7-QcvTVzm46X7fk",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "watermelon-b6dd2.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "watermelon-b6dd2",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "watermelon-b6dd2.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "736231654320",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:736231654320:web:ca4e788e8ceca4a89a0c75",
};

// TODO: extract to env!
let firebaseApp;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}
const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Layout>
        <Component {...pageProps} firebaseApp={firebaseApp} />
      </Layout>
    </>
  );
};

export default MyApp;
