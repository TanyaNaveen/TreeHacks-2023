import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, getStream, setStreamStatus, getChallengeNumber, setChallengeNumber } from "../../utils/firebase/firebase.utils";
import { useAuthState } from "react-firebase-hooks/auth";
import "./codemegle-home.css";
import logo from "./logo.png";
import React from 'react'
import ReactMarkdown from 'react-markdown'
import ReactDom from 'react-dom'

import AceEditor from 'react-ace';


const challengeIDs = [
"5143cc9694a24abcd2000001",
"51689e27fe9a00b126000004",
"52b7ed099cdc285c300001cd",
"54b058ce56f22dc6fe0011df",
"55ec80d40d5de30631000025",
"56d060d90f9408fb3b000b03",
"58281843cea5349c9f000110",
"58296c407da141e2c7000271",
"58f6000bc0ec6451960000fd",
"59293c2cfafd38975600002d",
"601c6f43bee795000d950ed1",
"63022799acfb8d00285b4ea0",
"6355b3975abf4f0e5fb61670",
"638c92b10e43cc000e615a07",
"63b71bc0834251098ca84b05"
]


//let account_id_1 = "";
let account_id_2 ="hLBENr";

let publish_token_1 = "16a0c61d23a4f66b75461311ebb815f1832bdf7291e8f487d99c662a4eae0ad0";
//let publish_token_2 = "";

let stream_name_1 = "lear5i93";
let stream_name_2 = "leb2jnrj";

// let startBtn = document.getElementById("startBtn");
let endBtn = document.getElementById("end-btn");
let videoPlayer1 = document.getElementById("videoPlayer1");
let videoPlayer2 = document.getElementById("videoPlayer2");
let challenge_description = document.getElementById("challenge-description");
let challenge_category = document.getElementById("challenge-category");

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

function addStreamToYourVideoTag(mediaTrack) {
	// Takes in a stream and assigns it to the <video> element
	videoPlayer1.srcObject = mediaTrack;
	videoPlayer1.hidden = false;
	videoPlayer1.autoplay = true;

    videoPlayer2.hidden = false;
    videoPlayer2.src = `https://viewer.millicast.com?streamId=${account_id_2}/${stream_name_2}`;

    endBtn.hidden = false;
    endBtn.onclick = stopStream; 
}

const streamIDs = ["KzVX8Ky2Xuo8h5AnNJrI", "p5C4AysRihA3Q4UhOkiV"]


const tokenGenerator = () =>
    window.millicast.Director.getPublisher({
        token: publish_token_1, 
        streamName: stream_name_1,
    });

const publisher = new window.millicast.Publish(stream_name_1, tokenGenerator);

async function connectStream() {

    let currentUser = "";
    let otherUser = "";
    let streamIDChanged = null;

    let k = 0;

    for (let i = 0; i < 2; i++) {
        getStream(streamIDs[i]).then(
            (streamObject) => 
                (!streamObject.status && k == 0) ? 
                    (currentUser = streamObject, streamIDChanged = streamIDs[i],
                        k = k + 1,
                        console.log("HERE!")) :
                    (otherUser = streamObject,
                        console.log("HERE 2!"),
                        console.log(streamObject))
        );
    }

    //account_id_1 = currentUser["account-id"];
    account_id_2 = otherUser["account-id"];

    publish_token_1 = currentUser["publish-token"];
    //publish_token_2 = otherUser["publish-token"];

    stream_name_1 = currentUser["stream-name"];
    stream_name_2 = otherUser["stream-name"];

    setStreamStatus(streamIDChanged, true);

    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    addStreamToYourVideoTag(mediaStream);
    
    const broadcastOptions = {
        mediaStream: mediaStream
      };
      
      // Start broadcast
      try {
        await publisher.connect(broadcastOptions);

        //To view the stream navigate to: https://viewer.millicast.com?streamId=YOUR_ACCOUNT_ID/YOUR_STREAM_NAME
      } catch (e) {
        console.error('Connection failed, handle error', e);
      }

      let challenge_number = "51689e27fe9a00b126000004"

      try {
        let challenge_number = await getChallengeNumber();

        fetch(`https://www.codewars.com/api/v1/code-challenges/${challenge_number}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // This will log an array of challenge objects to the console

            challenge_description.innerHTML = "<ReactMarkdown>".concat(data["description"]).concat("</ReactMarkdown")

            let new_challenge_number = getRandomInt(0, 15);
            setChallengeNumber(challengeIDs[new_challenge_number]);
        })
        .catch(error => console.error(error));

      } catch(e) {
        console.error('Connection failed, handle error', e);
      }
}

function stopStream() {
	//Ends Stream and resets browser.
    publisher.stop();

    for (let i = 0; i < 2; i++) {
        setStreamStatus(streamIDs[i], false);
    }

	location.reload(); // eslint-disable-line no-restricted-globals
}

const CodemegleHome = () => {
    const [user, loading, error] = useAuthState(auth);
    const [toDoItems, setToDoItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    // const [refresh, setRefresh] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        // eslint-disable-next-line
    }, [user, loading, navigate]);

    return (
        <div>
            <img src={logo} alt="logo" height={150} width={400}/>

            {toDoItems && user ? (
                <table style={{
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div>
                        <tbody className='homeBody'>
                            <tr>
                                <td>{"Name (Optional)"}</td>
                            </tr>
                            <tr>
                                <td>
                                    <input value={newItem} type="text" id="newItem" name="newItem" onChange={(e) => {setNewItem(e.target.value)}} />
                                </td>
                            </tr>
                            <tr>
                                <td><button 
                                    variant="light"
                                    onClick={connectStream}
                                    >Pair Me</button>
                                </td>
                            </tr>
                            <tr>
                                <div>
                                    <AceEditor mode="java" theme="monokai" />
                                </div>
                            </tr>
                        </tbody>
                    </div>
                </table>
            ) : <h1>Loading Streams ...</h1>}
        </div>
    );
};


export default CodemegleHome;