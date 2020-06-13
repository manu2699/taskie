import React, { useEffect } from 'react';
const Details = (props) => {
  useEffect(() => {
    console.log(props.match.params.id)
  }, [])
  return (
    <div>
      Details Route
    </div>
  )
}

export default Details;
