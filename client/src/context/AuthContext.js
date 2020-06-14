import React, { createContext, useState, useEffect } from "react";

import axios from "axios";
import io from "socket.io-client";

export const AuthContext = createContext();

const AuthContextProvider = props => {

  // let [url, setURL] = useState("http://localhost:5000");
  let [url, setURL] = useState("https://taskiee.herokuapp.com");

  let tok = localStorage.getItem("Token");

  let [isAuth, setIsAuth] = useState(tok);
  let [details, setDetails] = useState({ name: "", email: "", id: "" });
  let [posted, setPosted] = useState({ "open": [], "on": [], "over": [] })
  let [myTasks, setMyTasks] = useState({ "open": [], "on": [], "over": [] })
  let [from, setFrom] = useState(false);
  let [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(false)
    // console.log(myTasks)
  }, [myTasks])

  useEffect(() => {
    // console.log(posted)
  }, [posted])

  useEffect(() => {
    if (details.email != "") {

      getMyTasks()
      getPostedTasks()

      let socket = io.connect(url);
      socket.on(`newChanges/${details.email}`, (msg) => {
        getMyTasks();
        getPostedTasks();
      })
    }

  }, [details])

  let getPostedTasks = () => {
    axios.get(`/api/toTasks/${details.email}`).then(resp => {
      let open = [], on = [], over = []
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i].status == "open") {
          open.push(resp.data[i])
        } else if (resp.data[i].status == "on") {
          on.push(resp.data[i])
        } else if (resp.data[i].status == "over") {
          over.push(resp.data[i])
        }
      }
      setPosted({ open, on, over })
    })
  }

  let getMyTasks = () => {
    console.log(details.email)
    axios.get(`/api/myTasks/${details.email}`).then(resp => {
      let open = [], on = [], over = []
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i].status == "open") {
          open.push(resp.data[i])
        } else if (resp.data[i].status == "on") {
          on.push(resp.data[i])
        } else if (resp.data[i].status == "over") {
          over.push(resp.data[i])
        }
      }
      setMyTasks({ open, on, over })
    })
  }

  let verify = data => {
    axios.post("/api/verify", { token: data }).then(resp => {
      if (resp.data.email) {
        setDetails({ email: resp.data.email, name: resp.data.name, id: resp.data.id })
      }
    }).catch(err => { })
  }

  let afterAuth = data => {
    setIsAuth(data);
    localStorage.setItem("Token", data);
    verify(data)
  };

  let logOut = () => {
    localStorage.removeItem("Token");
    setIsAuth(null);
    setDetails({ uname: "", uemail: "" });
  };

  let init = () => {
    verify(tok)
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth, details, posted, myTasks, from, load, url,
        afterAuth, logOut, init, setPosted, setMyTasks, setFrom, getMyTasks, getPostedTasks, setLoad
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
