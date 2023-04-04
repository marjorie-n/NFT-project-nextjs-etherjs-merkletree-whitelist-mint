import React from "react";
import Countdown from "../Countdown/Countdown";
import { Flex, Text } from "@chakra-ui/react";

const Finished = (props) => {
  return (
    <Flex direction="column">
      <Text fontSize="2rem" mb="2rem" align="center">
        Public sale is finished, reveal is in:
      </Text>
      <Countdown
        saleStartTime={props.revealStartTime}
        getDatas={props.getDatas}
      />
    </Flex>
  );
};

export default Finished;
