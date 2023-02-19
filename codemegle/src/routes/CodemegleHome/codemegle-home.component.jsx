import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, getToDoList, addToDoItem, deleteToDoItem } from "../../utils/firebase/firebase.utils";
import { useAuthState } from "react-firebase-hooks/auth";

// let startBtn = document.getElementById("startBtn");
let endBtn = document.getElementById("end-btn");
let videoPlayer1 = document.getElementById("videoPlayer1");
let videoPlayer2 = document.getElementById("videoPlayer2");

function addStreamToYourVideoTag(mediaTrack) {
	// Takes in a stream and assigns it to the <video> element
	videoPlayer1.srcObject = mediaTrack;
	videoPlayer1.hidden = false;
	videoPlayer1.autoplay = true;

    videoPlayer2.hidden = false;
    endBtn.hidden = false;
    endBtn.onclick = stopStream; 
}

const tokenGenerator = () =>
    window.millicast.Director.getPublisher({
        token: "16a0c61d23a4f66b75461311ebb815f1832bdf7291e8f487d99c662a4eae0ad0", 
        streamName: "lear5i93",
    });

    const publisher = new window.millicast.Publish("lear5i93", tokenGenerator);

async function connectStream() {
    // startBtn.disabled = true;
	// endBtn.disabled = false;

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
}

function stopStream() {
	//Ends Stream and resets browser.
    publisher.stop();
	location.reload(); // eslint-disable-line no-restricted-globals
}

const CodemegleHome = () => {
    const [user, loading, error] = useAuthState(auth);
    const [toDoItems, setToDoItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [refresh, setRefresh] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        // eslint-disable-next-line
    }, [user, loading, navigate]);

    useEffect(() => {
        if (!loading) {
            getToDoList(user.email).then((items) => setToDoItems(items));
        }
    }, [user, loading, newItem, refresh]);

    const handleAddNewItem = () => {
        addToDoItem(toDoItems, user.email, newItem);
        setNewItem("");
    };

    const handleDeleteItem = (deleteItem) => {
        deleteToDoItem(toDoItems, user.email, deleteItem);
        setRefresh(deleteItem);
    };

    return (
        <div>
            <h1>Codemegle</h1>

            {toDoItems && user ? (
                <table style={{
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div>
                        <tbody>
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
                            </tr>
                        </tbody>
                    </div>
                </table>
            ) : <h1>Loading Streams ...</h1>}
        </div>
    );
};


export default CodemegleHome;
