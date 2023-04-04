import "@/styles/globals.css";
import { EthersProvider } from "../../context/ethersProviderContext";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
  return (
    <EthersProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </EthersProvider>
  );
}
