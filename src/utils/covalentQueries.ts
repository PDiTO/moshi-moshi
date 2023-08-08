export async function getNFTsForAddress(address: string) {
  //   let headers = new Headers();
  //   headers.set("Authorization", "Bearer cqt_rQwfj8kXXQKgXrmCFMcXvRHMKRkx");

  //   fetch(
  //     "https://api.covalenthq.com/v1/eth-mainnet/address/0x3df822003C1B974fAB42dB7CB4Da929AFede4613/balances_nft/?",
  //     { method: "GET", headers: headers }
  //   )
  //     .then((resp) => resp.json())
  //     .then((data) => console.log(data));

  let headers = new Headers();
  headers.set("Authorization", "Bearer cqt_rQwfj8kXXQKgXrmCFMcXvRHMKRkx");

  fetch(
    "https://api.covalenthq.com/v1/eth-mainnet/address/0x2e266194A00C1001ab891B9E185a63b3fF314e73/balances_v2/?nft=true",
    { method: "GET", headers: headers }
  )
    .then((resp) => resp.json())
    .then((data) => {
      return data.data.items.filter((item: any) => item.type === "nft");
    });
}
