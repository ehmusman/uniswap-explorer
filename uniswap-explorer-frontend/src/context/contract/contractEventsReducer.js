import {
    CLEAR_EVENTS,
    GET_EVENTS,
    GET_EVENTS_ERROR,
    GET_EVENTS_START,
    GET_WALLET_ADDRESS,
    DISCONNECT_WALLET,
    UPDATE_CURRENT_BLOCK,
    UPDATE_SELECTED_CHAIN
} from '../types'

// Reducer Function 
const ContractEventsReducer = (state, action) => {
    switch (action.type) {
        // before getting events
        case GET_EVENTS_START:
            return {
                ...state,
                loading: true
            };
        // adding new events in existing events state
        case GET_EVENTS:
            return {
                ...state,
                loading: false,
                eventsGettingCount: state.eventsGettingCount+1,
                events: [...state.events, ...action.payload],
            };
        // storing Errors while Getting events from DB
        case GET_EVENTS_ERROR:
            return {
                ...state,
                loading: false,
                eventsError: action.payload,
            };
        // Clear All events when logging OFF or changing current chain
        case CLEAR_EVENTS:
            return {
                ...state,
                events: [],
                eventsError: action.payload
            }
        // Storing Wallet Address in state
        case GET_WALLET_ADDRESS:
            return {
                ...state,
                address: action.payload
            }
        // Removing all events and wallet address while disconnecting wallet
        case DISCONNECT_WALLET:
            return {
              ...state,
              address: "",
              events: [],
              currentBlock:0,
             };
        // updating current block number on every reload
        case UPDATE_CURRENT_BLOCK:
            return {
                ...state,
                currentBlock: action.payload
            }
        // updating chain number while login and or chainging current chain
        case UPDATE_SELECTED_CHAIN:
            return{
                ...state,
                selectedChain: action.payload
            }
        default:
            return state;
    }
}
export default ContractEventsReducer;