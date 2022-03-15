import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layouts/default";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

function getLibrary(provider: any): Web3 {
  return new Web3(provider);
}

function Apinator({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3ReactProvider>
  );
}

export default Apinator;
