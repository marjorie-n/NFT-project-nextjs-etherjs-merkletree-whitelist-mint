import React, { useState, useEffect } from "react";
import { hasMetamask } from "../utils/hasMetamask";
import { ethers } from "ethers";

const EthersContext = React.createContext(null);

export const EthersProvider = ({ children }) => {
  const [account, setAccount] = useState(null); // Compte connecté
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (hasMetamask()) {
      // chain changed
      window.ethereum.on("chainChanged", () => {
        setAccount(null);
        setProvider(new ethers.providers.Web3Provider(window.ethereum));
      });

      // account changed
      window.ethereum.on("accountsChanged", () => {
        setAccount(null);
        setProvider(new ethers.providers.Web3Provider(window.ethereum));
      });
      // disconnect
      window.ethereum.on("disconnect", () => {
        setAccount(null);
        setProvider(new ethers.providers.Web3Provider(window.ethereum));
      });
    }
  });

  useEffect(() => {
    if (hasMetamask()) {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, []);

  return (
    <EthersContext.Provider
      value={{
        account,
        provider,
        setAccount,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
};

export default EthersContext;
