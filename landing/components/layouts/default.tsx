import Head from "next/head";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Head>
        <title>Spice Rush</title>
        <meta name="description" content="Apinator page" />
        <link rel="icon" href="/faviconSpiceRush.svg" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-40CDCTP9RQ"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZH6N1L9LGN', { page_path: window.location.pathname });
            `,
          }}
        />
      </Head>

      <main>{children}</main>

      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
}
