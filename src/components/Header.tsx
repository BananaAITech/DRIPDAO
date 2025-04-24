import { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header: FC = () => {
  return (
    <header className="h-1/10">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="logo"><img src="dripdao.png"></img></div>
          <div className="">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
