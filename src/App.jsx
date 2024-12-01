import React, { useState } from "react";
//gemini sdk import
import { GoogleGenerativeAI } from "@google/generative-ai";
// components import
import ChatHistory from "./components/ChatHistory";
import Loading from "./components/Loading";
function App() {
  const [useInput, setUserInput] = useState("");
  const [chathistory, setChathistory] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  // initialize gemini
  const getAI = new GoogleGenerativeAI(import.meta.env.VITE_MODEL_AI);
  const model = getAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // send user message to gemini
  const sendMessage = async () => {
    if (useInput.trim() === "") return;

    setIsLoading(true);

    try {
      // gemini api call
      const result = await model.generateContent(userInput);
      const response = await result.response;

      // response to the chat history
      setChathistory([
        ...chathistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  // clear chat history
  const clearChat = () => {
    setchathistory([]);
  };

  return (
    <>
      <div>
        <h1>Univeristy Counselor</h1>

        <div>
          <ChatHistory chathistory={chathistory} />
          <Loading isloading={isloading} />
        </div>

        <div>
          <input
            type="text"
            placeholder="Ask your query"
            value={useInput}
            onChange={handleUserInput}
          />
          <button onClick={sendMessage} disabled={isloading}>
            Send
          </button>
        </div>

        <button onClick={clearChat}>Clear Chat</button>
      </div>
    </>
  );
}

export default App;
