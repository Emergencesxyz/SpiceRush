import Head from "next/head";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Head>
        <title>Spice Rush</title>
        <meta name="description" content="Spice Rush page" />
        <link rel="icon" href="/faviconSpiceRush.svg" />
      </Head>

      <main>{children}</main>
    </>
  );
}
