import React, { useState, useEffect } from "react";
import { Flex, Text, useToast, Spinner } from "@chakra-ui/react";
import Layout from "../../components/Layout/Layout";
import Contract from "../../public/NFTCryptoAstro.json";
import useEthersProvider from "../../hook/useEthersProvider";
import { ethers } from "ethers";

import Before from "../../components/Before/Before";
import WhitelistMint from "../../components/Whitelistmint/WhitelistMint";
import Between from "../../components/Between/Between";
import PublicMint from "../../components/Publicmint/PublicMint";
import Finished from "../../components/Finished/Finished";
import Reveal from "../../components/Reveal/Reveal";

export default function Home() {
  const { account, provider, setAccount } = useEthersProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(null);
  const [saleStartTime, setSaleStartTime] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  const toast = useToast();
  const contractAddress = "0x72a6AfA989F4906fb3ecbBB534321FB8Cf4cC063";

  const maxSupply = 500;
  const maxGift = 5;
  const maxWhitelist = 125;
  const maxPublic = 370;

  useEffect(() => {
    if (account) {
      getDatas();
    }
  }, [account]);

  const getDatas = async () => {
    setIsLoading(true);
    const contract = new ethers.Contract(
      contractAddress,
      Contract.abi,
      provider
    );

    //step
    const step = await contract.getStep();
    setStep(step);

    //sale start time
    const saleStartTime = await contract.saleStartTime();
    setSaleStartTime(saleStartTime.toNumber()); //convertir bignumber en number pour afficher la date en timestamp

    //total supply
    const totalSupply = await contract.totalSupply();
    setTotalSupply(totalSupply.toNumber());
    setIsLoading(false);
  };

  return (
    <>
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
          fontFamily={"Roboto Mono"}
        >
          {isLoading ? (
            <Spinner />
          ) : account ? (
            <>
              {(() => {
                switch (step) {
                  case 0:
                    return (
                      <Before
                        saleStartTime={saleStartTime}
                        getDatas={getDatas}
                      />
                    );
                  case 1:
                    return (
                      <WhitelistMint
                        getDatas={getDatas}
                        totalSupply={totalSupply}
                        maxWhitelist={maxWhitelist}
                      />
                    );
                  case 2:
                    return (
                      <Between
                        getDatas={getDatas}
                        saleStartTime={saleStartTime + 24 * 3600 + 10}
                      />
                    );
                  case 3:
                    return (
                      <PublicMint
                        getDatas={getDatas} // récupérer les données de la blockchain
                        totalSupply={totalSupply} // récupérer le nombre de token mint
                        maxPublic={maxWhitelist + maxPublic} // récupérer le nombre max de token public
                      />
                    );
                  case 4:
                    return (
                      <Finished
                        getDatas={getDatas}
                        revealStartTime={saleStartTime + 216 * 3600 + 10}
                      />
                    );
                  case 5:
                    return <Reveal />;
                  default:
                    return <Text>An error occurred</Text>;
                }
              })()}
            </>
          ) : (
            <Text fontSize="2rem" fontFamily="Roboto Mono" align="center">
              Connect your wallet to continue ! 🤩
            </Text>
          )}
        </Flex>
      </Layout>
    </>
  );
}
