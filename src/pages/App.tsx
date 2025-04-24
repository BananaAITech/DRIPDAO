import Header from "../components/Header";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import StakeModal from "../components/StakeModal";

import { useAccount } from "wagmi";
import { STAKING_CONTRACT_ADDRESS } from "../config/config";
import { formatEther } from "viem";
import { useStaking } from "../hook/useStaking";
import { useErc20 } from "../hook/useErc20";
import StakeInfo from "../components/StakeInfo";

function App() {
  const { isConnected, address } = useAccount();
  const {
    userInfo,
    pending,
    currentStakedId,
    earnedDrip,
    boostWeight
  } = useStaking();
  const { balanceOf } = useErc20();
  const [isStake, setIsStake] = useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  const [userLpBalance, setUserLpBalance] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [earnedAmt, setEarnedAmt] = useState(0);
  const [weight, setWeight] = useState(0);

  const [userStakeAmount, setUserStakeAmount] = useState<number[]>([]);
  const [pendingDrip, setPendingDrip] = useState<number[]>([]);
  const [endTime, setEndTime] = useState<number[]>([]);
  const [times, setTimes] = useState<number[]>([]);

  const openStakeModal = (stake: boolean) => {
    setIsStake(stake);
    setIsStakeModalOpen(true);
  };

  const closeStakeModal = () => {
    setIsStakeModalOpen(false);
  };

  const getPrice = () => {
    let interval = setInterval(() => {
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=drip-network&vs_currencies=usd"
      )
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
          }
          return resp.json();
        })
        .then((json) => {
          // @ts-ignore
          console.log("========DRIP Price========", json["drip-network"].usd);
          setPrice(json["drip-network"].usd);
        })
        .catch((e) => {
          console.log(e);
        });
        
      getUserInfo();
    }, 7000);
    return interval;
  };

  const getUserInfo = async () => {
    console.log("Get userinfo ...");

    if (address) {
      const pendingDrips: number[] = [];
      const userStakeAmounts: number[] = [];
      const endTimes: number[] = [];
      const stakedItems: number[] = [];

      const staked = await currentStakedId(address);
      const infoBal = await balanceOf(address);
      const infoTotal = await balanceOf(STAKING_CONTRACT_ADDRESS);
      const earnedInfo = await earnedDrip(address);
      const weightInfo = await boostWeight();

      for (let i = 0; i < Number(staked); i++) {
        stakedItems.push(i);
        const userInfos = await userInfo(address, BigInt(i));
        const pendingInfos = await pending(address, BigInt(i));

        if (userInfos) {
          // @ts-ignore
          userStakeAmounts.push(Number(formatEther(userInfos[0])));

          const now = Math.floor(Date.now() / 1000);
          // @ts-ignore
          const until = Number(userInfos[4]) - now;
          if (until > 0) endTimes.push(Math.ceil(until / 86400));
          else endTimes.push(0);
        }
        if (pendingInfos) {
          // @ts-ignore
          pendingDrips.push(Number(formatEther(pendingInfos)));
        }
      }
      if (infoTotal) {
        // @ts-ignore
        setStakedAmount(Number(formatEther(infoTotal)));
      }
      if (infoBal) {
        // @ts-ignore
        setUserLpBalance(Number(formatEther(infoBal)));
      }
      if (earnedInfo) {
        // @ts-ignore
        setEarnedAmt(Number(formatEther(earnedInfo)));
      }
      
      if (weightInfo) {
        // @ts-ignore
        setWeight(Number(formatEther(weightInfo, "gwei")) / 1000);
      }

      setPendingDrip(pendingDrips);
      setUserStakeAmount(userStakeAmounts);
      setEndTime(endTimes);
      setTimes(stakedItems);
    }
  };

  useEffect(() => {
    console.log("isConnected ", isConnected);
    if (isConnected && address) {
      getUserInfo();
    }
  }, [isConnected, address]);

  useEffect(() => {
    let interval = getPrice();
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Header />
      <StakeModal
        isOpen={isStakeModalOpen}
        isStake={isStake}
        weight={weight}
        stakedAmount={stakedAmount}
        onClose={closeStakeModal}
        userStakeAmt={userStakeAmount[0]}
        userLpBal={userLpBalance}
      >
        <div className="flex justify-between bg-gray-200 rounded-t-[32px] p-6">
          <div className="flex font-bold text-[20px]">
            {isStake ? `Stake in Pool` : `Unstake`}
          </div>
          <div className="flex">
            <button onClick={closeStakeModal}>X</button>
          </div>
        </div>
      </StakeModal>

      <main className="fixed w-full h-screen">
        <div className="block max-w-[1200px] h-screen mx-auto mt-10">
          <h1 className="text-[48px] font-bold my-6">
            DRIP-BNB LP Staking Pools
          </h1>
          <h1 className="text-[24px] font-bold my-6">
            Just stake DRIP-BNB LP tokens to earn. <br />
          </h1>
          <div className="border rounded-2xl border-[#00000030] overflow-hidden">
            <div className="px-6 py-4 h- bg-white">
              <div className="flex items-start flex-wrap">
                <div className="flex items-center gap-2 w-1/4">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-300">
                    <img src="/drip-network.png"></img>
                  </div>
                  <div className="">
                    <h5 className="font-bold text-xl">Earn DRIP</h5>
                    <p className="text-sm font-medium">
                      Stake{" "}
                      <span className="text-pink-400 font-bold">
                        DRIP-BNB LP
                      </span>
                    </p>
                  </div>
                </div>
                <div className="w-1/6">
                  <p className="text-sm leading-4 font-medium">DRIP Earned</p>
                  <p className="text-xl leading-6 opacity-80 font-bold">
                    {isConnected ? `${earnedAmt.toFixed(4)}` : `--`}
                  </p>
                  <p className="text-sm leading-4">
                    {" "}
                    {isConnected
                      ? `~${(price * earnedAmt).toFixed(3)}`
                      : `--`}{" "}
                    USD
                  </p>
                </div>
                <div className="w-1/4">
                  <p className="text-sm leading-4 font-medium">Total Staked</p>
                  <p className="text-xl leading-6 font-bold">
                    {isConnected ? `${stakedAmount.toFixed(4)}` : `--`} DRIP-BNB
                    LP
                  </p>
                </div>
                <div className="w-1/3">
                  <button
                    onClick={() => {
                      openStakeModal(true);
                    }}
                    className="block m-auto mt-2 bg-green-600 hover:bg-green-700 text-white px-10 py-2 text-[18px] font-bold rounded-md uppercase shadow-lg"
                  >
                    Stake
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-200 border-t-2 h-[calc(100vh-380px)] border-gray-50 flex">
              <div className="w-[200px]">
                <a
                  href="#"
                  className="font-medium hover:underline"
                  target="_blank"
                >
                  <div className="flex items-center mt-2 gap-2 text-sm text-green-600">
                    Twitter <FaExternalLinkAlt className="w-3 h-3" />
                  </div>
                </a>
                <a
                  href="#"
                  className="font-medium hover:underline"
                  target="_blank"
                >
                  <div className="flex items-center mt-2 gap-2 text-sm text-green-600">
                    Telegram <FaExternalLinkAlt className="w-3 h-3" />
                  </div>
                </a>
              </div>

              <div className="w-[calc(100%-240px)] ml-10 flex flex-col">
                <div className="max-h-screen w-full overflow-y-scroll">
                  {times.map((item) => (
                    <StakeInfo
                      pendingDrip={pendingDrip[item]}
                      price={price}
                      userStakeAmount={userStakeAmount[item]}
                      stakeId={item}
                      endTime={endTime[item]}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
