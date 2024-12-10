import axios from "axios";
import { AddFriendRequest, GetCodeRequest, UserRegisterRequest } from "./type";

const request = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 3000,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

request.interceptors.response.use((config) => {
  const token = config.headers.token;

  if (token) {
    localStorage.setItem("token", token);
  }

  return config;
});

const Register = (params: UserRegisterRequest) =>
  request.post("/user/CreateUser", params);

const Login = async (
  params: Pick<UserRegisterRequest, "userName" | "password">
) => {
  const res = await request.get("/user/Login", { params });
  localStorage.setItem("token", res.data.token),
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        userName: res.data.userName,
        userId: res.data.id,
      })
    );
  return res;
};

const GetCode = (params: GetCodeRequest) =>
  request.get("/user/GetCode", { params });

const UpdatePwd = (params: UserRegisterRequest) =>
  request.post("/user/UpdatePwd", params);

const UpdateUser = (params: Omit<UserRegisterRequest, "password">) =>
  request.post("/user/UpdateUser", params);

const List = () => request.get("/user/List");

export const userRequest = {
  Register,
  Login,
  GetCode,
  UpdatePwd,
  UpdateUser,
  List,
};

const AddFriend = (params: AddFriendRequest) =>
  request.post("/friendship/Add", params);

const ToAddList = () => request.get("/friendship/ToAddList");

const AgreeRequest = (id: number) => request.get(`/friendship/Agree/${id}`);

const RejectRequest = (id: number) => request.get(`/friendship/Reject/${id}`);

const DeleteRequest = (id: number) => request.get(`/friendship/Delete/${id}`);

const FriendListRequest = () => request.get(`/friendship/List`);

export const friendRequest = {
  AddFriend,
  ToAddList,
  AgreeRequest,
  RejectRequest,
  DeleteRequest,
  FriendListRequest,
};

const CreateGroup = (name: string) =>
  request.get(`/chatroom/CreateGroup`, { params: { name } });

const CreateOneByOne = (friendId: number) =>
  request.get(`/chatroom/CreateOneByOne/${friendId}`);

const ChatList = (type?: boolean) =>
  request.get(`/chatroom/ChatList`, { params: { type } });

const JoinChatRoom = (chatRoomName: string) =>
  request.get(`/chatroom/JoinChatRoom`, { params: { chatRoomName } });

const QuitChatRoom = (chatRoomId: number) =>
  request.get(`/chatroom/QuitChatRoom/${chatRoomId}`);

const ChatMemberList = (chatRoomId: number) =>
  request.get(`/chatroom/ChatMemberList/${chatRoomId}`);

const AddGroupMember = (params: { userId: number; chatRoomId: number }) =>
  request.post(`/chatroom/AddGroupMember`, params);

export const chatRequest = {
  CreateGroup,
  CreateOneByOne,
  ChatList,
  ChatMemberList,
  JoinChatRoom,
  QuitChatRoom,
  AddGroupMember
};

const ChatHistoryList = (chatRoomId: number) =>
  request.get(`/chat-history/list/${chatRoomId}`);

export const chatHistoryRequest = {
  ChatHistoryList,
};
