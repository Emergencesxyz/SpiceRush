import { useState, useEffect } from "react";
import Web3 from "web3";
import contractAbi from "../../WalletHelpers/contractAbi.json";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../WalletHelpers/connectors";
import {
  useEagerConnect,
  useInactiveListener,
} from "../../WalletHelpers/hooks";

const ConnectWallet = () => {
  const { connector, account, activate, active, library } =
    useWeb3React<Web3>();
  const [activatingConnector, setActivatingConnector] = useState<any>();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);
};

export default ConnectWallet;
