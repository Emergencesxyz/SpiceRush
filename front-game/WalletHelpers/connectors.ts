import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const RPC_URLS: { [chainId: number]: string } = {
  1: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213" as string,
  4: "https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213" as string,
  5: "http://localhost:8545" as string,
  80001:
    "https://polygon-mumbai.g.alchemy.com/v2/6j-ZilfKa2UuNRqpqH1upg3jYl_FH0_R" as string,
  137: "https://polygon-mainnet.g.alchemy.com/v2/e1_GmDaAKAqFl4HPuV9bZBEq5l7fdJEY",
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 5, 80001, 137],
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: RPC_URLS[1],
    4: RPC_URLS[4],
    5: RPC_URLS[5],
    80001: RPC_URLS[80001],
    137: RPC_URLS[137],
  },
  qrcode: true,
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[80001],
  appName: "web3-react example",
  supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001],
});
