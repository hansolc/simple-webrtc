import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import AudioCapture from './AudioCapture';
import useWebSocket from './Hooks/useWebSocket';
import Peer from './SimplePeer/Peer';

const webSocketURL = "wss://socketsbay.com/wss/v2/2/demo/";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(new Peer());
  const [checkValue, setCheckValue] = useState('')

  useEffect(() => {
    setSocket(new WebSocket(webSocketURL))
  },[])

  useEffect(() => {
    if(!socket) return;
    socket.onopen = () => {
      console.log('socket is connected!')
    }

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if(data.type==='audio'){
        if(data.verify) {
          handlePeer('receiver', false);
          let intervalId = setInterval(() => { peer.connect(data['offer'], intervalId)}, 2000);
        } else {
          peer.connect(data['offer'])
        }
      }
    }
  })

  const handlePeer = (type, verify) => {
    let stream = document.getElementById('localAudio').srcObject;
    let myPeer = peer.init(stream, type==='constructor');

    myPeer.on('signal', data => {
      let message = JSON.stringify({ offer: data, verify: verify, type: 'audio' });
      socket.send(message);
    })
  }

  return (
    <>
      <AudioCapture />
      <div>
        {
          ["constructor", "receiver"].map((type, index) => {
            return (
              <div key={index}>
                <input name={type} type="checkbox" checked={checkValue===type} onChange={(e)=>setCheckValue(e.target.name)}/>{type}
              </div>
            )
          })
        }
        <button onClick={()=>handlePeer('constructor', true)}>Peer 생성</button>
      </div>
    </>
  )
}

export default App;