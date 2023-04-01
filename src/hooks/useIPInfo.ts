import { useState, useEffect, useCallback } from "react";
import axios, { type AxiosResponse } from "axios";

type IPInfo = {
  ipVersion: number;
  ipAddress: string;
  latitude: number;
  longitude: number;
  countryName: string;
  countryCode: string;
  timeZone: string;
  zipCode: string;
  cityName: string;
  regionName: string;
};

const useIPInfo = () => {
  const [ipInfo, setIPInfo] = useState<IPInfo>({
    ipVersion: 0,
    ipAddress: "Loading...",
    latitude: 0,
    longitude: 0,
    countryName: "",
    countryCode: "",
    timeZone: "",
    zipCode: "",
    cityName: "",
    regionName: "",
  });

  const getIPInfo = useCallback<() => Promise<AxiosResponse<IPInfo>>>(
    () => axios.get("https://freeipapi.com/api/json"),
    []
  );

  useEffect(() => {
    getIPInfo()
      .then((response) => {
        setIPInfo(response.data);
      })
      .catch(() => {
        setIPInfo((currentState) => {
          return {
            ...currentState,
            ipAddress: "Failed to load IP info.",
          };
        });
      });
  }, [getIPInfo]);

  return { ipInfo };
};

export { useIPInfo };
