import { type AppType } from "next/dist/shared/lib/utils";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={`h-full ${inter.className}`}>
      <Component {...pageProps} />
      <Toaster />
    </div>
  );
};

export default MyApp;
