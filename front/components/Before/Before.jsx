import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import Countdown from "../Countdown/Countdown"

const Before = (props) => {
  return (
    <Flex direction="column">
      <Text mb="2rem" fontSize="2rem" fontWeight="bold" align="center">
        Whitelist mint starts in :
      </Text>
      <Countdown saleStartTime={props.saleStartTime} getDatas={props.getDatas} />
    </Flex>
  );
};

export default Before;
