
#  TokenSender

  

A simple and elegant token airdrop dApp that allows you to send ERC-20 tokens to multiple addresses at once using a smart contract. Built with **Next.js**, **TypeScript**, **TailwindCSS**, **Wagmi**, **RainbowKit**, and **ViEM**.

  

---

  

##  Features

  

- Connect your wallet (via RainbowKit)

- Input a token address to auto-fetch token name

- Paste recipients and amounts (comma or newline-separated)

- Automatically checks allowance and approves if necessary

- Displays token name, amount in wei and in human-readable format

- Beautiful UI with TailwindCSS and responsive layout

- Persists form inputs in `localStorage`

- Loading spinner during transaction

  

---

  

##  Tech Stack

  

-  **Next.js 14+**

-  **TypeScript**

-  **TailwindCSS**

-  **RainbowKit** (for wallet connect)

-  **Wagmi v2**

-  **ViEM** (internal usage via Wagmi/core)

-  **ethers** (underlying provider for contract reads/writes)

  

---

  

##  Getting Started

[IPFS site](https://ipfs.io/ipfs/QmZzXo7DT2B92b3M6vhapjN8ssTWft2jsw2eE8fQ1o3oSJ/)


###  1. Clone the repo

  

```bash

git  clone  https://github.com/achen667/token-sender.git

cd  token-sender
```
  

###  2.  Install  dependencies

  

Make  sure  you  have  pnpm  installed:

  
```bash

pnpm  install
```
  

###  3.  Configure  environment  variables

  

Create  a  .env.local  file  in  the  root  directory:

  
```bash
touch  .env.local
```
  

Add  your  WalletConnect  Project  ID:

  
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```
  

###  4.  Run  the  development  server

  
```bash
pnpm  run  dev
```
  

Visit:  http://localhost:3000

  

Usage  Instructions

  

Connect  your  wallet.

Paste  in:
Token  Address:  ERC20  address
Recipients:  List  of  addresses (comma- or  newline-separated)
Amounts:  Token  amounts  matching  recipients


The  UI  will:
Auto-fetch  token  name
Show  total  tokens (in wei  and  formatted)
Check  allowance  &  auto-approve  if  needed
Click  Send  Tokens  –  spinner  shows  progress

  

## Project  Structure

├──  components/

│  └──  ui/

│  └──  InputField.tsx  //  Reusable  input  component

├──  pages/

│  └──  index.tsx  //  Main  token  sending  form

├──  constants/

│  └──  index.ts  //  ABIs  and  chain  config

├──  util/

│  └──  calculateTotal.ts  //  Utility  to  sum  token  amounts

├──  public/

├──  .env.local

├──  tailwind.config.js

├──  tsconfig.json

└──  package.json

  
 