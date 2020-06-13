import React, { createContext, useState, useEffect } from "react";

import axios from "axios";

export const AuthContext = createContext();

const AuthContextProvider = props => {
  let tok = localStorage.getItem("Token");

  const [isAuth, setIsAuth] = useState(tok);
  const [details, setDetails] = useState({ name: "", email: "", id: "" });

  useEffect(() => { console.log(details) }, [details])

  const verify = data => {
    axios.post("/verify", { token: data }).then(resp => {
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
      value={{ isAuth, details, afterAuth, logOut, init }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
