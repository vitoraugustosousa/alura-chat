import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, {useState, useEffect} from "react";
import { createClient } from '@supabase/supabase-js'
import appConfig from "../config.json";

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0Mzc5NTA2MiwiZXhwIjoxOTU5MzcxMDYyfQ.iEjseJK8CulADrU9gFz1ungLdzTTILvRLhjxXXy8cxY';
const SUPABASE_URL = 'https://lnwytseiwnrbrzgymkil.supabase.co';
const supaBaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);





export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messagesList, setMessageList] = useState([]);

  useEffect(() => {
    supaBaseClient
        .from('messages')
        .select('*')
        .order('id', {ascending: false})
        .then(({ data }) => {
            setMessageList(data);
    });
  }, []);

  function handleNewMessage(newMessage) {
    const message = {
      //id: messagesList.length + 1,
      text: newMessage,
      from: "vsousa",
    };

    supaBaseClient
        .from('messages')
        .insert([message])
        .then(({ data }) => {
            setMessageList([data[0], ...messagesList]);
        });
    setMessage("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList messages={messagesList} />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={message}
              onChange={(event) => {
                const msg = event.target.value;
                setMessage(msg);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNewMessage(message);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList({messages}) {
  
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowY: "auto",
        overflowx: "hide",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {messages.map(message => {
          return (
            <Text
            key={message.id}
            tag="li"
            styleSheet={{
              fontSize: "14px",
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${message.from}.png`}
              />
              <Text styleSheet={{fontSize: "12px"}} tag="strong">{message.from}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {message.text}
          </Text>
          );
      })}
    </Box>
  );
}
