import React, { useState } from "react";
import useEthersProvider from "../../hook/useEthersProvider";
import Contract from "../../public/NFTCryptoAstro.json";
import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import tokens from "../../../back/tokens";
import keccak256 from "keccak256";
import {
  Flex,
  Text,
  Spinner,
  Button,
  useToast,
  Image,
  Heading,
  chakra,
} from "@chakra-ui/react";

const WhitelistMint = (props) => {
  const { account, provider, setAccount } = useEthersProvider();
  const [isMinting, setIsMinting] = useState(false);

  const toast = useToast();
  const contractAddress = "0x72a6AfA989F4906fb3ecbBB534321FB8Cf4cC063";

  const mint = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
    console.log(signer);

    let tab = [];
    tokens.map((token) => {
      tab.push(token.address);
    });

    let leaves = tab.map((address) => keccak256(address));
    let tree = new MerkleTree(leaves, keccak256, { sort: true });

    let leaf = keccak256(account);
    let proof = tree.getHexProof(leaf);

    let overrides = {
      value: ethers.utils.parseEther("0.002"),
    };
    try {
      setIsMinting(true);
      let mint = await contract.whiteListMint(account, 1, proof, overrides);
      await mint.wait();
      toast({
        title: "Transaction confirmed 🤩",
        description: "Your NFT is on the way",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "top-accent",
      });
      setIsMinting(false);
      props.getDatas(); // on récupère le totalSupply
    } catch (error) {
      toast({
        title: "Transaction failed 😵",
        description: "You can't mint an NFT",
        status: "info",
        duration: 5000,
        isClosable: true,
        variant: "top-accent",
      });
      setIsMinting(false);
      console.log(error);
    }
  };

  return (
    <>
      {isMinting ? (
        <Flex justify="center" align="center" mt="2rem">
          <Spinner />
          <Text fontSize={["1.5rem", "2rem", "2.5rem", "3rem"]} ml="1rem">
            Processing mint...
          </Text>
        </Flex>
      ) : props.totalSupply >= props.maxWhitelist ? (
        <Text fontSize={["1.5rem", "2rem", "2.5rem", "3rem"]} mt="2rem">
          Whitelist sale is SOLD OUT
        </Text>
      ) : (
        <Flex direction={["column", "column", "row", "row"]}>
          <Flex
            width={["100%", "100%", "50%", "50%"]}
            direction="column"
            align="center"
            justify={"center"}
          >
            <Heading as="h1" fontSize={["2rem", "2rem", "3rem", "4rem"]}>
              Whitelist sale
            </Heading>
            <Text mt="2rem" fontSize="2rem">
              <chakra.span fontWeight="bold">NFTs SOLD: </chakra.span>
              <chakra.span color="blue.400">{props.totalSupply}</chakra.span>/{" "}
              {props.maxWhitelist}
            </Text>
            <Text mt="1rem" fontSize="2rem">
              <chakra.span fontWeight="bold">Price: </chakra.span>
              <chakra.span color="blue.400">0.002 ETH</chakra.span> / NFT
            </Text>
            <Button mt="2rem" onClick={mint} colorScheme="blue" width="200px">
              Mint
            </Button>
          </Flex>
          <Flex
            width={["100%", "100%", "50%", "50%"]}
            align="center"
            justify="center"
            mt={["2rem", "2rem", "0", "0"]}
          >
            <Image src="/astronauts.png" alt="astronauts NFTs" width="60%"></Image>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default WhitelistMint;
