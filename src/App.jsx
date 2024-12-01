import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
//gemini sdk import
import { GoogleGenerativeAI } from "@google/generative-ai";
// components import
import Loading from "./components/Loading";

// Mui import
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

function App() {
  const [userInput, setUserInput] = useState("");
  const [chathistory, setChathistory] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  // initialize gemini
  const getAI = new GoogleGenerativeAI(import.meta.env.VITE_MODEL_AI);
  const model = getAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // handle user input
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // send user message to gemini
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);

    const updateInput = `You are an expert University Mentor specializing in guiding students for studying abroad in the USA, Australia, and Canada.
  Provide comprehensive advice on:
  - University selection based on academic and financial profiles.
  - Scholarship and financial aid opportunities.
  - Application processes (personal statements, letters of recommendation, etc.).
  - Visa processes and requirements.
  - Tips for adapting to new cultures and lifestyles.
  Respond concisely, politely, and in a professional tone. 

  User query: ${userInput}`;

    try {
      // gemini api call
      const result = await model.generateContent(updateInput);
      const response = result.response;

      // response to the chat history
      setChathistory([
        ...chathistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch (error) {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  // clear chat history
  const clearChat = () => {
    setChathistory([]);
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            University Counselor
          </Typography>
          <Typography variant="body2" gutterBottom>
            I will help you find the best university for studying abroad.
          </Typography>
          <List>
            {chathistory.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      message.type === "user" ? (
                        <Typography variant="body1">
                          <strong>You:</strong> {message.message}
                        </Typography>
                      ) : (
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                      )
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          {isloading && <Loading />}
          <TextField
            label="Ask your query"
            variant="outlined"
            fullWidth
            value={userInput}
            onChange={handleUserInput}
            sx={{ my: 2 }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isloading}
          >
            Send
          </Button>
          <Button variant="outlined" onClick={clearChat} sx={{ ml: 2 }}>
            Clear Chat
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default App;
