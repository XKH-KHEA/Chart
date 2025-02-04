// const connection = new signalR.HubConnectionBuilder()
//     .withUrl("/videoHub")
//     .build();

// let localStream;
// let peerConnection;
// const servers = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
// };

// const startButton = document.getElementById("startButton");
// const video = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");

// startButton.addEventListener("click", startStream);

// async function startStream() {
//     localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     video.srcObject = localStream;
//     connection.start().then(() => console.log("SignalR Connected"));
// }

// connection.on("ReceiveOffer", async (user, offer) => {
//     peerConnection = new RTCPeerConnection(servers);
//     localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//     peerConnection.onicecandidate = event => {
//         if (event.candidate) {
//             connection.invoke("SendCandidate", user, JSON.stringify(event.candidate));
//         }
//     };

//     peerConnection.ontrack = event => {
//         remoteVideo.srcObject = event.streams[0];
//     };

//     await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
//     let answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);
//     connection.invoke("SendAnswer", user, JSON.stringify(answer));
// });

// connection.on("ReceiveAnswer", async (user, answer) => {
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
// });

// connection.on("ReceiveCandidate", async (user, candidate) => {
//     if (peerConnection) {
//         await peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
//     }
// });

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/videoHub")
    .build();

let localStream;
let peerConnections = {}; // Store multiple peer connections

const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

const startButton = document.getElementById("startButton");
const video = document.getElementById("localVideo");
const viewersContainer = document.getElementById("viewersContainer");

startButton.addEventListener("click", startStream);

async function startStream() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = localStream;
    connection.start().then(() => console.log("SignalR Connected"));

    connection.invoke("SendOffer", JSON.stringify(await createOffer()));
}

async function createOffer() {
    const peerConnection = new RTCPeerConnection(servers);
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            connection.invoke("SendCandidate", JSON.stringify(event.candidate));
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    return offer;
}

connection.on("ReceiveOffer", async (offer) => {
    const peerConnection = new RTCPeerConnection(servers);
    peerConnections["viewer"] = peerConnection;

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            connection.invoke("SendCandidate", JSON.stringify(event.candidate));
        }
    };

    peerConnection.ontrack = event => {
        let newVideo = document.createElement("video");
        newVideo.srcObject = event.streams[0];
        newVideo.autoplay = true;
        newVideo.classList.add("viewerVideo");
        viewersContainer.appendChild(newVideo);
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    connection.invoke("SendAnswer", JSON.stringify(answer));
});

connection.on("ReceiveAnswer", async (answer) => {
    await peerConnections["viewer"].setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
});

connection.on("ReceiveCandidate", async (candidate) => {
    if (peerConnections["viewer"]) {
        await peerConnections["viewer"].addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
    }
});
