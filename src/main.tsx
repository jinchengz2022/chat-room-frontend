import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Login } from "./pages/Login/index.tsx";
import { Register } from "./pages/Login/Register.tsx";
import { App } from "./App.tsx";
import { FriendList } from "./pages/Friend/FriendList.tsx";
import { ChatList } from "./pages/Chat/ChatList.tsx";
import { RequestList } from "./pages/Friend/RequestList.tsx";
import { Chat } from "./pages/Chat/Chat.tsx";

const routeList = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/friend-list",
        element: <FriendList />,
      },
      {
        path: "/request-list",
        element: <RequestList />,
      },
      {
        path: "/chat-list",
        element: <ChatList />,
        children: [
          {
            path: "/chat-list/chat/:id",
            element: <Chat />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];

const router = createBrowserRouter(routeList);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>
);
