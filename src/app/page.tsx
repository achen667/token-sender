"use client"

import Image from "next/image";
import HomeContent from "@/components/HomeContent";
import {useAccount} from "wagmi"

export default function Home() {

  const {isConnected} = useAccount()

  return (
   <div>
      {!isConnected?(
        <div className ="text-4xl">
          Please connect a wallet
        </div>
      ):(
        <div>
              <HomeContent/>
        </div>
      )}

   </div> 
  );
}
