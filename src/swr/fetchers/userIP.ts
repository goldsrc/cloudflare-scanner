import { type IPInfo } from "~/types";

export const fetchUserIPInfo = async (detectedIP = "") => {
  const res = await fetch(`https://freeipapi.com/api/json/${detectedIP}`);
  const ipInfo = (await res.json()) as IPInfo;
  return ipInfo;
};
