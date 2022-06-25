import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Assistant:300,400,600"
            rel="stylesheet"
          />
          <meta
            name="google-site-verification"
            content="ePB1GvvA8L5Hza96sGcmDLw_jIzjhQ2JhXbIAg_8hlA"
          />
          <script
            async="async"
            src="https://www.googletagmanager.com/gtag/js?id=UA-164774604-1"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "UA-164774604-1");`,
            }}
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
