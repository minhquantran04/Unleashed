import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { LoginUser, logout } from "../../service/AuthService";
import { Divider } from "@mui/material";
import { InputField } from "../inputs/InputField";
import { LoginBtn, LoginGooglebtn } from "../buttons/Button";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import Cookies from 'js-cookie';


const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username can't be blank"),
  password: Yup.string()
    .required("Password is required")
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const signIn = useSignIn();
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // const handleRememberMeChange = () => {
  //   setRememberMe((prev) => !prev);
  // };

  const onSubmit = async (values, { setSubmitting }) => {
    const authType = Cookies.get("_auth_type");
    const authToken = Cookies.get("_auth");

    if (authType && authToken) { // Check if both cookies exist
      const token = authType + " " + authToken;

      if (token) { // Check if token exists
        await logout(token);
      }
    }

    await LoginUser(values, navigate, signIn);
    setSubmitting(false);

  };

  return (
    <div className="pt-20">
      <h2 className="font-poppins text-5xl mb-6 text-left">Login</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* Username Input */}
            <InputField
              label="Username"
              name="username"
              placeholder="Enter your username"
              tabIndex={1}
            />
            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xl text-gray-500">Password</label>
                <button
                  type="button"
                  className="flex items-center text-gray-500 text-xl swap"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <>
                      <BiSolidHide className="mr-1 text-3xl text-gray-500" />{" "}
                      Hide
                    </>
                  ) : (
                    <>
                      <BiSolidShow className="mr-1 text-3xl text-gray-500" />{" "}
                      Show
                    </>
                  )}
                </button>
              </div>
              <InputField
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                tabIndex={2}
              />
            </div>

            {/* <AnimatedCheckbox handleRememberMeChange={handleRememberMeChange} rememberMe={rememberMe}/> */}

            <LoginBtn />
          </Form>
        )}
      </Formik>
      <div className="OtherFeature pt-10 flex justify-center">
        <Link to="/forgotPassword">
          <p className="font-semibold font-montserrat underline">
            Forgot password?
          </p>
        </Link>
      </div>
      <div className="register flex justify-center pt-5">
        <p className="font font-montserrat">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="underline font-medium font-montserrat"
          >
            Sign up
          </Link>
        </p>
      </div>
      <div className="otherLogin py-10">
        <Divider>Or continue with</Divider>
      </div>
      <div className="otherLogin flex flex-col items-center">
        <LoginGooglebtn signIn={signIn} />
      </div>
    </div>
  );
}
