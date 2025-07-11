"use client"

import{getDefaultConfig} from "@rainbow-me/rainbowkit"
import{mainnet, optimism, arbitrum, base, zksync, sepolia, anvil} from "wagmi/chains"

export default getDefaultConfig({
    appName:"TSender",
    projectId:process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains:[mainnet, optimism, arbitrum, base, zksync, sepolia, anvil],
    ssr:false
})