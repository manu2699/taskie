import React, { createContext, useState, useEffect } from "react";

import axios from "axios";

export const AuthContext = createContext();

const AuthContextProvider = props => {
  let tok = localStorage.getItem("Token");

  let [isAuth, setIsAuth] = useState(tok);
  let [details, setDetails] = useState({ name: "", email: "", id: "" });
  let [posted, setPosted] = useState({ "open": [], "on": [], "over": [] })
  let [myTasks, setMyTasks] = useState({ "open": [], "on": [], "over": [] })
  let [from, setFrom] = useState(false);

  useEffect(() => { console.log(details) }, [details])

  // useEffect(() => {
  //   console.log(posted)
  // }, [posted])


  // useEffect(() => {
  //   console.log(myTasks)
  // }, [myTasks])

  const verify = data => {
    axios.post("/api/verify", { token: data }).then(resp => {
      if (resp.data.email) {
        setDetails({ email: resp.data.email, name: resp.data.name, id: resp.data.id })
      }
    }).catch(err => { })
  }

  const afterAuth = data => {
    setIsAuth(data);
    localStorage.setItem("Token", data);
    verify(data)
  };

  const logOut = () => {
    localStorage.removeItem("Token");
    setIsAuth(null);
    setDetails({ uname: "", uemail: "" });
  };

  const init = () => {
    verify(tok)
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth, details, posted, myTasks, from,
        afterAuth, logOut, init, setPosted, setMyTasks, setFrom
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
