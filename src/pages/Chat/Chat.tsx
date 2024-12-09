import { Button, Image, Input, Space } from "antd";
import * as React from "react";
import { io, Socket } from "socket.io-client";
import { jsonTranstion } from "../../utils/jsonTranstion";
import { chatHistoryRequest } from "../../request";

interface Message {
  type: "text" | "image";
  content: string;
}

interface JoinRoomPayload {
  chatRoomId: number;
  userId: number;
}

interface SenderInfomation {
  headPic: string;
  nickName: string;
  userName: string;
  id: number;
}

interface SendMessagePayload {
  chatRoomId: number;
  sendUserId: number;
  message: Message;
}

type Reply =
  | {
      type: "sendMessage";
      userId: number;
      message: Message;
    }
  | { type: "joinRoom"; userId: number };

export const Chat = () => {
  const { userId } = jsonTranstion(localStorage.getItem("userInfo"));
  const [messageList, setMessageList] = React.useState<
    (Message & { sender: SenderInfomation })[]
  >([]);
  const socketRef = React.useRef<Socket>();
  const inputRef = React.useRef<any>();

  React.useEffect(() => {
    const socket = (socketRef.current = io("http://localhost:3000"));

    socket.on("connect", () => {
      const payload: JoinRoomPayload = {
        chatRoomId: 5,
        userId,
      };

      socket.emit("joinRoom", payload);

      socket.on("message", (reply: Reply) => {
        getChatHistoryList();
        setTimeout(() => {
          document
            .getElementById("bottom-bar")
            ?.scrollIntoView({ block: "end" });
        }, 300);
      });
    });
  }, []);

  const getChatHistoryList = async () => {
    const res = await chatHistoryRequest.ChatHistoryList(5);
    setMessageList(res.data);
  };

  const sendMessage = () => {
    const value = inputRef.current?.input?.value;

    const payload: SendMessagePayload = {
      sendUserId: userId,
      chatRoomId: 5,
      message: { type: "text", content: value },
    };

    socketRef.current?.emit("sendMessage", payload);
  };

  return (
    <>
      <div>
        {messageList.map((i) => {
          const isSelf = i.sender.id === userId;
          return (
            <div
              style={{
                textAlign: isSelf ? "right" : "left",
                width: "100%",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  color: isSelf ? "#1677ff" : "#000",
                }}
              >
                {i.sender.userName}
              </div>
              <div
                style={{
                  border: isSelf ? "1px solid #1AAd19" : "unset",
                  borderRadius: 4,
                  marginTop: 4,
                  backgroundColor: isSelf ? "#1AAd19" : "#f1f1f1",
                  color: isSelf ? "#fff" : "#000",
                  padding: "4px 8px",
                  // width: "50%",
                  // textAlign: isSelf ? "right" : "left"
                }}
              >
                {i.type === "image" ? <Image src={i.content} /> : i.content}
              </div>
            </div>
          );
        })}
      </div>
      <Space>
        <Input ref={inputRef} />
        <Button onClick={sendMessage}>send</Button>
      </Space>
      <div id="bottom-bar" key="bottom-bar" />

    </>
  );
};
