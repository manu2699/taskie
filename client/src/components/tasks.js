import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import { GoLinkExternal } from "react-icons/go";
const Tasks = (props) => {
  let { posted, myTasks, from } = useContext(AuthContext);
  let [data, setData] = useState({ "open": [], "on": [], "over": [] })

  useEffect(() => {
    console.log(data)
  }, [data])

  useEffect(() => {
    if (!from) {
      setData(posted)
    } else {
      setData(myTasks)
    }
  }, [from])

  let moreInfo = () => {

  }

  let drag = (event) => {
    console.log("from", event.target.parentNode.id)
    console.log(from)
  }

  let drop = (event) => {
    console.log("to", event.target.parentNode.id)
  }

  let allowDrop = (event) => {
    if (from)
      event.preventDefault()
  }

  return (
    <div className="row">
      <div className="col" id="open">
        <span className="underline">Open Tasks</span>
        <center id="open">
          {data.open.map(items => {
            return (
              <div className="blueCard" id="task" draggable="true" onDragStart={(event) => { drag(event) }} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                <h3>{items.name}</h3>
                <h4>{items.taskdesc}</h4>
                <span className="abs" onClick={() => moreInfo()}><GoLinkExternal className="icon" /></span>
              </div>
            )
          })}
        </center>
      </div>
      <div className="col" id="on-progress">
        <span className="underline">Tasks on Progress</span>
        <center id="on-progress">
          {data.on.map(items => {
            return (
              <div className="blueCard" id="task" draggable="true" onDragStart={(event) => { drag(event) }} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                <h3>{items.name}</h3>
                <h4>{items.taskdesc}</h4>
                <span className="abs" onClick={() => moreInfo()}><GoLinkExternal className="icon" /></span>
              </div>
            )
          })}
        </center>
      </div>
      <div className="col" id="finished">
        <span className="underline">Finished Tasks</span>
        <center id="finished">
          {data.over.map(items => {
            return (
              <div className="blueCard" id="task" draggable="true" onDragStart={(event) => { drag(event) }} onDrop={(event) => { drop(event) }} onDragOver={(event) => { allowDrop(event) }}>
                <h3>{items.name}</h3>
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

export default Tasks;
