import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { FaTasks } from "react-icons/fa";
import { FiRefreshCw, FiDelete } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { ClipLoader } from "react-spinners";

const Details = (props) => {
  let [dets, setDets] = useState([])
  let [date, setDate] = useState("");
  let [err, setErr] = useState("");
  let [comment, setComment] = useState("")
  let { details, init, logOut, from, setFrom, getMyTasks, getPostedTasks, setLoad, load } = useContext(AuthContext);

  useEffect(() => {
    let token = localStorage.getItem("Token");
    if (token) {
      init();
      setLoad(true)
      axios.get(`/api/details/${props.match.params.id}`).then(resp => {
        if (resp.data[0] == undefined) {
          setErr(`No Task found :(`)
          setLoad(false)
        } else {
          console.log(resp.data[0])
          setDets(resp.data[0])
          setLoad(false)
        }
      }).catch(err => { })
    } else {
      props.history.push("/login")
    }
  }, [])

  useEffect(() => {
    let date = new Date(dets.dateAssigned)
    setDate(`${date.toDateString()} ${date.toLocaleTimeString()}`);
    if (dets.taskfrom == details.email || dets.taskto == details.email) {
      setComment(dets.comment)
    } else {
      setErr(`You are not Authorized to View this Task`)
    }
  }, [dets, details])

  let DeleteTask = () => {
    axios.get(`/api/deleteTask/${dets.id}`).then(resp => {
      console.log(resp.data)
      props.history.push("/");
    }).catch(err => {
      console.log(err)
    })
  }

  let UpdateComment = () => {
    axios.post(`/api/updateComment/${dets.id}`, { comment }).then(resp => {

    }).catch(err => {
      console.log(err)
    })
  }

  if (load) {
    return (
      <center>
        <br />
        <ClipLoader size={200} color={"#07575a"} loading={load} />
        <br />
        <h3>Please wait a moment.. We are getting Task details...</h3>
      </center>
    )
  } else {
    return (
      <div>
        <br /><br /><br />
        <center>
          <div className="blueCard" id="details">
            <div className="fl-row">
              <h3>Details of Task </h3>
              <div className="fl">
                <FaTasks className="fl-ico" />
              </div>
            </div>
            {dets.taskfrom == details.email || dets.taskto == details.email ?
              (<div>
                <center>
                  <h4> <span>Task Name - </span> {dets.name}</h4>
                  <h4> <span>Task Description - </span>{dets.taskdesc}</h4>
                  <h4> <span>Task Status - </span>{dets.status}</h4>
                  <h4> <span>Posted At - </span>{date}</h4>
                  <h4> <span>Comment </span></h4>
                  <input type="text" value={comment} onChange={e => setComment(e.target.value)} />
                  <button><div> <h3>Update Task</h3><FiRefreshCw size="25px" /></div></button>
                </center>
                {dets.taskfrom == details.email ?
                  (<center>
                    <button onClick={() => DeleteTask()}><div> <h3>Delete Task</h3><FiDelete size="25px" /></div></button>
                  </center>
                  )
                  :
                  (<span></span>)
                }
              </div>)
              :
              (<div>
                <h4>{err}</h4>
              </div>)
            }
          </div>
        </center>
      </div>
    )
  }
}

export default Details;
