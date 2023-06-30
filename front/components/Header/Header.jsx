import { useState } from "react";
import React from "react";
import styles from "../../src/styles/Home.module.css";
import {
  Flex,
  Text,
  Button,
  useToast,
  Spinner,
  Image,
  Icon,
} from "@chakra-ui/react";
import { hasMetamask } from "../../utils/hasMetamask";
import useEthersProvider from "../../hook/useEthersProvider";
import specialAccess from "../../src/pages/specialAccess";
import { ethers } from "ethers";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { account, provider, setAccount } = useEthersProvider();
  const toast = useToast();

  const connectWallet = async () => {
    if (hasMetamask()) {
      setIsLoading(true);
      if (provider) {
        let network = await provider.getNetwork();

        //mumbai network
        if (network.chainId == 80001) {
          const resultAccount = await provider.send("eth_requestAccounts", []);
          setAccount(ethers.utils.getAddress(resultAccount[0]));
          setIsLoading(false);

          toast({
            title: "Congratulations!",
            description: "Your wallet is connected successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            variant: "top-accent",
          });
        } else {
          toast({
            title: "Error",
            description: "Please connect to the Mumbai network",
            status: "error",
            duration: 5000,
            isClosable: true,
            variant: "top-accent",
          });
        }
      }
    }
  };
  return (
    <Flex
      width="100%"
      justify="space-between"
      alignItems="center"
      padding="1.5rem"
      mb="1rem"
    >
      <Text>
        <Link href="/">
          <Image
            className={styles.logo}
            src="/fuse.png"
            alt="Fuse logo"
            width="100px"
            height="100px"
          />
        </Link>
      </Text>

      <Flex justify="space-between" align="center" width="100px">
        <Link href="/mint">mint nft</Link>
      </Flex>

      <Flex>
        <Link href="/specialAccess">special</Link>
      </Flex>

      {isLoading ? (
        <Spinner />
      ) : account ? (
        <Flex alignItems="center">
          <Link
            href="https://github.com/marjorie-n/NFT-project-nextjs-etherjs-merkletree-whitelist-mint"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className={styles.github} as={FaGithub} color="white" boxSize={6} mr={3} />
          </Link>
          <Text as="span" color="white" fontWeight="bold">
            Wallet:
            {account && account.slice(0, 5) + "..." + account.slice(-4)}
          </Text>
        </Flex>
      ) : (
        <Flex alignItems="center">
          <Link
            className={styles.github}
            href="https://github.com/marjorie-n/NFT-project-nextjs-etherjs-merkletree-whitelist-mint"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className={styles.github} as={FaGithub} color="white" boxSize={6} mr={3} />
          </Link>

          <Button
            className={styles.button}
            onClick={connectWallet}
            colorScheme="blue"
          >
            Connect wallet
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
