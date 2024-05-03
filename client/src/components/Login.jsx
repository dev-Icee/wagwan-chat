import React from "react";
import Create from "./Create";

const Login = () => {
  const submitHandler = e => {
    e.preventDefault();
    console.log();
  };
  return (
    <div className="flex-col">
      <form className="bg-green-500 p-10 flex-auto" onSubmit={submitHandler}>
        <div>
          <label htmlFor="email" className="text-gray-700 block text-6 mb-3">
            Email:
            <input
              className="p-2 font-6 border-black border-2 bg-green-200 rounded"
              type="email"
              id="email"
              name="email"
            />
          </label>
        </div>

        <div>
          <label htmlFor="password" className="text-gray-700 block text-6 mb-3">
            Password:
            <input
              className=" w-full p-2 font-6 border-inherit border-2 bg-green-200 rounded mb-6"
              type="password"
              id="password"
              name="password"
            />
          </label>
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-grey-600 rounded-md"
        >
          Sign In
        </button>
      </form>
      <Create />
    </div>
  );
};

export default Login;
