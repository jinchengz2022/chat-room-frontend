import { Button, Image, Input, Popover, Space } from "antd";
import * as React from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";

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
  const { id } = useParams();
  const { userId } = jsonTranstion(localStorage.getItem("userInfo"));
  const [messageList, setMessageList] = React.useState<
    (Message & { sender: SenderInfomation; id: number })[]
  >([]);
  const [inputValue, setInputValue] = React.useState("");
  const socketRef = React.useRef<Socket>();
  const inputRef = React.useRef<any>();

  const getChatHistoryList = async (chatId: number) => {
    const res = await chatHistoryRequest.ChatHistoryList(chatId);
    setMessageList(res.data);
  };

  React.useEffect(() => {
    if (!id) {
      return;
    }
    const socket = (socketRef.current = io("http://localhost:3000"));

    socket.on("connect", () => {
      const payload: JoinRoomPayload = {
        chatRoomId: +id,
        userId,
      };

      socket.emit("joinRoom", payload);

      socket.on("message", (reply: Reply) => {
        getChatHistoryList(+id);
        setTimeout(() => {
          document
            .getElementById("bottom-bar")
            ?.scrollIntoView({ block: "end" });
        }, 300);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const sendMessage = () => {
    if (id) {
      const payload: SendMessagePayload = {
        sendUserId: userId,
        chatRoomId: +id,
        message: { type: "text", content: inputValue },
      };

      socketRef.current?.emit("sendMessage", payload);
      setInputValue("");
    }
  };

  return (
    <div>
      <div
        style={{
          height: "calc(100vh - 220px)",
          overflow: "auto",
          padding: "0 4px",
        }}
      >
        {messageList.map((i) => {
          const isSelf = i.sender.id === userId;
          return (
            <div
              key={i.id}
              style={{
                display: "flex",
                justifyContent: isSelf ? "end" : "start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  textAlign: isSelf ? "right" : "left",
                  maxWidth: "48%",
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
                    padding: "4px 12px",
                    minHeight: 26,
                  }}
                >
                  {i.type === "image" ? <Image src={i.content} /> : i.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div id="bottom-bar" key="bottom-bar" />
      <div
        style={{
          maxHeight: 130,
          marginTop: 12,
          borderTop: "1px solid rgba(5, 5, 5, 0.06)",
          padding: "8px 4px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Popover
              content={
                <EmojiPicker
                  data={data}
                  onEmojiSelect={(emoji: any) => {
                    setInputValue((pre) => pre + emoji.native);
                  }}
                />
              }
            >
              <Button type="link" style={{ paddingLeft: 0 }}>
                表情
              </Button>
            </Popover>
            <Button type="link">图片</Button>
          </div>
          <Button onClick={sendMessage}>发送</Button>
        </div>
        <Input.TextArea
          onChange={(v) => {
            setInputValue(v.target.value);
          }}
          value={inputValue}
          autoSize
          style={{ width: "calc(100vw - 400px)", marginTop: 8 }}
        />
      </div>
    </div>
  );
};
