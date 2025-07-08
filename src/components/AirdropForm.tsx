"use client"

import InputField from "@/components/ui/InputField"
import { useState, useMemo, useEffect } from "react"
import {chainsToTSender, tsenderAbi, erc20Abi} from "@/constants"
import {useChainId, useReadContract, useConfig, useAccount, useWriteContract, useTransaction} from 'wagmi'
import {readContract, waitForTransactionReceipt} from "@wagmi/core"
import { promises } from "dns"
import { calculateTotal } from "@/util/calculateTotal"
import { formatUnits} from 'viem'

 

export default function AirdropForm(){
    const [tokenAddress, setTokenAddress] = useState(() => localStorage.getItem("tokenAddress") || "")
    const [recipients, setRecipients] = useState(() => localStorage.getItem("recipients") || "")
    const [amounts, setAmount] = useState(() => localStorage.getItem("amounts") || "")
    const[tokenName,setTokenName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total:number = useMemo(()=> calculateTotal(amounts),[amounts])
    const {data:hash, isPending, writeContractAsync} = useWriteContract()
    const tokenDecimals = 18
    

    async function getApprovedAmount(tSenderAddress:string|null):Promise<number>{
        if(!tSenderAddress){
            alert("no address found")
            return 0
        }
        const response = await readContract(config,{
            abi:erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName:"allowance",
            args:[account.address, tSenderAddress as `0x${string}`]
        })
        return response as number
    }
        /*useEffect */
        useEffect(() => {
        async function fetchTokenName() {
            try {
            if (!tokenAddress || !tokenAddress.startsWith("0x") || tokenAddress.length !== 42) {
                setTokenName("")
                return
            }

            const name = await readContract(config, {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: 'name',
            })
            setTokenName(name as string)
            } catch (error) {
            console.error("Error fetching token name:", error)
            setTokenName("Invalid or unknown token")
            }
        }
        fetchTokenName()
        }, [tokenAddress])


        useEffect(() => {
            localStorage.setItem("tokenAddress", tokenAddress)
        }, [tokenAddress])

        useEffect(() => {
            localStorage.setItem("recipients", recipients)
        }, [recipients])

        useEffect(() => {
        localStorage.setItem("amounts", amounts)
        }, [amounts])
    //1. approved amount 
    //2. aridrop tokens
    async function handleSubmit(){
        setIsLoading(true) // 🌀 Show spinner

        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress)
        // console.log(approvedAmount)
        console.log(total)
        try{ 
            if(approvedAmount < Number(total)){
                //if not approved
                const approvalHash = await writeContractAsync({
                    abi:erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName:"approve",
                    args:[tSenderAddress as `0x${string}`,BigInt(total)],
                })
                const approvalReceipt = await waitForTransactionReceipt(config,{
                    hash:approvalHash
                })
                console.log("approavl confirmed", approvalReceipt)

                await writeContractAsync({
                    abi: tsenderAbi,
                    address: tSenderAddress as `0x${string}`,
                    functionName: "airdropERC20",
                    args: [
                        tokenAddress,
                        // Comma or new line separated
                        recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                        amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                        BigInt(total),
                    ],
                })

            }else{ //already approved
                await writeContractAsync({
                    abi: tsenderAbi,
                    address: tSenderAddress as `0x${string}`,
                    functionName: "airdropERC20",
                    args: [
                        tokenAddress,
                        // Comma or new line separated
                        recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                        amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                        BigInt(total),
                    ],
                })
            }
        }catch(error){
            setIsLoading(false)
            console.log("tx failed")
        }
        setIsLoading(false) // ✅ Hide spinner when done or failed
        console.log("tx succeeded")   
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
            <InputField 
                label="TokenAddr"
                placeholder="0x"
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)}
            />

            <div className="mb-4" />

            <InputField 
                label="Recipients (comma or new line separated)"
                placeholder="0x"
                value={recipients}
                onChange={e => setRecipients(e.target.value)}
                large={true}
            />

            <div className="mb-4" />

            <InputField 
                label="Amounts (comma or new line separated)"
                placeholder="1000000000000000000"
                value={amounts}
                onChange={e => setAmount(e.target.value)}
                large={true}
            />

            <div className="mb-6" />

            {/* Token Summary */}
            <div className="border border-zinc-300 bg-zinc-50 rounded-lg p-4 shadow-sm mt-6">
                <h2 className="text-lg font-semibold text-zinc-800 mb-3">Token Summary</h2>
                <div className="space-y-2 text-sm text-zinc-700">
                <div>
                    <span className="font-medium text-zinc-600">Token Name:</span> {tokenName}
                </div>
                <div>
                    <span className="font-medium text-zinc-600">Amount (wei):</span> {total || "N/A"}
                </div>
                <div>
                    <span className="font-medium text-zinc-600">Amount (tokens):</span>{" "}
                    {total ? formatUnits(BigInt(total), tokenDecimals) : "N/A"}
                </div>
                </div>
            </div>
            <div className="mb-4" />
            <button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 ease-in-out flex items-center justify-center"
                disabled={isLoading}
            >
                {isLoading ? (
                <>
                    <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    />
                    </svg>
                    Processing...
                </>
                ) : (
                "Send Tokens"
                )}
            </button>
            </div>
        </div>
    )

}