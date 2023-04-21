import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    // <div className="loading">
    //   <div></div>
    // </div>
    <div className="center-body">
      <div className="loader-ball-30">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
          <circle cx="50" cy="37" r="7" />
          <circle cx="62.5" cy="43.5" r="7" />
          <circle cx="62.5" cy="56.5" r="7" />
          <circle cx="50" cy="65" r="7" />
          <circle cx="37.5" cy="56.5" r="7" />
          <circle cx="37.5" cy="43.5" r="7" />
        </svg>
      </div>
    </div>
  );
};

export default Loader;
