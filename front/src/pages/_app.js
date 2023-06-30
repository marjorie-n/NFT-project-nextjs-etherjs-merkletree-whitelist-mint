import { EthersProvider } from "../../context/ethersProviderContext";
import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
export default function App({ Component, pageProps }) {
  return (
    <EthersProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </EthersProvider>
  );
}
