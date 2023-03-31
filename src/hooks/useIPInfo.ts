import { useState, useEffect, useCallback } from "react";
import axios, { type AxiosResponse } from "axios";

type IPInfo = {
  country_code: string;
  country_name: string;
  city: string;
  postal: number;
  latitude: number;
  longitude: number;
  IPv4?: string;
  IPv6?: string;
  state: string;
};

const useIPInfo = () => {
  const [ipInfo, setIPInfo] = useState<IPInfo>({
    country_code: "",
    country_name: "",
    city: "",
    postal: 0,
    latitude: 0,
    longitude: 0,
    state: "",
  });

  const getIPInfo = useCallback<() => Promise<AxiosResponse<IPInfo>>>(
    () => axios.get("https://geolocation-db.com/json/"),
    []
  );

  useEffect(() => {
    getIPInfo()
      .then((data) => {
        setIPInfo(data.data);
      })
      .catch(() => {
        return;
      });
  }, [getIPInfo]);

  return { ipInfo };
};

export { useIPInfo };
