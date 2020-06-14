import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { FaTasks, FaCommentMedical } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { ClipLoader } from "react-spinners";
import { GoHome } from "react-icons/go";
import io from "socket.io-client";

const Details = (props) => {
  let [dets, setDets] = useState([])
  let [date, setDate] = useState("");
  let [err, setErr] = useState("");
  let [comment, setComment] = useState("")
  let [msgs, setMsg] = useState({})
  let [to, setTo] = useState("")
  let { details, init, url, setLoad, load, isAuth } = useContext(AuthContext);

  // const options = {
  //   headers: { 'auth': isAuth }
  // };

  // let sendWithHeaders = () => {
  //   if (comment.length != 0) {
  //     axios.post(`/api/addComment/${dets.id}`, { from: details.email, msg: comment, to, }, options).then(resp => {
  //       console.log(resp.data)
  //       setComment("");
  //       document.getElementById("comment").value = "";
  //     }).catch(err => { console.log(err) })
  //   }
  // }

  let autoScroll = () => {
    const container = document.getElementById("chat");
    if (container)
      container.scrollTo(0, container.scrollHeight);
  };

  let getComments = () => {
    axios.get(`/api/getComments/${props.match.params.id}`).then(resp => {
      console.log(resp.data)
      setMsg(resp.data)
      autoScroll()
    }).catch(err => { console.log(err) })
  }

  let addComment = () => {
    if (comment.length != 0) {
      axios.post(`/api/addComment/${dets.id}`, { from: details.email, msg: comment, to, }).then(resp => {
        console.log(resp.data)
        setComment("");
        document.getElementById("comment").value = "";
      }).catch(err => { console.log(err) })
    }
  }

  useEffect(() => {
    let socket = io.connect(url);

    socket.on(`comment/${props.match.params.id}`, (msg) => {
      getComments();
    })

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

    setTo(dets.taskto)
    if (dets.taskto == details.email)
      setTo(dets.taskfrom)

    let date = new Date(dets.dateAssigned)
    setDate(`${date.toDateString()} ${date.toLocaleTimeString()}`);
    if (dets.taskfrom == details.email || dets.taskto == details.email) {
      getComments();
    } else {
      setErr(`You are not Authorized to View this Task`)
    }
  }, [dets, details])

  useEffect(() => {
    console.log(msgs)
  }, [msgs])

  let DeleteTask = () => {
    axios.post(`/api/deleteTask/${dets.id}`, { user1: dets.taskfrom, user2: dets.taskto }).then(resp => {
      console.log(resp.data)
      props.history.push("/");
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

                <h4> <span>Task Name - </span> {dets.name}</h4>
                <h4> <span>Task Description - </span>{dets.taskdesc}</h4>
                <h4> <span>Task Status - </span>{dets.status}</h4>
                <h4> <span>Posted At - </span>{date}</h4>
                <br />
                <h4>Comments</h4>
                <div id="chat">
                  {msgs != undefined && msgs.length > 0 ? (
                    <div>
                      {msgs.map(msg => {
                        return (
                          <div>
                            {msg.cmntby == details.email ? (
                              <div id="sentMsg">
                                <div style={{ fontSize: "15px", fontWeight: "bold" }}>
                                  You
                                </div>
                                <div>{msg.cmnt}</div>
                              </div>
                            ) : (
                                <div id="receivedMsg">
                                  <div style={{ fontSize: "15px", fontWeight: "bold" }}>
                                    {msg.cmntby}
                                  </div>
                                  <div>{msg.cmnt}</div>
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                      <div>No Messages</div>
                    )}
                </div>
                <input id="comment" type="text" placeholder="Type your notes/comments.." onChange={e => setComment(e.target.value)} />
                <center>
                  <button onClick={() => addComment()}><div> <h3>Add Comment</h3><FaCommentMedical size="25px" /></div></button>
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
        <span className="float" id="home" onClick={() => {
          props.history.push("/")
        }}>
          <GoHome className="fl-ico" />
        </span>
      </div>
    )
  }
}

export default Details;
