import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import AudioCapture from './AudioCapture';
import useWebSocket from './Hooks/useWebSocket';
import Peer from './SimplePeer/Peer';

const App = () => {
  const [string, setString] = useState('');
  const [peer, setPeer] = useState(new Peer());

  const makePeer = (initiator=false) => {
    const stream = document.getElementById('localAudio').srcObject;
    let peerObj = peer.init(stream, initiator);

    peerObj.on('signal', data => {
      let message = JSON.stringify({
        offer: data,
        initiator: initiator,
        type: 'audio'
      })
      socket.send(message)
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
  }
  const { socket, connectWebSocket } = useWebSocket({makePeer, peer});



  return (
    <>
      <button onClick={connectWebSocket}>웹 소켓 연결</button>
      <button onClick={() => makePeer(true)}>연결!</button>
      <AudioCapture />
    </>
  )
}

export default App;