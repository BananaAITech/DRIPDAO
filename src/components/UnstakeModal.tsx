// Modal.tsx
import React, { ReactNode, useState } from "react";
import { useStaking } from "../hook/useStaking";
import LoadingModal from "./LoadingSpinner";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  isStake: boolean;
  userStakeAmt: number;
  id: number;
  endTime: number;
  onClose: () => void;
  children: ReactNode;
}

const UnstakeModal: React.FC<ModalProps> = ({
  isOpen,
  isStake,
  userStakeAmt,
  id,
  endTime,
  onClose,
  children,
}) => {
  const { withdraw } = useStaking();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStake = async (isStake: Boolean) => {
    console.log(isStake, "isStake");
    setLoading(true);
    try {
      let res: any;
      
      res = await withdraw(BigInt(id));

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
              Unstake:
            </div>
            <div className="font-bold">DRIP-BNB LP</div>
          </div>
          <div className="flex justify-between py-2 font-semibold">
              <span>End in: </span>
              <span>{endTime} days</span>
          </div>
          
        </div>
        <div className=" border-solid border-4 border-gray-400 bg-gray-200 rounded-[12px] m-6 p-4">
          <div className="flex justify-between">
            <div className="text-gray-600">Amount:</div>
            <div className="text-right">
              <span className="text-gray-600 font-bold">
                {userStakeAmt}
              </span>
              <span className="text-purple-600 font-bold text-[14px]">
                {" "}
                DRIP-BNB LP
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-center">
            {endTime > 0 && !isStake ? (
              <button
                className=" mt-4 p-2 w-2/3 bg-gray-500 font-bold text-white rounded-[8px]"
                onClick={() => handleStake(false)}
                disabled
              >
                Unstake
              </button>
            ) : (
              <button
                className=" mt-4 p-2 w-2/3 bg-blue-500 font-bold text-white rounded-[8px]"
                onClick={() => handleStake(false)}
              >
                Unstake
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

export default UnstakeModal;
