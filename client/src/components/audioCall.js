import { Peer } from 'peerjs';
export default function audioCall(currentId, otherUserId) {
	const peer = new Peer(currentId);
	console.log('hello')
	navigator.mediaDevices.getUserMedia(
		{ video: true, audio: true },
		(stream) => {
			const call = peer.call(otherUserId, stream);
			call.on("stream", (remoteStream) => {
				// Show stream in some <video> element.
			});
		},
		(err) => {
			console.error("Failed to get local stream", err);
		},
	);

	peer.on("call", (call) => {
		navigator.mediaDevices.getUserMedia(
			{ video: true, audio: true },
			(stream) => {
				call.answer(stream); // Answer the call with an A/V stream.
				call.on("stream", (remoteStream) => {
					// Show stream in some <video> element.
				});
			},
			(err) => {
				console.error("Failed to get local stream", err);
			},
		);
	});

}