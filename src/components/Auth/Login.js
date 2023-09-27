import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../errorModal/ErrorModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const apiUrl = `${process.env.REACT_APP_VERIFY_API}username=${username}&password=${password}`;

    try {
      const response = await fetch(apiUrl);

      if (response.status === 200) {
        const responseData = await response.json(); 
        const token = responseData.token;

        localStorage.setItem("token", token);

        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        const errorMessage =
          "Authentication failed. Please check your credentials.";
        console.log(`Status code: ${response.status}`);
        console.log(`Error message: ${errorMessage}`);
        setErrorMessage(errorMessage);
        setErrorModalIsOpen(true);
      }
    } catch (error) {
      console.error("An error occurred", error);
      const errorMessage = "An error occurred while processing your request.";
      console.log(`Error message: ${errorMessage}`);
      setErrorMessage(errorMessage);
      setErrorModalIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeErrorModal = () => {
    setErrorModalIsOpen(false);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mb-1 text-center font-bold sm:text-2xl md:text-3xl text-blue-400">
            HAC Quick Feed
          </h1>
          <h1 className="mb-20 text-center font-bold text-sm text-blue-400">
            Crafted by Krushil Amrutiya
          </h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Log in to your account
          </h2>
          <p className="mt-1 text-center text-sm font-normal text-white">
            <span className="text-rose-600 font-bold">*</span>Use your Parkland
            HAC login
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLoginFormSubmit}>
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={handleUsernameChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={handlePasswordChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                className="h-6 w-6"
              />
            </button>
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <div className="flex space-x-2 items-center">
                  <div className="w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>
        <ErrorModal
          isOpen={errorModalIsOpen}
          onClose={closeErrorModal}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}

export default Login;
