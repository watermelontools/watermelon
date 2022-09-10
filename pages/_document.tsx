import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html
        style={{
          backgroundColor: "rgba(13,17,23,0)",
        }}
      >
        <Head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/favicon/site.webmanifest"></link>
          <link
            rel="shortcut icon"
            href="/favicon/favicon.ico"
            type="image/x-icon"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
