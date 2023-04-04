import React from "react";
import { Flex, Text, Button, a } from "@chakra-ui/react";
import Link from "next/link";

const Reveal = () => {
  return (
    <Flex direction="column">
      <Text align="center" fontSize="2rem" mb="2rem">
        The NFTs have been revealed!🪄
      </Text>

      <Flex justify={"center"}>
        <Link
          legacyBehavior
          href="https://testnets.opensea.io/fr/collection/crypto-astro-1"
        >
          <a target="_blank">
            <Button colorScheme="blue">Go on OpenSea!</Button>
          </a>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Reveal;
