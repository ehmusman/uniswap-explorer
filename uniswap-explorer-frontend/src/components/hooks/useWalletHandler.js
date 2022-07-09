import { useContext } from "react"
import ContractEventsContext from "../../context/contract/contractEventsContext"
import { toast } from "react-toastify"
import { ethers } from 'ethers'

// custome Hook to Connect with Wallet
export const useConnectWallet = () => {
  const { getAddress, disconnectWallet, updateChain , updateBlock} = useContext(ContractEventsContext)
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const connectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const network = await provider.getNetwork()
      const chainId = network.chainId
      if (![1, 3].includes(chainId)) {
        toast.error("Please Select Ropsten or Mainnet of Ethereum")
        return
      }
      updateChain(chainId)
      const currentBlock = await provider.getBlockNumber()
      updateBlock(currentBlock)
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {
          getAddress(result[0]);
          toast.success('Wallet is Connected')
        })
        .catch(error => {
          console.log("error", error)
        });

    } else {
      toast.error("Please Install Matamask")
    }
  }
// Function to catch events on changing chain
  const chainChangedHandler = async () => {
    // window.location.reload();
    const network = await provider.getNetwork()
    const chainId = network.chainId
    if (![1, 3].includes(chainId)) {
      toast.error("Please Select Ropsten or Mainnet of Ethereum")
      disconnectWallet()
      return
    }
    updateChain(chainId)
  }
  window?.ethereum?.on('chainChanged', chainChangedHandler);
  return [connectWalletHandler]
}

// custome Hook to Disconnect Wallet From DAPP
export const useWalletDisconnect = () => {
  const { disconnectWallet } = useContext(ContractEventsContext)
  const disconnect = () => {
    disconnectWallet()
    toast.success("Wallet is Disconnected")
  }
  return [disconnect]
}

// custome Hook to get current connected Wallet Address
export const useGetWalletAddress = () => {
  const { address } = useContext(ContractEventsContext)
  return [address]
}

// custome Hook to get current chain Id
export const useGetCurrentChainId = () => {
  const { selectedChain } = useContext(ContractEventsContext)
  const chainId = selectedChain
  return [chainId ]
}