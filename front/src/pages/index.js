import { Text, Flex, Heading, Image, chakra } from "@chakra-ui/react";
import Layout from "../../components/Layout/Layout";

export default function Home() {
  return (
    <>
      <title>Crypto Astro</title>
      <meta name="description" content="crypto astro nft dapp" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <Flex direction={["column", "column", "row", "row"]} w="100%" h="85vh">
          <Flex
            width={["100%", "100%", "50%", "50%"]}
            direction="column"
            align="center"
            justify={"center"}
            fontFamily={"Roboto Mono"}
          >
            <Heading
              as="h1"
              fontSize={["2rem", "2rem", "3rem", "4rem"]}
              fontFamily={"Francois One"}
            >
              Crypto Astro
            </Heading>
            <Text mt="2rem" fontSize="2rem">
              <chakra.span fontWeight="bold">
                Collect Crypto Astro NFTs:
              </chakra.span>
            </Text>
            <Text mt="1rem" fontSize="2rem">
              <chakra.span fontWeight="bold">Explore the galaxy🪐</chakra.span>
            </Text>
            <Text mt="1rem" fontSize="2rem">
              <chakra.span fontWeight="bold">
                On the Polygon blockchain✨
              </chakra.span>
            </Text>
          </Flex>
          <Flex
            width={["100%", "100%", "50%", "50%"]}
            align="center"
            justify="center"
            mt={["2rem", "2rem", "0", "0"]}
          >
            <Image
              src="https://res.cloudinary.com/defpadn0s/image/upload/v1680449623/cryto_astro-home_mtls9f.png"
              alt="astronauts"
              width="50%"
            ></Image>
          </Flex>
        </Flex>
      </Layout>
    </>
  );
}
