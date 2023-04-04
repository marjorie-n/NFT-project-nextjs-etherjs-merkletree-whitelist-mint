import React, { useState, useEffect } from "react";
import useEthersProvider from "../../hook/useEthersProvider";
import Contract from "../../../back/artifacts/contracts/NFTCryptoAstro.sol/NFTCryptoAstro.json";
import { ethers } from "ethers";
import Layout from "../../components/Layout/Layout";
import { Flex, Spinner, Text } from "@chakra-ui/react";

// Afficher un texte si l'utilissteur possède des NFTs de la collection
// utiliser fonction tokensOfOwner()

const specialAccess = () => {
  const [hasNFTs, setHasNFTs] = useState(false);
  const { account, provider } = useEthersProvider();
  const [isLoading, setIsLoading] = useState([]); // spinner pour afficher le chargement

  const contractAddress = "0x72a6AfA989F4906fb3ecbBB534321FB8Cf4cC063";

  //user connected
  useEffect(() => {
    if (account) {
      getDatas();
    }
  }, [account]);

  const getDatas = async () => {
    setIsLoading(true); // cherche les données
    // access contract
    const contract = new ethers.Contract(
      contractAddress,
      Contract.abi,
      provider // récuperer les données
    );

    let hasNFTs = await contract.tokensOfOwner(account); // recuperer id nfts de l'utilisateur
    // console.log(hasNFTs);
    setHasNFTs(hasNFTs); // récuperer les nfts dans le state
    setIsLoading(false); // arrêter le spinner
  };

  return (
    <>
      <link rel="icon" href="/favicon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Francois+One&display=swap"
        rel="stylesheet"
      ></link>

      <Layout>
        <Flex
          direction="column"
          align="center"
          justify="center"
          w="100%"
          h="85vh"
        >
          {account ? (
            isLoading ? (
              <Spinner />
            ) : hasNFTs.length > 0 ? (
              <Text fontSize="2rem" mb="2rem" align="center">
                Congratulations!🎉 You own NFTs from the collection.
              </Text>
            ) : (
              <Text fontSize="2rem" mb="2rem" align="center">
                You don't have any NFTs 🥺 from the collection.
              </Text>
            )
          ) : (
            <Text fontSize="2rem" mb="2rem" align="center">
              Connect your wallet to see your NFTs 😉.
            </Text>
          )}
        </Flex>
      </Layout>
    </>
  );
};

export default specialAccess;
