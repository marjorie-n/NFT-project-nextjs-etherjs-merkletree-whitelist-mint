import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import Countdown from "../Countdown/Countdown";
import styles from "../../src/styles/Home.module.css";

const Before = (props) => {
  return (
    <Flex direction="column" className={styles.start} align="center">
      <Text mb="2rem" fontSize="2rem" fontWeight="bold" align="center">
        Whitelist mint starts in :
      </Text>
      <Countdown
        saleStartTime={props.saleStartTime}
        getDatas={props.getDatas}
      />
    </Flex>
  );
};

export default Before;
