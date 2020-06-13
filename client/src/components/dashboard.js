import React, { useEffect, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { GrUserSettings, GrAdd, GrClose } from "react-icons/gr";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
const Dashboard = (props) => {
  let { details, init } = useContext(AuthContext);
  useEffect(() => {
    let token = localStorage.getItem("Token");
    if (token) {
      init();
    } else {
      props.history.push('/login');
    }
  }, [])
  useEffect(() => {
    console.log(details)
  }, [details])

  let addTask = () => {
    console.log("works")
    document.getElementById("AddTask-Overlay").style.display = "block";
  }

  let UserProfile = () => {

  }

  return (
    <div>
      <div className="row">
        <div className="col" id="open">
          <span className="underline">Open Tasks</span>
        </div>
        <div className="col" id="on-progress">
          <span className="underline">Tasks on Progress</span>
        </div>
        <div className="col" id="finished">
          <span className="underline">Finished Tasks</span>
        </div>
        <span className="float" onClick={() => { addTask() }}>
          <GrAdd className="fl-ico" />
        </span>
        <span className="float" id="userSettings" onClick={() => { UserProfile() }}>
          <GrUserSettings className="fl-ico" />
        </span>
      </div>
      <div id="AddTask-Overlay">
        <div className="Content">
          <div className="blueCard" id="Form">
            <div className="fl-row">
              <h3>Add New Task</h3>
              <div className="fl" style={{ "cursor": "pointer" }} onClick={() => { document.getElementById("AddTask-Overlay").style.display = "none"; }}>
                <center>
                  <GrClose className="fl-ico" />
                </center>
              </div>
            </div>
            <h4>Task Title </h4>
            <input type="text" />
            <h4>Task Description  <span> - brief about your task</span></h4>
            <input type="text" />
            <h4>Task To ?  <span> - Specify the person whom you want to assign the task</span></h4>
            <input type="text" />
            <br />
            <br />
            <center>
              <button><div> <h3>Verify Task Assignie ?</h3><FiUserCheck size="25px" /></div></button>
              <br />
              <button><div> <h3>Add Task </h3><IoMdAdd size="25px" /></div></button>
            </center>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
