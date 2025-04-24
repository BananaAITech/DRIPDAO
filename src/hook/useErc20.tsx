import { Abi,  } from "viem";
import { read, write } from "./utils";
import { LP_TOKEN_ABI, LP_TOKEN_ADDRESS } from "../config/config";

export function useErc20() {
  const approve = async (
    tokenAddress: string,
    spender: string,
    amount: bigint
  ) => {
    return await write({
      address: tokenAddress as `0x${string}`,
      abi: LP_TOKEN_ABI as Abi,
      functionName: "approve",
      args: [spender, amount],
    });
  };

  const balanceOf = async (accountAddress: string) => {
    return await read({
      address: LP_TOKEN_ADDRESS,
      abi: LP_TOKEN_ABI as Abi,
      functionName: 'balanceOf',
      args: [accountAddress]
    })
  };

  const totalSupply = async () => {
    return await read({
      address: LP_TOKEN_ADDRESS,
      abi: LP_TOKEN_ABI as Abi,
      functionName: 'totalSupply',
    })
  };

  return {
    approve,
    balanceOf,
    totalSupply
  };
}