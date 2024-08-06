// src/components/Login.js
import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import backgroundImage from "../assets/image4.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/AuthSlics";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, role, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      if (role === "admin") {
        navigateTo("/adminpanel");
      } else {
        navigateTo("/employeepanel");
      }
    }
  }, [token, role, navigateTo]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      className="flex justify-center items-center"
    >
      <div className="flex justify-center items-center ">
        <div className="h-auto w-full max-w-lg m-20 flex flex-col items-center bg-[#2E8231] bg-opacity-50 backdrop-blur-md rounded-3xl p-8">
          <img src={logo} alt="Logo" className="h-20 mb-2" />
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            LogIn
          </h2>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username@exinelabs.com"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="flex items-center justify-center mb-6">
              <button
                className="bg-[#364614] hover:bg-blue-700 w-[150px] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </div>
            {loading && <p className="text-white text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
          <p className="text-white text-sm text-center mt-4">
            © 2024 ExineLabs. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
