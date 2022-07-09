import React from 'react'
const Event = ({ block, hash, chainId, args, event }) => {
  return (
    <>
      <div className="card w-100 my-1">
        <div className="card-body">
          <h5 className="card-title">Block # 
          <a href={`https://${chainId === 1 ? "" : "ropsten."}etherscan.io/block/${block}`}>
          {block}
          </a>
          </h5>
          <p className="card-title">Event:  {event}</p>
          <p className="card-title">From:
            <a
              target="_blank" rel="noreferrer"
              href={`https://${chainId === 1 ? "" : "ropsten."}etherscan.io/address/${args?.length && args[0]?.toString()}`}>{args?.length && args[0]?.toString()}</a>
          </p>
          <p className="card-title">To:
            <a
              target="_blank" rel="noreferrer"
              href={`https://${chainId === 1 ? "" : "ropsten."}etherscan.io/address/${args?.length && args[5]?.toString()}`}>{args?.length && args[5]?.toString()}</a>
          </p>
          <p className="card-title">Amount0In:  {parseInt(args?.length && args[1]?.hex, 16)}</p>
          <p className="card-title">Amount1In:  {parseInt(args?.length && args[2]?.hex, 16)}</p>
          <p className="card-title">Amount0Out:  {parseInt(args?.length && args[3]?.hex, 16)}</p>
          <p className="card-title">Amount1Out:  {parseInt(args?.length && args[4]?.hex, 16)}</p>
          <p className='card-text'>
            Transaction Hash:
            <a className="card-text"
              href={`https://${chainId === 1 ? "" : "ropsten."}etherscan.io/tx/${hash}`}
              target="_blank" rel="noreferrer"
            >{hash}</a>
          </p>
        </div>
      </div>
    </>
  )
}

export default Event