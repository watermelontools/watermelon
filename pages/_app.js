import Layout from '../components/Layout'
import '../styles/index.css'

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp