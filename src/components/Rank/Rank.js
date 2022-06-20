import React from "react";
import './Rank.css';

const Rank = ({name, entries}) => {

  const getFaceString = (entries) => {
    if (entries === "1") {
      return "face"
    } else {
      return "faces"
    }
  }

  return (
    <div className="rank dark-blue ma3 b">
      <span className="ma1 f3">Welcome back, <span className="dark-pink f2">{name}</span>.</span>
      <span className="ma1 f4">You have detected <span className="dark-pink f3">{entries}</span> {getFaceString(entries)} with SmartBrain.</span>
    </div>
  );
};

export default Rank;
