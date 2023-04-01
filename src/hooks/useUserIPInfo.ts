import useSWR from "swr";
import { fetchUserIPInfo } from "~/fetchers/userIP";

export const useUserIPInfo = () => {
  const swr = useSWR("ipInfo", () => fetchUserIPInfo(), {
    revalidateOnFocus: false,
    fallbackData: {
      ipVersion: 0,
      ipAddress: "0.0.0.0",
      latitude: 0,
      longitude: 0,
      countryName: "-",
      countryCode: "-",
      timeZone: "+00:00",
      zipCode: "00000",
      cityName: "-",
      regionName: "-",
    },
  });

  return {
    loading: (!swr.data && !swr.error) || swr.isValidating,
    error: swr.error as unknown,
    ipInfo: swr.data,
  };
};
