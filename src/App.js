import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import AudioCapture from './AudioCapture';
import Peer from './SimplePeer/Peer';

// https://socketsbay.com/test-websockets
// https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b
// Free Echo Test for WebSocket
const webSocketURL = "wss://socketsbay.com/wss/v2/2/demo/";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(new Peer());

  useEffect(() => {
    setSocket(new WebSocket(webSocketURL))
  },[])

  useEffect(() => {
    if(!socket) return;
    socket.onopen = () => console.log('socket is connected!')

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if(data.type==='audio'){
        if(data.verify) {
          handlePeer('receiver', false);
          // let intervalId = setInterval(() => { peer.connect(data['offer'], intervalId)}, 2000);
          peer.connect(data['offer'])
        } else {
          peer.connect(data['offer'])
        }
      }
    }
  }, [socket])

  const handlePeer = (type, verify) => {
    let stream = document.getElementById('localAudio').srcObject;
    let myPeer = peer.init(stream, type==='constructor');

    myPeer.on('signal', data => {
      let message = JSON.stringify({ offer: data, verify: verify, type: 'audio' });
      socket.send(message);
    })

    myPeer.on('stream', stream => {
      document.getElementById('remoteAudio').srcObject = stream;
    })
  }

  return (
    <>
      <AudioCapture />
      <div>
        <button onClick={()=>handlePeer('constructor', true)}>Peer 생성</button>
      </div>
    </>
  )
}

export default App;