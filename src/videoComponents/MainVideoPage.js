import { useEffect, useState,useRef } from "react";
import { useSearchParams } from "react-router-dom"
import axios from'axios';
import './VideoComponents.css'
import CallInfo from "./CallInfo";
import ChatWindow from "./ChatWindow";
import ActionButtons from "./ActionButtons";
import addStream from '../redux-elements/actions/addStream';
import { useDispatch, useSelector } from "react-redux";
import createPeerConnection from "../webRTCutilities/createPeerConnection";
import socket from '../webRTCutilities/socketConnection';
import updateCallStatus from "../redux-elements/actions/updateCallStatus";


const MainVideoPage =() => {

    const dispatch = useDispatch();
    const [searchParams, setSearchParams ] = useSearchParams();
    const [apptInfo, setAppInfo ] = useState({})
    const smallFeedEl = useRef(null);
    const largeFeedEl = useRef(null);
    

    useEffect(()=>{
        //fetch the user media
        const fetchMedia = async()=>{
            const constraints = {
                video: true, //must have one constraint, just dont show it yet
                audio: true, //if you make a video chat app that doesnt use audio, but does (????), then init this as false, and add logic later ... hahaha
            }
            try{
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                dispatch(updateCallStatus('haveMedia',true)); //update our callStatus reducer to know that we have the media
                //dispatch will send this function to the redux dispatcher so all reducers are notified
                //we send 2 args, the who, and the stream
                dispatch(addStream('localStream',stream));
                const { peerConnection, remoteStream } = await createPeerConnection();
                //we don't know "who" we are talking to... yet.
                dispatch(addStream('remote1',remoteStream, peerConnection));
                //we have a peerconnection... let's make an offer!
                //EXCEPT, it's not time yet. 
                    //SDP = information about the feed, and we have NO tracks
                //socket.emit...
                // largeFeedEl.current.srcObject = remoteStream //we have the remoteStream from our peerConnection. Set the video feed to be the remoteStream jsut created
            }catch(err){
                console.log(err);
            }
        }
        // fetchMedia()
    },[])

    useEffect(()=> {

        const token = searchParams.get('token');
        console.log(token);
        const fetchDecodedToken = async()=>{
            const resp = await axios.post('https://localhost:9000/validate-link',{token});
            console.log(resp.data);
            setAppInfo(resp.data);
        }
        fetchDecodedToken();    
    },[])

    return(
        <div className="main-video-page">
            <div className="video-chat-wrapper">
                { }
                <video id="large-feed" ref={largeFeedEl} autoPlay controls playsInline></video>
                <video id="own-feed" ref={smallFeedEl} autoPlay controls playsInline></video>
                {apptInfo.professionalsFullName ? <CallInfo apptInfo={apptInfo}/> :<></>}
                <ChatWindow />
            </div>
            <ActionButtons smallFeedEl={smallFeedEl}/>
        </div>
    )
}

export default MainVideoPage