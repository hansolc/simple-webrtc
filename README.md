# simple-peer 라이브러를 이용해 Audio Stream 정보 전송

## Summary
[simple-peer](https://github.com/feross/simple-peer) 라이브러리와 `WebSocket`을 통해
Stream 정보를 전송하여 Audio 정보를 전송함

## 목표
- 웹 소켓 연결
- `Audio Stream` 전송 및 수신
- 볼륨 조절에 대한 UI

## 목표가 아닌 것
- UI
- Socket 예외 처리 및 장비권한 API(EX getUserMedia) 예외처리
- Loading UI
- ICE SERVER / TURN SERVER / STURN SERVER 에 대한 이해부족

### 계획
- Web API `navigator` 사용
  - navigator.mediaDevices.getUserMedia(constraint): 스피커/마이크 권한 설정을 확인하고, 권한을 수락 시 요청한 미디어 종류의 트랙을 포함한 MediaStream을 반환
  - constraint: 요청할 미디어 유형과 각각에 대한 요구사항을 지정하는 객체
  - (필요시 사용)
  - mediastream.getAudioTracks(): Audio 장치의 MediaStreamTracks을 반환
  - `AudioContext`
    - 1) `createMediaStreamSource`, 2) `createGain`, 3) `createMediaStreamDestination` 생성 후 연결
    - 1) => 2) => 3) 순으로 연결 `connect() 사용`
    - (필요시) 생성한 `gainNode` 값을 조절하여 마이크 소리 조절

- App.js (stream 전송 및 양뱡향 연결)
```
- Peer 생성 및 이벤트 등록
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

- 소켓 설정
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
```
  - `<audio>` 태그에 저장해둔 stream 값을 통해 Peer 생성
  - `Peer.js` 내의 initiator 값을 통해 생성자/수신자 구분
  - stream 전송 및 양뱡향 연결
    1) 생성자에서 ICE SERVER와 연결 성공 시 signal 이벤트 발생
    2) websocket 을 통해 `simple-peer`에서 생성한 정보 전송
    3) verify을 통해 생성자/수신자 구분
    4) 수신자(remote)는 새로운 peer 을 생성 후 생성자에게 받은 정보를 통해 `connect` 시도
    5) 연결 성공 시 생성자에게 signal 발생 및 local audio 정보에 받은 stream 정보 저장
    6) 생성자는 수신자에게서 받은 stream 정보 저장

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### 테스트 방법
1) local, remote 로 웹페이지에 접속 localhost:3000
2) 두 환경 모두 websocket 연결 확인(console 창)
3) Peer 생성 버튼 클릭 후 마이크 및 헤드셋 확인