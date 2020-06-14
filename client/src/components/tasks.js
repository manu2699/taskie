import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import { GoLinkExternal } from "react-icons/go";
import { ClipLoader } from "react-spinners";
import axios from "axios";

const Tasks = (props) => {
  let { posted, myTasks, from, getMyTasks, getPostedTasks, load, setLoad } = useContext(AuthContext);
  let [data, setData] = useState({ "open": [], "on": [], "over": [] })
  let [toChange, setToChange] = useState(0)
  let [changeStatus, setchangeStatus] = useState("")

  let setLayout = () => {
    if (!from) {
      setData(posted)
    } else {
      setData(myTasks)
    }
  }

  useEffect(() => {
    setLayout();
  }, [])

  useEffect(() => {
    setLayout();
  }, [from, myTasks])

  let moreInfo = () => {

  }

  useEffect(() => {
    if (toChange != 0 && changeStatus != "") {
      setLoad(true)
      axios.get(`/api/changeStatus/${toChange}/${changeStatus}`).then(resp => {
        console.log(resp.data);
        getMyTasks();
      })
    }
  }, [toChange, changeStatus])

  let drag = (event) => {
    console.log("from", event.target.parentNode.id)
    console.log(event.target.childNodes[0].id)
    setToChange(event.target.childNodes[0].id)
  }

  let drop = (event) => {
    console.log("to", event.target.id)
    setchangeStatus(event.target.id)
  }

  let allowDrop = (event) => {
    if (from)
      event.preventDefault()
  }

  if (load) {
    return (
      <center>
        <br />
        <ClipLoader size={200} color={"#07575a"} loading={load} />
        <br />
        <h3>Please wait a moment.. We are updating Task Status...</h3>
      </center>
    )
  } else {
    return (
      <div className="row">
        <div className="col" id="open" onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
          <span className="underline">Open Tasks</span>
          <center>
            {data.open.map(items => {
              return (
                <div className="blueCard" id="task" draggable="true" onDragStart={(event) => { drag(event) }} >
                  <h3 id={items.id}>{items.name}</h3>
                  <h4>{items.taskdesc}</h4>
                  <span className="abs" onClick={() => moreInfo()}><GoLinkExternal className="icon" /></span>
                </div>
              )
            })}
          </center>
        </div>
        <div className="col" id="on" onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
          <span className="underline">Tasks on Progress</span>
          <center >
            {data.on.map(items => {
              return (
                <div className="blueCard" id="task" draggable="true" onDragStart={(event) => { drag(event) }}>
                  <h3 id={items.id}>{items.name}</h3>
                  <h4>{items.taskdesc}</h4>
                  <span className="abs" onClick={() => moreInfo()}><GoLinkExternal className="icon" /></span>
                </div>
              )
            })}
          </center>
        </div>
        <div className="col" id="over" onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
          <span className="underline">Finished Tasks</span>
          <center>
            {data.over.map(items => {
              return (
                <div className="blueCard" id="task" draggable="true" onDragStart={(event) => { drag(event) }} >
                  <h3 id={items.id}>{items.name}</h3>
                  <h4>{items.taskdesc}</h4>
                  <span className="abs" onClick={() => moreInfo()}><GoLinkExternal className="icon" /></span>
                </div>
              )
            })}
          </center>
        </div>
      </div>
    )
  }
}

export default Tasks;
