import { read, write } from "./utils";
import { STAKING_CONTRACT_ABI, STAKING_CONTRACT_ADDRESS } from "../config/config";

export function useStaking() {
  const stake = async (
    amount: bigint,
    duration: bigint
  ) => {
    return write({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'stake',
      args:[amount, duration]
    })
  }

  const claim = async (
    stakedId: bigint,
  ) => {
    return write({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'claim',
      args:[stakedId]
    })
  }

  const withdraw = async (
    stakedId: bigint,
  ) => {
    return write({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'withdraw',
      args:[stakedId]
    },
    )
  }

  const userInfo = async (accountAddress: string, stakedId: bigint) => {
    return await read({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'userInfo',
      args: [accountAddress, stakedId]
    })
  };

  const pending = async (accountAddress: string, stakedId: bigint) => {
    return await read({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'pendingDrip',
      args: [accountAddress, stakedId]
    })
  };

  const earnedDrip = async (accountAddress: string) => {
    return await read({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'earnedDrip',
      args: [accountAddress]
    })
  };

  const currentStakedId = async (accountAddress: string) => {
    return await read({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'currentStakedId',
      args: [accountAddress]
    })
  };
  
  const userStakedAmount = async (accountAddress: string) => {
    return await read({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'stakedAmount',
      args: [accountAddress]
    })
  };

  const maxLockDuration = async () => {
    return await read({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'maxLockDuration',
    })
  };

  const boostWeight = async () => {
    return await read({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'BOOST_WEIGHT',
    })
  };

  return {
    stake,
    claim,
    withdraw,
    userInfo,
    pending,
    earnedDrip,
    currentStakedId,
    userStakedAmount,
    maxLockDuration,
    boostWeight
  };
}