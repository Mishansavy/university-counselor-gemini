import React from "react";

const Loading = ({ isloading }) => {
  return (
    <div>
      {isloading && (
        <div>
          <div role="status">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default Loading;
