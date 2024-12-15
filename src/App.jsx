// import React, { useState } from "react";
// import ReactMarkdown from "react-markdown";
// //gemini sdk import
// import { GoogleGenerativeAI } from "@google/generative-ai";
// // components import
// import Loading from "./components/Loading";

// // Mui import
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Container,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
// } from "@mui/material";

// function App() {
//   const [userInput, setUserInput] = useState("");
//   const [chathistory, setChathistory] = useState([]);
//   const [isloading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   // initialize gemini
//   const getAI = new GoogleGenerativeAI(import.meta.env.VITE_MODEL_AI);
//   const model = getAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   // handle user input
//   const handleUserInput = (e) => {
//     setUserInput(e.target.value);
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   };

//   // send user message to gemini
//   const sendMessage = async () => {
//     if (userInput.trim() === "") return;

//     setIsLoading(true);
//     setErrorMessage("");

//     //Build Chat History Context
//     //Limit chat history to last 10 messages
//     const MAX_HISTORY = 10;
//     const historyContext = chathistory
//       .slice(-MAX_HISTORY)
//       .map((message) =>
//         message.type === "user"
//           ? `User: ${message.message}`
//           : `Bot: ${message.message}`
//       )
//       .join("\n");

//     const updateInput = `You are an expert University Mentor specializing in guiding students for studying abroad in the USA, Australia, and Canada.
//   Provide comprehensive advice on:
//   - University selection based on academic and financial profiles.
//   - Scholarship and financial aid opportunities.
//   - Application processes (personal statements, letters of recommendation, etc.).
//   - Visa processes and requirements.
//   - Tips for adapting to new cultures and lifestyles.
//   Respond concisely, politely, and in a professional tone.

//   Previous conversation for context:
//   ${historyContext}

//   User query: ${userInput}`;

//     try {
//       // gemini api call
//       const result = await model.generateContent(updateInput);
//       const response = result.response;

//       // Update chat history
//       setChathistory([
//         ...chathistory,
//         { type: "user", message: userInput },
//         { type: "bot", message: response.text() },
//       ]);
//     } catch (error) {
//       console.error("Error sending message");
//       setErrorMessage("Something went wrong. Please try again.");
//     } finally {
//       setUserInput("");
//       setIsLoading(false);
//     }
//   };

//   // clear chat history
//   const clearChat = () => {
//     setChathistory([]);
//   };

//   return (
//     <>
//       <Container maxWidth="sm">
//         <Box sx={{ my: 4 }}>
//           <Typography variant="h4" component="h1" gutterBottom>
//             University Counselor
//           </Typography>
//           <Typography variant="body2" gutterBottom>
//             I will help you find the best university for studying abroad.
//           </Typography>
//           {errorMessage && (
//             <Typography variant="body2" color="error" gutterBottom>
//               {errorMessage}
//             </Typography>
//           )}
//           <List>
//             {chathistory.map((message, index) => (
//               <React.Fragment key={index}>
//                 <ListItem>
//                   <ListItemText
//                     primary={
//                       message.type === "user" ? (
//                         <Typography variant="body1">
//                           <strong>You:</strong> {message.message}
//                         </Typography>
//                       ) : (
//                         <ReactMarkdown>{message.message}</ReactMarkdown>
//                       )
//                     }
//                   />
//                 </ListItem>
//                 <Divider />
//               </React.Fragment>
//             ))}
//           </List>
//           {isloading && <Loading />}
//           <TextField
//             label="Ask your query"
//             variant="outlined"
//             fullWidth
//             value={userInput}
//             onChange={handleUserInput}
//             sx={{ my: 2 }}
//           />
//           <Button
//             variant="contained"
//             onClick={sendMessage}
//             disabled={isloading}
//           >
//             Send
//           </Button>
//           <Button variant="outlined" onClick={clearChat} sx={{ ml: 2 }}>
//             Clear Chat
//           </Button>
//         </Box>
//       </Container>
//     </>
//   );
// }

// export default App;

// test ui
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Loading from "./components/Loading";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Main App Component
function App() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize Gemini API
  const getAI = new GoogleGenerativeAI(import.meta.env.VITE_MODEL_AI);
  const model = getAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
    if (e.key === "Enter") sendMessage();
  };

  // Send message to Gemini API
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    setErrorMessage("");

    // Build chat context with a maximum of 10 previous messages
    const MAX_HISTORY = 10;
    const historyContext = chatHistory
      .slice(-MAX_HISTORY)
      .map((message) =>
        message.type === "user"
          ? `User: ${message.message}`
          : `Bot: ${message.message}`
      )
      .join("\n");

    const requestInput = `You are an expert University Mentor specializing in guiding students for studying abroad in the USA, Australia, and Canada.
      Provide comprehensive advice on:
      - University selection based on academic and financial profiles.
      - Scholarship and financial aid opportunities.
      - Application processes (personal statements, letters of recommendation, etc.).
      - Visa processes and requirements.
      - Tips for adapting to new cultures and lifestyles.
      Respond concisely, politely, and in a professional tone. 

      Previous conversation for context:
      ${historyContext}

      User query: ${userInput}`;

    try {
      const result = await model.generateContent(requestInput);
      const response = result.response;

      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>University Counselor</h1>
        <p>I will help you find the best university for studying abroad.</p>
      </header>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <ChatHistory chatHistory={chatHistory} />
      {isLoading && <Loading />}
      <ChatInput
        userInput={userInput}
        handleUserInput={handleUserInput}
        sendMessage={sendMessage}
        clearChat={clearChat}
      />
    </div>
  );
}

// Chat History Component
function ChatHistory({ chatHistory }) {
  return (
    <div className="chat-history">
      {chatHistory.map((message, index) => (
        <div key={index} className={`chat-message ${message.type}`}>
          {message.type === "user" ? (
            <strong>You:</strong>
          ) : (
            <ReactMarkdown>{message.message}</ReactMarkdown>
          )}
        </div>
      ))}
    </div>
  );
}

// Chat Input Component
function ChatInput({ userInput, handleUserInput, sendMessage, clearChat }) {
  return (
    <div className="chat-input-container">
      <textarea
        className="chat-input"
        placeholder="Ask your query..."
        value={userInput}
        onChange={handleUserInput}
        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
      />
      <div className="button-group">
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
        <button className="clear-button" onClick={clearChat}>
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default App;
