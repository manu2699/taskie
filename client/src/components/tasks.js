import React, { useEffect } from 'react';
const Tasks = (props) => {
  useEffect(() => {

  }, [])
  return (
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
    </div>
  )
}

export default Tasks;
