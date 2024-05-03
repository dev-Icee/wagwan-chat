import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from "react-router-dom";

import Signin from "./pages/Signin";
import Chats from "./components/Chats";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Signin />} />
      <Route path="/chats" element={<Chats />} />
    </>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
