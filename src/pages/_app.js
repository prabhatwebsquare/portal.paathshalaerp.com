// pages/_app.js
import useInactivityLogout from "@/constant/InactivityTimeout";
import { wrapper } from "@/store";
import "@/styles/globals.css";
import theme from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { useRef } from "react";

function App({ Component, pageProps }) {
  const timeoutRef = useRef(null);
  useInactivityLogout();

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

// Wrap the App component with the Redux wrapper for SSR support
export default wrapper.withRedux(App);
