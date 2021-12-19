import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';

const webSocketURL = "wss://socketsbay.com/wss/v2/2/demo/";

const useWebSocket = () => {
    const [socket, setSocket] = useState(null);

    const connectWebSocket = () => {
        const connectedSocket = new WebSocket(webSocketURL);
        setSocket(connectedSocket);

        connectedSocket.onopen = () => {
            console.log('socket connected!')
        }

        connectedSocket.onmessage = (data) => {
            console.log('get messages: ', data)
            
        }
    }

    return {
        socket,
        connectWebSocket
    }
}

export default useWebSocket;