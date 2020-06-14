import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import { GrUserSettings, GrAdd, GrClose } from "react-icons/gr";
import { FiUserPlus, FiUserCheck, FiLogOut } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import Tasks from "./tasks";
import axios from "axios";

const Dashboard = (props) => {
  let { details, init, logOut, from, setFrom, getMyTasks, getPostedTasks } = useContext(AuthContext);
  let [taskName, setName] = useState("");
  let [assignTo, setAssignTo] = useState("");
  let [taskDesc, setTaskDesc] = useState("");
  let [taskComment, setTaskComment] = useState("No Comments Yet..");
  let [ok, setOk] = useState(false);
  let [err, setErr] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("Token");
    if (token) {
      init();
    } else {
      props.history.push("/login")
    }
  }, [])

  useEffect(() => {
    if (!from && details.email) {
      getPostedTasks()
    } else if (from && details.email) {
      getMyTasks();
    }
  }, [from])

  useEffect(() => {
    console.log(details)
    if (!from) {
      getPostedTasks()
    } else {
      getMyTasks();
    }
  }, [details])

  let addTask = () => {
    setErr("")
    document.getElementById("AddTask-Overlay").style.display = "block";
  }

  let UserProfile = () => {
    document.getElementById("Profile-Overlay").style.display = "block";
  }

  let logout = () => {
    logOut();
    props.history.push("/login")
  }

  let postTask = () => {
    axios.post(`/api/postTask`, {
      taskComment, taskDesc,
      taskName, assignTo,
      fromEmail: details.email,
    }).then(resp => {
      if (resp.data.code) {
        console.log("Some error occured :(")
        setErr("Some error occured :(")
      } else if (resp.data.insertId) {
        setErr("")
        document.getElementById("AddTask-Overlay").style.display = "none";
      }
    }).catch(err => { setErr("Some error occured :(") })
  }

  let verifyAssignee = () => {
    if (details.email == assignTo) {
      setErr("You cant assign task to yourself.")
      return;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(assignTo)) {
      axios.get(`/api/verifyAssignee/${assignTo}`).then(resp => {
        if (resp.data.status) {
          setOk(true)
          setErr("")
        } else {
          setErr(resp.data.message)
        }
      }).catch(err => { console.log(err) })
    } else {
      setErr("Please provide valid email to find assignee")
    }
  }

  return (
    <div>
      <br />
      <center>
        {from ?
          (<div>
            <span className="underline" onClick={() => setFrom(false)}>Tasks that you assigned..</span>
            <span className="heading" >Tasks assigned to me</span>
          </div>)
          :
          (<div>
            <span className="heading">Tasks that you assigned..</span>
            <span className="underline" onClick={() => setFrom(true)}>Tasks assigned to me</span>
          </div>)
        }
      </center>

      <Tasks {...props} />
      <span className="float" onClick={() => { addTask() }}>
        <GrAdd className="fl-ico" />
      </span>
      <span className="float" id="userSettings" onClick={() => { UserProfile() }}>
        <GrUserSettings className="fl-ico" />
      </span>


      <div id="AddTask-Overlay">

        <div className="Content">
          <div className="blueCard" id="Form">
            <div className="fl-row">
              <h3>Add New Task</h3>
              <div className="fl" style={{ "cursor": "pointer" }} onClick={() => { setErr(""); document.getElementById("AddTask-Overlay").style.display = "none"; }}>
                <center>
                  <GrClose className="fl-ico" />
                </center>
              </div>
            </div>
            <h4>Task Title </h4>
            <input type="text" onChange={e => setName(e.target.value)} required />
            <h4>Task Description  <span> - brief about your task</span></h4>
            <input type="text" onChange={e => setTaskDesc(e.target.value)} required />
            <h4>Task To ?  <span> - Specify the email id of person whom you want to assign the task</span></h4>
            <input type="text" onChange={e => setAssignTo(e.target.value)} required />
            {/* <h4>Task Comment<span> - Optional</span></h4>
            <input type="text" onChange={e => setTaskComment(e.target.value)} /> */}
            <br />
            <br />
            <center>
              <h3>{err}</h3>
              {ok ?
                (<button onClick={() => {
                  if (taskName.length != 0 && taskDesc.length != 0 && assignTo.length != 0)
                    postTask()
                }}>
                  <div><h3>Add Task </h3><IoMdAdd size="25px" /></div>
                </button>
                ) : (<button onClick={() => verifyAssignee()}><div> <h3>Verify Task Assignie ?</h3><FiUserCheck size="25px" /></div></button>)}
            </center>
          </div>
        </div>
      </div>

      <div id="Profile-Overlay">
        <div className="Content">
          <div className="blueCard" id="Form">
            <div className="fl-row">
              <h3>Your Profile</h3>
              <div className="fl" style={{ "cursor": "pointer" }} onClick={() => { document.getElementById("Profile-Overlay").style.display = "none"; }}>
                <center>
                  <GrClose className="fl-ico" />
                </center>
              </div>
            </div>
            <center>
              <h4>Name : {details.name} </h4>
              <h4>eMail : {details.email} </h4>
              <button onClick={() => logout()}><div> <h3>LogOut</h3><FiLogOut size="25px" /></div></button>
            </center>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
