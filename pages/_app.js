import Layout from "../components/Layout";
import "../styles/index.css";

function handleWebVitals(metric) {
  return {
    ...metric,
    startTime: Math.round(metric.startTime),
    value: Math.round(metric.value),
  };
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
