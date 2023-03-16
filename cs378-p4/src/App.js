import "./styles.css";
import { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";

//Authorization imports
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmLjnE7Yiuw8X6nbs2MWlonxLc3LctNk0",
  authDomain: "possible-p4-fd.firebaseapp.com",
  databaseURL: "https://possible-p4-fd-default-rtdb.firebaseio.com",
  projectId: "possible-p4-fd",
  storageBucket: "possible-p4-fd.appspot.com",
  messagingSenderId: "198847952081",
  appId: "1:198847952081:web:86b20e893b0495b28381f0",
  measurementId: "G-W0MNDYED6Q"
}; 

const app = initializeApp(firebaseConfig);


const databaseURL = "https://possible-p4-fd-default-rtdb.firebaseio.com/";

export default function App() {
  const [firstInputValue, setFirstInputValue] = useState(null);
  const [secondInputValue, setSecondInputValue] = useState(null);
  const [dataPostResult, setDataPostResult] = useState(null);
  const [dataRetrieveResult, setDataRetrieveResult] = useState(null);
  const [postType, setPostType] = useState(null);
  const [retrieveType, setRetrieveType] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [curUser, setCurUser] = useState(null);

    
  const auth = getAuth(app);

  const sendData = () => {
    if(curUser !== null) {
      console.log("sending items");
      setFirstInputValue("");
      setPostType(null);
      const sampleDict = {
        type: curUser.uid,
        date: new Date(),
        text: firstInputValue
      };
      return fetch(`${databaseURL + "/testData"}/.json`, {
        method: "POST",
        body: JSON.stringify(sampleDict)
      }).then((res) => {
        if (res.status !== 200) {
          setDataPostResult("There was an error: " + res.statusText);
          // throw new Error(res.statusText);
        } else {
          setDataPostResult("Successfully sent. Check Firebase console.");
          return;
        }
      });
    } else {
      alert("no one logged into account")
    }
  };

  function createAccount () {
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setCurUser(user);
        setRetrieveType(user.uid);
        console.log("user created");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("ERROR: " + errorMessage);
      });
  }

  function loginAccount(){
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setCurUser(user);
        setRetrieveType(user.uid);
        console.log("user logged in");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("ERROR: " + errorMessage);
      });
  }

  function logoutAccount(){
    signOut(auth).then(() => {
      // Sign-out successful.
      setCurUser(null);
      setRetrieveType(null);
      setSecondInputValue(null);
      alert("successfully logged out")
    }).catch((error) => {
      // An error happened.
      alert("uhoh something went oopsie")
    });
  }


  function GroceryList () {
    if(curUser !== null){
      
      setRetrieveType(curUser.uid);
      console.log(curUser.uid);
      return (
        <div>
          <Button variant="contained" onClick={() => getData()}>
            Get My List
          </Button>
          <p> ~~~~ Grocery List ~~~~ </p>
          {secondInputValue && secondInputValue.length
            ? secondInputValue.map(function (data) {
                return (
                  <span className="retrieved-data">
                    {data["text"] +
                      ", "}
                  </span>
                );
              })
            : "No list for user "}
          
        </div>
      );
    } else{
      return <p> no one logged in to account </p>;
    }
  }

  const getData = () => {
    //console.log(this.props.videoTime)
    fetch(`${databaseURL + "/testData"}/.json`)
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          setDataRetrieveResult("There was an error: " + res.statusText);
          // throw new Error(res.statusText);
        } else {
          setDataRetrieveResult("Successfully retrieved the data");
          return res.json();
        }
      })
      .then((res) => {
        if (res) {
          const keys = Object.keys(res);
          console.log(res);
          const dataPoints = keys
            .map((k) => res[k])
            .filter((e) => e["type"] === retrieveType);
          setSecondInputValue(dataPoints);
        }
      });
  };

  const handleInputChange = (event) => {
    const target = event.target;
    setFirstInputValue(target.value);
    console.log(target.value);
  };

  const handlePostTypeChange = (event) => {
    const target = event.target;
    setPostType(target.value);
    console.log(target.value);
  };

  const handleUserChange = (event) => {
    const target = event.target;
    setUsername(target.value);
    console.log(target.value);
  }
  const handlePassChange = (event) => {
    const target = event.target;
    setPassword(target.value);
    console.log(target.value);
  }

  const handleRetrieveTypeChange = (event) => {
    const target = event.target;
    setRetrieveType(target.value);
    console.log(target.value);
  };

  return (
    <div className="App">
      <h1>Grocery List</h1>
      <h2>CS378 23Spring P4</h2>
      <div className="container">
        <TextField
          id="outlined-basic"
          label="Email"
          fullWidth
          value={username}
          onChange={handleUserChange}
          variant="outlined"
        />
        <TextField
          id="outlined-basic"
          label="Password"
          fullWidth
          value={password}
          onChange={handlePassChange}
          variant="outlined"
        />

        <Button variant="contained" onClick={() => createAccount()}>
          Create New Account
        </Button>

        <Button variant="contained" onClick={() => loginAccount()}>
          Login
        </Button>

        <Button variant="contained" onClick={() => logoutAccount()}>
          Logout
        </Button>
      </div>

      
      <div className="container">
        <TextField
            id="outlined-basic"
            label="Add items"
            fullWidth
            value={firstInputValue}
            onChange={handleInputChange}
            variant="outlined"
          />
        <Button variant="contained" onClick={() => sendData()}>
          Save List
        </Button>
        <GroceryList> </GroceryList>


        
      </div>
    </div>
  );
}
