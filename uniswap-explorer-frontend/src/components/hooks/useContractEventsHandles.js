import { useContext } from "react"
import ContractEventsContext from "../../context/contract/contractEventsContext"

// custome Hook to get current Block save in globas state
export const useGetCurrentBlock = () => {
const { currentBlock : block} = useContext(ContractEventsContext)
  return [block]
}

// custome Hook to get Events from Backend and storing in global state
export const useGetEvents = () => {
    const { currentBlock : block, getEvents, count, loading, eventsError, selectedChain} = useContext(ContractEventsContext)
    const gettingEvents = async () => {
        getEvents(block-1000*count, selectedChain)
    }
      return [loading, eventsError, gettingEvents]
}

// custome Hook to use events stored in global state
export const useEvents = () => {
    const { events} = useContext(ContractEventsContext)
      return [events]
}