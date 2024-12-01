import React from "react";
import ReactMarkdown from "react-markdown";

const ChatHistory = ({ Chathistory }) => {
  return (
    <>
      {Chathistory.map((message, index) => (
        <div key={index}>{message.type === "user" && <span>You : </span>}</div>
      ))}
      <div>
        <ReactMarkdown>{message.message}</ReactMarkdown>
      </div>
    </>
  );
};

export default ChatHistory;
