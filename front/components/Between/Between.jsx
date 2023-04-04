import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import Countdown from "../Countdown/Countdown";

const Between = (props) => {
  return (
    <Flex direction="column" align="center" justify="center">
      <Text
        fontSize={["1.5rem", "2rem", "2.5rem", "3rem"]}
        align="center"
        mb="2rem"
      >
        White list sale is finished and public sale will starts in:
      </Text>
      <Countdown
        saleStartTime={props.saleStartTime}
        getDatas={props.getDatas}
      />
    </Flex>
  );
};

export default Between;
