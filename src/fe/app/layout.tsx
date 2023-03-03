import { Maven_Pro } from "@next/font/google";
import { cookies } from "next/headers";

import ThemeProvider from "../components/theme-provider/theme-provider";

import "./styles.css";

const mavenPro = Maven_Pro({ subsets: ["latin"] });

const CustomApp = ({ children }) => {
  const { value: theme } = cookies().get("theme") || {};

  return (
    <html className={mavenPro.className}>
      <body>
        <ThemeProvider theme={theme === "dark" ? "dark" : "light"}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export const metadata = {
  title: "Mailstream",
  description: "Hello World! Mailstream is coming soon...",
};

export default CustomApp;
