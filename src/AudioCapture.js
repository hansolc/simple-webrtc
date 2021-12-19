import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';

const AudioCapture = () => {

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(info => {
            const track = info.getAudioTracks()[0];
            var ctx = new AudioContext();
            var src = ctx.createMediaStreamSource(new MediaStream([track]));
            var dst = ctx.createMediaStreamDestination();
            var gainNode = ctx.createGain();
            [src, gainNode, dst].reduce((a,b) => a&&a.connect(b));

            info.removeTrack(track);
            info.addTrack(dst.stream.getAudioTracks()[0])

            document.getElementById('localAudio').srcObject = info;
        })
    },[])

    return (
        <>
            <audio id='localAudio' autoPlay muted />
        </>
    )
}

export default AudioCapture;