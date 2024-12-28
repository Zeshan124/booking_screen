import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div className="w-100 text-center mb-5">
      <Spinner style={{ color: "#0e2a7a", width: "50px", height: "50px" }} />
    </div>
  );
};

export default Loader;
