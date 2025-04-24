// Modal.tsx
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { useErc20 } from "../hook/useErc20";
import { useStaking } from "../hook/useStaking";
import { parseEther } from "viem";
import { LP_TOKEN_ADDRESS, STAKING_CONTRACT_ADDRESS } from "../config/config";
import LoadingModal from "./LoadingSpinner";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  isStake: boolean;
  userStakeAmt: number;
  userLpBal: number;
  weight: number;
  stakedAmount: number;
  onClose: () => void;
  children: ReactNode;
}

const StakeModal: React.FC<ModalProps> = ({
  isOpen,
  isStake,
  userStakeAmt,
  userLpBal,
  weight,
  stakedAmount,
  onClose,
  children,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [multiplier, setMultiplier] = useState(1);
  const [apr, setApr] = useState(0);
  const { approve } = useErc20();
  const { withdraw, stake } = useStaking();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(1);
  
  useEffect(() => {
    const boostMul = 1 + (1 * 7 * 86400) * weight / (365 * 86400);
    const cApr = 5 / (1 + weight) * boostMul;
  
    setApr(cApr);
    setMultiplier(boostMul);
  }, []);

  const handleDuration = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    if (
      stakedAmount === 0
    )
      setMultiplier(1);
    if (MAX_WEEKS < value) {
      console.log("input", Number(inputValue));

      const boostMul = 1 + (MAX_WEEKS * 7 * 86400) * weight / (365 * 86400);
      const apr = 5 / (1 + weight) * boostMul;

      setApr(apr);
      setMultiplier(boostMul);
      setDuration(MAX_WEEKS);
    } else {
      const boostMul = 1 + (value * 7 * 86400) * weight / (365 * 86400);

      setMultiplier(boostMul);
      setDuration(value);
    }
  };

  if (!isOpen) return null;

  const handleInputChange =
    (input: number) => (event: ChangeEvent<HTMLInputElement>) => {
      let max = 0;
      if (input === 0) max = userStakeAmt;
      if (input === 1) max = userLpBal;
      console.log("Max: ", max);

      if (Number(event.target.value) > max) console.log("Exceed Amount");
      else if (isNaN(Number(event.target.value))) setInputValue("0");
      else {
        console.log("Stake Amount Input Value: ", event.target.value)
        setInputValue(event.target.value);
      }
    };

  const handleSetDuration = (value: number) => {
    const boostMul = 1 + (value * 7 * 86400) * weight / (365 * 86400);
    const apr = 5 / (1 + weight) * boostMul;

    setApr(apr);
    setMultiplier(boostMul);
    setDuration(value);
  };

  const handleStake = async (isStake: Boolean, value: string) => {
    console.log(isStake, "isStake");
    console.log(parseEther(value));
    if (!value) return;
    setLoading(true);
    try {
      let res: any;
      if (isStake) {
        const res1 = await approve(
          LP_TOKEN_ADDRESS,
          STAKING_CONTRACT_ADDRESS,
          parseEther(value)
        );
        if (res1.status === "success") {
          res = await stake(
            BigInt(parseEther(value)),
            BigInt(duration * 7 * 86400)
          );
        }
      } else {
        res = await withdraw(parseEther(value));
      }

      if (res) {
        setLoading(false);
        onClose();
        if (res.status === "success") {
          toast.success("Success!", {
            autoClose: 3000, // Close the toast after 3 seconds
          });
        } else {
          toast.error("Reverted!", {
            autoClose: 3000, // Close the toast after 3 seconds
          });
        }
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-[32px] shadow-xl z-50 w-[350px]">
        {children}
        <div className="p-6">
          <div className="flex justify-between">
            <div className="font-bold text-[18px]">
              {isStake ? `Stake:` : `Unstake:`}
            </div>
            <div className="font-bold">DRIP-BNB LP</div>
          </div>
        </div>
        <div className=" border-solid border-4 border-gray-400 bg-gray-200 rounded-[12px] mx-6 p-4">
          <input
            className="w-full bg-transparent text-right focus:outline-none text-xl"
            type="text"
            value={inputValue}
            onChange={isStake ? handleInputChange(1) : handleInputChange(0)}
          ></input>
          <div className="flex justify-between">
            <div className="text-gray-600">Max:</div>
            <div className="text-right">
              <span className="text-gray-600 font-bold">
                {isStake ? userLpBal : userStakeAmt}
              </span>
              <span className="text-purple-600 font-bold text-[14px]">
                {" "}
                DRIP-BNB LP
              </span>
            </div>
          </div>
        </div>
        {isStake && (
          <div className="m-6">
            <div className="font-bold">Lock Period :</div>
            <div className="flex justify-between">
              <input
                type="number"
                value={duration}
                min={1}
                max={52}
                onChange={handleDuration}
                className="border-4 py-1 w-[calc(100%-60px)] rounded-md border-solid border-gray-400 bg-gray-200 mt-2 focus:outline-none text-right px-2 font-semibold"
              />
              <div className="align-bottom mt-4 text-gray-600 font-semibold">
                Weeks
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {durations.map((item, key) => (
                <button
                  className="border rounded-md text-sm font-bold  grid place-content-center py-1 hover:bg-[#777] focus:bg-slate-500"
                  key={key}
                  onClick={() => handleSetDuration(item.value)}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <div className=" border-solid border-4 border-gray-400 bg-gray-200 rounded-[12px] mt-6 p-3">
              <div className="flex justify-between mb-1">
                <div className="font-bold"> Multiplier: </div>
                <div>{multiplier.toFixed(3)}</div>
              </div>
              <div className="flex justify-between mb-1">
                <div className="font-bold"> Lock Duration: </div>
                <div>{duration}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-bold"> APR: </div>
                <div>{apr.toFixed(2)} %</div>
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="flex justify-center">
            {!isStake ? (
              <button
                className=" mt-4 p-2 w-2/3 bg-gray-500 font-bold text-white rounded-[8px]"
                onClick={
                  isStake
                    ? () => handleStake(true, inputValue)
                    : () => handleStake(false, inputValue)
                }
                disabled
              >
                Stake
              </button>
            ) : (
              <button
                className=" mt-4 p-2 w-2/3 bg-blue-500 font-bold text-white rounded-[8px]"
                onClick={
                  isStake
                    ? () => handleStake(true, inputValue)
                    : () => handleStake(false, inputValue)
                }
              >
                Stake
              </button>
            )}
            {loading && <LoadingModal />}
          </div>
          <div className="flex justify-center mb-4">
            <button
              className=" mt-4 p-2 w-2/3 bg-gray-500 font-bold text-white rounded-[8px]"
              onClick={onClose}
            >
              Close Windows
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeModal;
const MAX_WEEKS = 52;
const durations = [
  {
    title: "1W",
    value: 1,
  },
  {
    title: "5W",
    value: 5,
  },
  {
    title: "10W",
    value: 10,
  },
  {
    title: "25W",
    value: 25,
  },
  {
    title: "MAX",
    value: MAX_WEEKS,
  },
];
