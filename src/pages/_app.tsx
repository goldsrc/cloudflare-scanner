import { type AppType } from "next/dist/shared/lib/utils";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";
import { localStorageProvider } from "~/swr/cacheProviders/localstorage";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <div className={`h-full ${inter.className}`}>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </SWRConfig>
  );
};

export default MyApp;
