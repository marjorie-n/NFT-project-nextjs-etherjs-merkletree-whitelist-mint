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
    >
      <chakra.span>
        &copy; {new Date().getFullYear()} Crypto Astro, <Link
          href="https://www.alyra.fr/"
          color="purple.400"
          ml={{ base: 0, md: 2 }}
          target = "_blank"
        >
        Alyra</Link>, made with ❤️ by{" "}
      </chakra.span>
      <Link
        href="https://www.linkedin.com/in/marjorie-ngoupende-dev/"
        color="purple.400"
        ml={{ base: 0, md: 2 }}
        target = "_blank"
      >
        &nbsp;@Marjorie
      </Link>
    </Flex>
  );
};

export default Footer;
