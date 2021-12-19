import SimplePeer from 'simple-peer/simplepeer.min.js';

class Peer {
    peer = null;
    initialized = false;

    init = (stream, initiator) => {
        this.initialized = true;

        this.peer = new SimplePeer({
            initiator: initiator,
            stream: stream,
            trickle: false,
            reconnectTimer: 1000,
            iceTransportPolicy: 'relay',
            config: {
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }]
            }
        })
        return this.peer;
    }

    connect = (dataFromOther, offInterverId) => {
        this.peer.signal(dataFromOther);
        clearInterval(offInterverId)
    }
}

export default Peer;