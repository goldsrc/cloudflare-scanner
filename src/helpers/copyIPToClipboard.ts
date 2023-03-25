import { toast } from "react-hot-toast";
export async function copyIPToClipboard(ip: string) {
  try {
    await navigator.clipboard.writeText(ip);
    toast.success(`IP ${ip} copied to clipboard!`);
  } catch (error) {
    toast.error(`Failed to copy IP ${ip} to clipboard!`);
    console.error(error);
  }
}
