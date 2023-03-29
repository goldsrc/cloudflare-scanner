import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const dirname = path.dirname(fileURLToPath(import.meta.url));

const url =
  "https://raw.githubusercontent.com/vfarid/cf-ip-scanner-py/main/cf-ipv4.txt";
const filename = path.join(dirname, "./consts/ip-ranges.json");

https
  .get(url, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const lines = data.split("\n");
      const json = JSON.stringify(
        lines.flatMap((line) => {
          const lineTrimmed = line.trim();
          if (lineTrimmed.length > 0) return [lineTrimmed];
          return [];
        })
      );
      fs.writeFile(filename, json, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`File Updated: ${filename}`);
        }
      });
    });
  })
  .on("error", (err) => {
    console.error(err);
  });
