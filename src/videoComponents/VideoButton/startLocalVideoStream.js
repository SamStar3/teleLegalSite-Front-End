import updateCallStatus from "../../redux-elements/actions/updateCallStatus";

const startLocalVideoStream = (streams, dispatch)=>{
    const localStream = streams.localStream;
    for(const s in streams){ //s is the key
        if(s !== "localStream"){
            //we don't addTracks to the localStream
            const curStream = streams[s];
            //addTracks to all peerConnecions
            localStream.stream.getVideoTracks().forEach(t=>{
                curStream.peerConnection.addTrack(t,curStream.stream);
            })
            //update redux callStatus
            dispatch(updateCallStatus('video',"enabled"));
        }
        
    }
}

export default startLocalVideoStream;