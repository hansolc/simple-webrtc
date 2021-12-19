import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';

const webSocketURL = "wss://socketsbay.com/wss/v2/2/demo/";

const useWebSocket = ({makePeer=()=>{}, peer}) => {
    const [socket, setSocket] = useState(null);

    const connectWebSocket = () => {
        const connectedSocket = new WebSocket(webSocketURL);
        setSocket(connectedSocket);

        connectedSocket.onopen = () => {
            console.log('socket connected!')
        }

        connectedSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if(data.type==='audio'){
                if(data.initiator) makePeer(false);
                peer.connect(data["offer"])
            }
        }
    }

    return {
        socket,
        connectWebSocket
    }
}

export default useWebSocket;