import React, { useState, useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";

const Countdown = (props) => {
  const [countdownInfos, setCountdownInfos] = useState({});

  useEffect(() => {
    getCountdown();
  }, []);

  const getCountdown = () => {
    setInterval(function () {
      let unixTime = (props.saleStartTime + 10) * 1000;
      let date_future = new Date(unixTime);
      let date_now = new Date();

      let seconds = Math.floor((date_future - date_now) / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);

      hours = hours - days * 24;
      minutes = minutes - days * 24 * 60 - hours * 60;
      seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

      if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
        props.getDatas();

        let countdownInfos = {
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        };
        setCountdownInfos(countdownInfos);
      }
    }, 1000);
  };

  return (
    <Flex justify="center">
      <Flex justify="space-between" w={["300px", "400px", "600px", "600px"]}>
        <Flex direction="column" align="center">
          <Text fontSize={["2rem", "2rem", "5rem", "5rem"]} fontWeight="bold">
            {countdownInfos.days}
          </Text>
          <Text mt="1rem">Days</Text>
        </Flex>
        <Flex direction="column" align="center">
          <Text fontSize={["2rem", "2rem", "5rem", "5rem"]} fontWeight="bold">
            {countdownInfos.hours}
          </Text>
          <Text mt="1rem">Hours</Text>
        </Flex>
        <Flex direction="column" align="center">
          <Text fontSize={["2rem", "2rem", "5rem", "5rem"]} fontWeight="bold">
            {countdownInfos.minutes}
          </Text>
          <Text mt="1rem">Minutes</Text>
        </Flex>
        <Flex direction="column" align="center">
          <Text fontSize={["2rem", "2rem", "5rem", "5rem"]} fontWeight="bold">
            {countdownInfos.seconds}
          </Text>
          <Text mt="1rem">Seconds</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Countdown;
