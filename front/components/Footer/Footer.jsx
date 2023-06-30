import { Flex, Link, Text } from "@chakra-ui/react";

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
      px={[1, 2]}
      py={[2, 3]}
      flexWrap="wrap"
      textAlign="center"
      margin="0 auto"
    >
      <Text mr={2} mb={[2, 0]}>
        &copy; {new Date().getFullYear()} Crypto Astro, made with ❤️ by{" "}
      </Text>
      <Flex align="center">
        <Link
          href="https://www.linkedin.com/in/marjorie-ngoupende-dev/"
          color="purple.400"
          target="_blank"
          rel="noopener noreferrer"
          ml={2}
          _hover={{ textDecoration: "none", color: "pink.500" }}
        >
          @Marjorie
        </Link>
        <Link
          href="https://www.alyra.fr/"
          color="purple.400"
          target="_blank"
          rel="noopener noreferrer"
          mx={2}
          _hover={{ textDecoration: "none", color: "pink.500" }}
        >| Alyra
        </Link>
      </Flex>
    </Flex>
  );
};

export default Footer;
