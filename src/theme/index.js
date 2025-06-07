import { getLocalStorageItem } from "@/utils/LocalStorage";
import { extendTheme } from "@chakra-ui/react";

const themeColor = getLocalStorageItem("themeColor") || "blue";

const theme = extendTheme({
  styles: {
    global: {
      ".chakra-table": {
        width: "100%",
        borderCollapse: "collapse",
      },
      ".chakra-table th, .chakra-table td": {
        padding: 2,
        border: "1px solid #ddd",
      },
      ".chakra-table th": {
        fontFamily: "Manrope, sans-serif",
        fontWeight: "bold",
        fontSize: 11,
        backgroundColor: `${themeColor}.400`,
        color: "white",
      },
      ".chakra-table td": {
        fontSize: 13,
        fontWeight: "semibold",
        fontFamily: "Manrope, sans-serif",
      },
    },
  },
});

export default theme;
