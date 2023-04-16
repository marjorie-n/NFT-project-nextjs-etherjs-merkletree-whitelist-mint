import { Flex, Link, chakra } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex
      as="footer"
      w="100%"
      align="center"
      justify="center"
      bg="gray.800"
      color="white"
      direction={["column", "row"]}
      px={[4, 8]}
      py={[8, 12]}
    >
      <chakra.span mr={2} mb={[2, 0]}>
        &copy; {new Date().getFullYear()} Crypto Astro, made with ❤️ by{" "}
      </chakra.span>
      <Flex align="center">
        <Link
          href="https://www.alyra.fr/"
          color="purple.400"
          target="_blank"
          rel="noopener noreferrer"
          mr={2}
        >
          Alyra
        </Link>
        <chakra.span>|</chakra.span>
        <Link
          href="https://www.linkedin.com/in/marjorie-ngoupende-dev/"
          color="purple.400"
          target="_blank"
          rel="noopener noreferrer"
          ml={2}
        >
          @Marjorie
        </Link>
      </Flex>
    </Flex>
  );
};

export default Footer;
