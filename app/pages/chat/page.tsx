"use client";
// components/ChatPanel.tsx

import React, { useState, useEffect } from "react";
import styles from "./chat.module.css";
import Image from "next/image";
import { io } from "socket.io-client";

interface Message {
  id: string;
  msg: string;
}

const ChatPanel = () => {
  //   console.log("render");
  const room = 0;
  const [inbox, setInbox] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  const [msgId, setMsgId] = useState<string | undefined>("");

  const sendMessage = () => {
    let msgObj = {
      id: msgId,
      msg: message,
    };
    console.log(msgObj);
    socket.emit("message", msgObj);
  };

  useEffect(() => {
    const socket = io("http://localhost:3003/");
    socket.on("connect", () => {
      console.log("Successfully connected!");
      console.log("socket id", socket.id);
      setMsgId(socket.id);
    });

    socket.on("message", (message) => {
      setInbox(message);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={styles.chatPanel}>
      <h2 className={styles.header}>Chat Panel</h2>

      <div className={styles.messageContainer}>
        {inbox &&
          inbox.map((elem, i) => {
            return (
              <div
                key={i}
                className={
                  elem.id == msgId ? styles.messageRight : styles.messageLeft
                }
              >
                <div
                  className={
                    elem.id == msgId
                      ? `${styles.in} ${styles.messageBox}`
                      : `${styles.out} ${styles.messageBox}`
                  }
                >
                  <Image
                    src="https://picsum.photos/200/300
      "
                    width={500}
                    height={500}
                    alt="Picture of the author"
                    className={styles.avatar}
                  />
                  <div className={styles.messageContent}>
                    <p className={styles.messageText}>{elem.msg}</p>
                    <span className={styles.messageUser}>afadasda</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className={styles.sendMessageForm}>
        <input
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          className={styles.input}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
