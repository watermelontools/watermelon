import Layout from '../components/Layout'
import '../styles/index.css'
import firebase from 'firebase';
import 'firebase/firestore';
import { useRouter } from 'next/router';

const firebaseConfig = {
  apiKey: "AIzaSyAxio45RoVcMHwwjYnl7-QcvTVzm46X7fk",
  authDomain: "watermelon-b6dd2.firebaseapp.com",
  projectId: "watermelon-b6dd2",
  storageBucket: "watermelon-b6dd2.appspot.com",
  messagingSenderId: "736231654320",
  appId: "1:736231654320:web:ca4e788e8ceca4a89a0c75"
}
let firebaseApp
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig)
}
const isLoggedIn = window?.localStorage?.getItem("sign_in_token");
const hasAddedToSlack = window?.localStorage?.getItem("add_to_slack_token");

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()
  if(!isLoggedIn) router.push("login")
  if(!hasAddedToSlack) router.push("welcome")
  return (
    <>
      <Layout isLoggedIn={isLoggedIn}>
        <Component {...pageProps} firebaseApp={firebaseApp} />
      </Layout>
    </>
  )
}

export default MyApp