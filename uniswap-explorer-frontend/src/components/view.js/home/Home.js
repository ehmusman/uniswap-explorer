import React from "react";
import {
  useConnectWallet,
  useWalletDisconnect,
  useGetWalletAddress,
  useGetCurrentChainId,
} from "../../hooks/useWalletHandler";
import {
  useGetCurrentBlock,
  useGetEvents,
  useEvents,
} from "../../hooks/useContractEventsHandles";
import Event from "./Event";

const Home = () => {
  const [connectWalletHandler] = useConnectWallet();
  const [disconnect] = useWalletDisconnect();
  const [address] = useGetWalletAddress();
  const [chainId] = useGetCurrentChainId();
  const [block] = useGetCurrentBlock();
  const [loading, eventsError, gettingEvents] = useGetEvents();
  const [events] = useEvents();
  return (
    <div className="container">
      <button
        onClick={address ? disconnect : connectWalletHandler}
        className="btn btn-dark btn-lg mt-1"
      >
        {address ? "Logout" : "Connect Wallet"}
      </button>

      {events ? (
        <>
          {events.map((event, i) => (
            <Event
              key={i}
              block={event.blockNumber}
              hash={event.transactionHash}
              chainId={chainId}
              args={event.args}
              event={event.event}
            />
          ))}
        </>
      ) : null}
      <div className="d-flex align-items-center justify-content-center">
        {!loading && address && chainId && block ? (
          <button
            className=" mt-2 btn btn-primary btn-lg d-block w-25"
            onClick={gettingEvents}
          >
            {events.length ? "Load More Events" : "Get Events"}
          </button>
        ) : null}
        {loading && !eventsError ? (
          <h1>
            <i className="fas fa-spinner fa-5x fa-spin"></i>
          </h1>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
