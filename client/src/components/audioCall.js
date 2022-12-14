import { Peer } from 'peerjs';
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
export default function audioCall(currentId, otherUserId) {
	const peer = new Peer(currentId);
	console.log('hello')
	navigator.mediaDevices.getUserMedia(
		{ video: true, audio: true },
		(stream) => {
			const call = peer.call(otherUserId, stream);
			call.on("stream", (remoteStream) => {
				let bod = document.getElementsByTagName('body');
				document.createElement('<audio autoplay />').setAttribute("srcObject", remoteStream).appendTo(bod);
			});
		},
		(err) => {
			console.error("Failed to get local stream", err);
		},
	);

	peer.on("call", (call) => {
		navigator.mediaDevices.getUserMedia(
			{ video: false, audio: true },
			(stream) => {
				call.answer(stream); // Answer the call with an A/V stream.

				call.on("stream", (remoteStream) => {
					let bod = document.getElementsByTagName('body');
					document.createElement('<audio autoplay />').setAttribute("srcObject", remoteStream).appendTo(bod);
				});
			},
			(err) => {
				console.error("Failed to get local stream", err);
			},
		);
	});

}