import { Peer } from "./peer";

// Extension for DHD PeerJS Functionality

export class DHD_Peer extends Peer {

	private _restApiAddress = "http://localhost:7070/offer"; // Address to call RestAPI
    

    async dhd_connect() {

        const pc = new RTCPeerConnection();

        // Offer to receive 1 audio track
        pc.addTransceiver('audio', {
            direction: 'recvonly'
        })       
        
        // Start streaming audio once a track was added to the peer connection.
        pc.ontrack = function (event) {
            const el = document.createElement(event.track.kind);
            (el as HTMLAudioElement).srcObject = event.streams[0];
            (el as HTMLAudioElement).autoplay = true;
            (el as HTMLAudioElement).controls = true;
  
            document.getElementById('remoteAudio').appendChild(el);
        }
  
        // Notify on connection changes
        pc.oniceconnectionstatechange = e => {
          console.log("ICE connection state changed to: " + pc.iceConnectionState);
        }

        const offer = await pc.createOffer();
        await pc.setLocalDescription( offer );
        console.log("local session description generated.");

        // Send SDP to Go server. It will register it and answer with its
        // own SDP. Once both are registered, a WebRTC connection can be
        // established.
        const res = await fetch( this._restApiAddress, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(pc.localDescription)
        });

        const json = await res.json();
        console.log("remote session description received.");
        pc.setRemoteDescription( json );
        return 0;
    }
}