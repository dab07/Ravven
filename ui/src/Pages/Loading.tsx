import React from "react";
import '../css/Loading.css';
export const Loading = () => {
  return (
      <div className="loader">
          <span className="loader-text">loading</span>
          <span className="load"></span>
      </div>
  );
}
