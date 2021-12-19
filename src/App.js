import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import AudioCapture from './AudioCapture';
import useWebSocket from './Hooks/useWebSocket';
import Peer from './SimplePeer/Peer';

const App = () => {
  const [string, setString] = useState('');
  const [peer, setPeer] = useState(new Peer());
  const { socket, connectWebSocket } = useWebSocket();

  console.log(peer)

  const handleClick = () => {
    const audioElem = document.getElementById('localAudio');
    const stream = audioElem.srcObject;
    const peerObj = peer.init(stream, string==='init');

    peerObj.on('signal', data => {
      socket.send(JSON.stringify({
        message: 'audio srcObject',
        data: data
      }))
    })

    peerObj.on('data', data => {
      console.log('data: ', data)
    })

    peerObj.on('close', () => {
      console.log('close')
    })

    peerObj.on('stream', stream => {
      console.log('stream: ', stream)
    })
    setPeer(peerObj)
  }

  return (
    <>
      <button onClick={connectWebSocket}>웹 소켓 연결</button>
      <button onClick={handleClick}>연결!</button>
      <AudioCapture />
    </>
  )
}

export default App;