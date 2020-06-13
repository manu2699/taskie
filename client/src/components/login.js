import React, { useEffect, useState } from 'react';

import { FiUserPlus, FiUserCheck } from "react-icons/fi";

const Login = () => {
  let [createNew, setCreateNew] = useState(false); //to indicate signup
  //basic credentials
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");
  let [confirmPass, setConfirmPass] = useState("");
  //for validating inputs
  let [vEmail, setvEmail] = useState(false);
  let [vPass, setvPass] = useState(false);
  let [samepass, setsamePass] = useState(false);
  let [ok, setOk] = useState(false);

  let checkEmail = () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setvEmail(true)
    } else {
      setvEmail(false)
    }
  };

  let checkPassword = () => {
    if (/^[A-Za-z0-9]\w{7,}$/.test(pass)) {
      setvPass(true);
    } else {
      setvPass(false)
    }
  };

  let checkConfirmPassword = () => {
    if (pass == confirmPass) {
      setsamePass(true)
    } else {
      setsamePass(false)
    }
  };

  let signUp = () => {

  }

  let signIn = () => {

  }

  useEffect(() => {
    checkEmail();
    checkPassword();
    checkConfirmPassword();
  }, [email, pass, confirmPass, createNew])

  useEffect(() => {
    if (!createNew) {
      if (vEmail && vPass) {
        document.getElementById("log").className = "enabled";
        setOk(true)
      } else {
        document.getElementById("log").className = "disabled";
        setOk(false)
      }
    } else {
      if (vEmail && vPass && samepass && createNew) {
        document.getElementById("reg").className = "enabled";
        setOk(true)
      } else {
        document.getElementById("reg").className = "disabled";
        setOk(false)
      }
    }
  }, [vEmail, vPass, samepass, createNew]);

  return (
    <div>
      <center>
        <br />
        <br />
        <div className="blueCard" id="loginForm">
          <div className="fl-row">
            {createNew ? (<h3>Create New Account</h3>) : (<h3>Login to your account</h3>)}
            <div className="fl">
              <center>
                {createNew ? (<FiUserPlus className="fl-ico" />) : (<FiUserCheck className="fl-ico" />)}
              </center>
            </div>
          </div>
          <h4>Email <span>- Provide a Valid Email</span></h4>
          <input type="text" onChange={e => setEmail(e.target.value)} />
          <h4>Password <span>- Minimum of 8 Characters</span></h4>
          <input type="text" onChange={e => setPass(e.target.value)} />
          {createNew ? (
            <div>
              <h4>Confirm Password  <span> - Passwords must matching</span></h4>
              <input type="text" onChange={e => setConfirmPass(e.target.value)} />
            </div>
          ) :
            (<span></span>)}
          <br />

          <center>
            <br />
            {createNew ?
              (
                <button
                  id="reg"
                  className="disabled"
                  onClick={() => {
                    if (ok) {
                      signUp()
                    }
                  }}>
                  <div> <h3>Get set go..</h3><FiUserPlus size="25px" /></div>
                </button>
              ) : (
                <button
                  id="log"
                  className="disabled"
                  onClick={() => {
                    if (ok) {
                      signIn()
                    }
                  }}>
                  <div> <h3>Let me in..</h3><FiUserCheck size="25px" /></div>
                </button>)
            }
            <br />
            {createNew ?
              (<button onClick={() => { setCreateNew(false) }}><div> <h3>Already Having ?</h3><FiUserCheck size="25px" /></div></button>)
              :
              (<button onClick={() => { setCreateNew(true) }}><div> <h3>Create New...</h3><FiUserPlus size="25px" /></div></button>)
            }
          </center>

        </div>
      </center>
    </div>
  );
}

export default Login;
