import { CovalentTokenData } from "@/types/covalentTypes";
import axios from "axios";

export async function getNFTsForAddress(address: string) {
  let headers = new Headers();
  headers.set(
    "Authorization",
    `Bearer ${process.env.NEXT_PUBLIC_COVALENT_KEY}`
  );

  fetch(
    "https://api.covalenthq.com/v1/eth-mainnet/address/0x2e266194A00C1001ab891B9E185a63b3fF314e73/balances_v2/?nft=true",
    { method: "GET", headers: headers }
  )
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
    });
}

export async function getTokensForAddress(
  address: string
): Promise<CovalentTokenData> {
  const headers = {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_COVALENT_KEY}`,
  };

  const response = await axios.get(
    `https://api.covalenthq.com/v1/eth-mainnet/address/${address}/balances_v2/`,
    { headers: headers }
  );

  const rawData = response.data.data;
  const itemsArray = Object.values(rawData.items);

  return {
    ...rawData,
    items: itemsArray,
  };
}
