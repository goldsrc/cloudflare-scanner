export function rangeToIpArray(range: string) {
  const parts = range.split("/");
  if (parts.length !== 2) {
    throw new Error(`Invalid IP Range format ${range} `);
  }
  const [ip, maskString] = parts as [string, string];
  const mask = parseInt(maskString, 10);
  const ipParts = ip.split(".");
  if (ipParts.length !== 4) {
    throw new Error("Invalid IP");
  }
  const [first, second, third, forth] = ipParts as [
    string,
    string,
    string,
    string
  ];

  const start =
    (parseInt(first, 10) << 24) |
    (parseInt(second, 10) << 16) |
    (parseInt(third, 10) << 8) |
    parseInt(forth, 10) |
    0; // convert to unsigned int
  const end = start | (0xffffffff >>> mask) | 0; // convert to unsigned int

  const ips: string[] = [];
  for (let i = start; i <= end; i++) {
    const ip = [
      (i >> 24) & 0xff,
      (i >> 16) & 0xff,
      (i >> 8) & 0xff,
      i & 0xff,
    ].join(".");
    ips.push(ip);
  }
  return ips;
}
