import Head from "next/head";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Head>
        <title>Apinator</title>
        <meta name="description" content="Apinator page" />
        <link rel="icon" href="/favicon_golem.png" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZH6N1L9LGN"
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
