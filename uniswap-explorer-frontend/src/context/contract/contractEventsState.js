import React, { useReducer } from 'react';
import axios from 'axios';
import ContractEventsContext from './contractEventsContext';
import ContractEventsReducer from './contractEventsReducer'
import {BACKEND_API_URL} from "../../config"
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
import { toast } from 'react-toastify';

const ContractEventsState = (props) => {
    // global state variables
    const initialState = {
        events: [],
        address: "",
        loading: false,
        eventsError: null,
        addressError: null,
        currentBlock: 0,
        selectedChain: 0,
        eventsGettingCount: 0
    }
    // creating global state using useReducer Hook
    const [state, dispatch] = useReducer(ContractEventsReducer, initialState)

    // Get Wallet Address
    const getAddress = async (address) => {
        dispatch({
            type: GET_WALLET_ADDRESS,
            payload: address
        })
    }
    // Disconnect Wallet
    const disconnectWallet = async () => {
        dispatch({
            type: DISCONNECT_WALLET,
        })
    }

    // Update chain id on new connection or during changing chain
    const updateChain = async (id) => {
        dispatch({
            type: UPDATE_SELECTED_CHAIN,
            payload: id
        })
    }
    // update current block
    const updateCurrentBlock = async (block) => {
        dispatch({
            type: UPDATE_CURRENT_BLOCK,
            payload: block
        })
    }
    // Getting Past events one by one from backend
    const getEventsOfUniswapRopsten = async (block, chain) => {
        try {
            dispatch({type: GET_EVENTS_START})
            const {data} = await axios.get(`${BACKEND_API_URL}/get/${chain === 1? "mainnet":"ropsten"}/data?fromBlock=${block}`)
            dispatch({
                type: GET_EVENTS,
                payload: data
            })
            toast.success(data.length + " More Events Are Added")
        } catch (error) {
            dispatch({type: GET_EVENTS_ERROR, payload: error})
        }
    }
    // Clear Events on Logout
    const clearEvents = () => dispatch({
        type: CLEAR_EVENTS
    })

    // Passing global state and handler functions to all the childern
    return <ContractEventsContext.Provider
        value={{
            events: state.events,
            address: state.address,
            loading: state.loading,
            eventsError: state.eventsError,
            addressError: state.addressError,
            currentBlock: state.currentBlock,
            selectedChain: state.selectedChain,
            count: state.eventsGettingCount,
            clearEvents,
            getAddress,
            disconnectWallet,
            getEvents: getEventsOfUniswapRopsten,
            updateChain,
            updateBlock: updateCurrentBlock
        }}>
        {props.children}
    </ContractEventsContext.Provider>

}

export default ContractEventsState;