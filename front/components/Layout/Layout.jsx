import { Flex } from "@chakra-ui/react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { css } from "@emotion/react";

const starsBackground = css`
  background-image: linear-gradient(
    to left,
    rgba(121, 40, 202, 0.8),
    rgba(255, 0, 128, 0.8)
  );
  background-repeat: no-repeat;
  background-size: cover;
`;

const Layout = (props) => {
  return (
    <Flex
      direction="column"
      width="100%"
      css={starsBackground}
      color="white"
      fontFamily="roboto mono"
    >
      <Header />
      <Flex flex="1" width="100%" justify="center" align="center">
        {props.children}
      </Flex>
      <Footer />
    </Flex>
  );
};

export default Layout;
