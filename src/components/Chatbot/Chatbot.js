import { AmplifyChatbot } from "@aws-amplify/ui-react";
import React, { useEffect } from "react";
import {
    makeStyles,
    Button
} from '@material-ui/core'

const useStyles = makeStyles({
    containerStyle: {
        paddingTop: '2em',
        paddingLeft: '5em',
        paddingRight: '5em'
    },    
    buttons: {
        marginTop: '25px',
        marginBottom: '30px'
    },
    field: {
        marginTop: '20px',
        marginBottom: '20px',
        display: 'block'        
    }
  })

const Chatbot = props => {

    const classes = useStyles()

  const handleChatComplete = event => {
    const { data, err } = event.detail;
    if (data) console.log("Chat fulfilled!", JSON.stringify(data));
    if (err) console.error("Chat failed:", err);
  };

  useEffect(() => {
    const chatbotElement = document.querySelector("amplify-chatbot");
    chatbotElement.addEventListener("chatCompleted", handleChatComplete);
    return function cleanup() {
      chatbotElement.removeEventListener("chatCompleted", handleChatComplete);
    };
  }, []);

  return (
    <div className={classes.containerStyle}>
        <AmplifyChatbot
            botName="myjotbot_chatbot_dev"
            botTitle="This is the JotBot chatbot."
            welcomeMessage="Hi! This is the JotBot chatbot. How can I help you?"
            voiceEnabled="true"
        />
    </div>
  );
};

export default Chatbot;