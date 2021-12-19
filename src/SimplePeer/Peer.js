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

    connect = (dataFromOther, offInterverId) => { //connect보다는 reply에 가까움
        this.peer.signal(dataFromOther);
        clearInterval(offInterverId)
    }

    addStream = (stream) => {
        this.peer.addStream(stream)
    }
    removeStream = (stream) => {
        this.peer.removeStream(stream)
    }
    destroy = (callback) => {
        this.initialized = false;
        this.peer.destroy();
        if(callback){
            callback();
        }
    }
}

export default Peer;