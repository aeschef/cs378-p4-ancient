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

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service


//url to database
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
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      setCurUser(user);
    } else {
      setCurUser(null);
    }
  });

  const sendData = () => {
    setFirstInputValue("");
    setPostType(null);
    const sampleDict = {
      type: postType,
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
  };

  // complete
  function createAcct(){
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setCurUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  //
  function loginToAccount (){
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setCurUser(user);
        setRetrieveType(user.uid);
        alert("new user" + user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  ///TODO make this work
  function GroceryList (){
    if (curUser !== null) {
      // User is signed in, see docs for a list of available properties
      const name = curUser.uid;
      //TODO retrieve info.... name == category
      return  (
        <div>
          getData()
          <TextField
          id="outlined-basic"
          label="Add to Grocery List"
          fullWidth
          value={firstInputValue}
          onChange={handleInputChange}
          variant="outlined"
          />
          <Button variant="contained" onClick={() => sendData()}>
            Save Grocery List
          </Button> <text> loggedin as {name} </text>
        </div>
      );
    } else {
      return <text> Not logged in to an account </text>;
    }
  }

  //TODO complete
  function logOut() {
    signOut(auth).then(() => {
      // Sign-out successful.
      setCurUser(null);
      alert("successfully logged out")
    }).catch((error) => {
      // An error happened.
      alert("uhoh something went oopsie")
    });
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

  //TODO use to change firstInputvalues
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

  const handleUsernameChange = (event) => {
    const target = event.target;
    setUsername(target.value);
    console.log(target.value);
  }

  const handlePassChange = (event) => {
    const target = event.target;
    setPassword(target.value);
    console.log(target.value);
  }

  return (
    <div className="App">
      <h1>React + Firebase Tutorial</h1>
      <h2>CS378 23Spring P4</h2>
      <div className="container">
        <TextField
          id="outlined-basic"
          label="Enter Email"
          fullWidth
          value={username}
          onChange={handleUsernameChange}
          variant="outlined"
        />
        <TextField
          id="outlined-basic"
          label="Enter Password"
          fullWidth
          value={password}
          onChange={handlePassChange}
          variant="outlined"
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={postType}
            label="Category"
            onChange={handlePostTypeChange}
          >
            <MenuItem value={"A"}>A</MenuItem>
            <MenuItem value={"B"}>B</MenuItem>
            <MenuItem value={"C"}>C</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => createAcct()}>
          Create Account
        </Button>
        <Button variant="contained" onClick={() => loginToAccount()}>
          Login to Account
        </Button>
        <text>{dataPostResult}</text>
      </div>
      <div className="container">
        <GroceryList label="Grocery List"> </GroceryList>
        <text>{dataRetrieveResult}</text>
        {secondInputValue && secondInputValue.length
          ? secondInputValue.map(function (data) {
              return (
                <span className="retrieved-data">
                  {"Items: " +
                    data["text"]}
                </span>
              );
            })
          : "No data with category " + retrieveType}
        <Button variant="contained" onClick={() => sendData()}>
          Retrieve data
        </Button>
        <Button id="logout" variant="contained"  onClick={() => logOut()}>
          LOG OUT
        </Button>
        
        
      </div>
    </div>
  );
}
