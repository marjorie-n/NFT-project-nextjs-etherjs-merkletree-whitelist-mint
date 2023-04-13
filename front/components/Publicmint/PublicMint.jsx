import React, { useState } from "react";
import useEthersProvider from "../../hook/useEthersProvider";
import Contract from "../../public/NFTCryptoAstro.json";
import { ethers } from "ethers";
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

const PublicMint = (props) => {
  const { account, provider, setAccount } = useEthersProvider();
  const [isMinting, setIsMinting] = useState(false);
  const toast = useToast();

  const contractAddress = "0x72a6AfA989F4906fb3ecbBB534321FB8Cf4cC063";

  const mint = async (quantity) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Contract.abi, signer);

    let overrides = {
      value: ethers.utils.parseEther("5").mul(quantity),
    };
    try {
      setIsMinting(true);
      let mint = await contract.publicMint(account, quantity, overrides);
      await mint.wait();
      toast({
        title: "Congrulations!🎉",
        description: "You have just minted an NFT",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "top-accent",
      });
      setIsMinting(false);
      props.getDatas();
    } catch (error) {
      toast({
        title: "An occured error 😵",
        description: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "top-accent",
      });
      setIsMinting(false);
      // console.log(error);
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
      ) : props.totalSupply >= props.maxPublic ? (
        <Text fontSize={["1.5rem", "2rem", "2.5rem", "3rem"]}>
          Public sale is sold out
        </Text>
      ) : (
        <Flex direction={["column", "column", "row", "row"]}>
          <Flex
            width={["100%", "100%", "50%", "50%"]}
            direction="column"
            align="center"
            justify="center"
          >
            <Heading as="h1" fontSize={["2rem", "2rem", "3rem", "4rem"]}>
              Public sale
            </Heading>
            <Text mt="2rem" fontSize="2rem">
              <chakra.span fontWeight="bold">NFTs SOLD: </chakra.span>
              <chakra.span color="blue.400">
                {props.totalSupply}
              </chakra.span>/ {props.maxPublic}
            </Text>
            <Text mt="1rem" fontSize="2rem">
              <chakra.span fontWeight="bold">Price: </chakra.span>
              <chakra.span color="blue.400">5 MATIC*</chakra.span> / NFT
            </Text>
            <Text mt="1rem" fontSize="2rem">
              <chakra.span color="gray.300" fontSize={"1rem"}>
                *Mumbai testnet MATIC
              </chakra.span>
            </Text>
            <Flex
              pl="2rem"
              pr="2rem"
              justify="space-between"
              align="center"
              width={["100%", "80%", "100%", "75%"]}
            >
              <Button
                mt="2rem"
                onClick={() => mint(1)}
                colorScheme="blue"
                width="100px"
              >
                1 NFT
              </Button>
              <Button
                mt="2rem"
                onClick={() => mint(2)}
                colorScheme="blue"
                width="100px"
              >
                2 NFT
              </Button>
              <Button
                mt="2rem"
                onClick={() => mint(3)}
                colorScheme="blue"
                width="100px"
              >
                3 NFT
              </Button>
            </Flex>
          </Flex>
          <Flex
            width={["100%", "100%", "50%", "50%"]}
            align="center"
            justify="center"
            mt={["2rem", "2rem", "0", "0"]}
          >
            <Image
              src="/astronauts.png"
              alt="astronauts NFTs"
              width="60%"
            ></Image>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default PublicMint;
