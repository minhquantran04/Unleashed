import { jwtDecode } from "jwt-decode";
import { toast, Zoom } from "react-toastify";
import { apiClient } from "../core/api";


export const LoginUser = async (data, navigate, signIn) => {
  const loginPromise = apiClient
    .post("/api/auth/login", {
      username: data.username,
      password: data.password,
    })
    .then((response) => {
      const user = jwtDecode(response.data.token);

      signIn({
        auth: {
          token: response.data.token,
          type: "Bearer",
        },
        userState: {
          username: data.username,
          userImage: user.image,
          role: user.role?.[0]?.authority,
          userEmail: user.userEmail,
        },
      });
      // Check the user's role 
      user.role?.[0]?.authority === "CUSTOMER" ?
        navigate("/") : navigate("/Dashboard");

      return response;
    });

  toast.promise(
    loginPromise,
    {
      pending: "Logging in...",
      success: "Login successful!",
      error: {
        render({ data }) {
          const errorMessage =
            data?.response?.data?.message ||
            "An error occurred. Please try again.";
          return errorMessage;
        },
      },
    },
    {
      position: "bottom-center",
      transition: Zoom,
    }
  );

  try {
    await loginPromise;
  } catch (error) {
    // Errors are handled within toast.promise, so no need for additional handling here
  }
};

export const RegisterUser = async (data, navigate) => {
  try {
    await apiClient.post("/api/auth/register", {
      userUsername: data.username,
      userFullname: data.fullname,
      userEmail: data.email,
      userPassword: data.password,
      userPhone: data.phoneNumber,
    });

    localStorage.setItem("mail", data.email);

    navigate("/register/confirm-registration");
  } catch (error) {
    if (error.response.data.message) {
      toast.error(error.response.data.message, {
        position: "top-center",
        transition: Zoom,
      });
      throw new Error(error.response.data);
    } else {
      throw new Error("An error occurred. Please try again.");
    }
  }
};

export const HandleForgotPassword = async (data, navigate) => {
  try {
    const response = await apiClient.post("/api/auth/forgot-password", {
      email: data.email,
    });

    const token = response.data.token;

    localStorage.setItem("ForgotAuth", token);

    navigate("/forgotPassword/success");
  } catch (error) {
    toast.error(error.response.data, {
      position: "top-center",
      transition: Zoom,
    });
  }
};

export const HandleLoginGoogle = async (accessToken, navigate, signIn) => {
  try {
    const response = await apiClient.get(
      `/api/auth/google-callback?token=${accessToken}`
    );
    const user = jwtDecode(response.data.token);
    signIn({
      auth: {
        token: response.data.token,
        type: "Bearer",
      },
      userState: {
        username: user.sub,
        userImage: user.image,
        role: user.role?.[0]?.authority,
      },
    });

    toast.success("Login successful!" || response?.data?.message, {
      position: "bottom-center",
      transition: Zoom,
    });
    navigate("/");
  } catch (error) {
    console.error("Error in HandleLoginGoogle:", error);
  }
};

export const ResetPassword = async (password, email, token, navigate) => {
  try {
    const response = await apiClient.post("/api/auth/reset-password", {
      email: email,
      newPassword: password,
      token: token,
    });
    toast.success(response.data.message, {
      position: "bottom-center",
      transition: Zoom,
    });
    navigate("/reset-password/success");
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    toast.error(`Reset password error: ${errorMessage}`, {
      position: "bottom-center",
      transition: Zoom,
    });
  }
};

export const loginForStaffAndAdmin = async (data, navigate, signIn) => {
  const loginPromise = apiClient.post("/api/auth/login-for-staff-and-admin", {
    username: data.username,
    password: data.password,
  });

  toast.promise(
    loginPromise,
    {
      pending: "Logging in...",
      // success: "Login successful!",
      error: {
        render({ data }) {
          if (data.response) {
            const errorMessage =
              data.response.data?.message ||
              "An error occurred. Please try again.";
            return errorMessage;
          }
          return "An error occurred. Please try again.";
        },
      },
    },
    {
      position: "bottom-center",
      transition: Zoom,
    }
  );

  try {
    const response = await loginPromise;
    const user = jwtDecode(response.data.token);
    localStorage.setItem("userImage", user.image);
    localStorage.setItem("userFullName", user.fullName);
    console.log(response.data.token);
    console.log(user);

    signIn({
      auth: {
        token: response.data.token,
        type: "Bearer",
      },
      userState: {
        username: data.username,
        userFullName: user.fullName,
        userImage: user.image,
        role: user.role?.[0]?.authority,
      },
    });

    navigate("/Dashboard");
  } catch (error) {
    throw new Error(
      error.response?.data.message || "An error occurred. Please try again."
    );
  }
};

export const logout = (token) => {
  try {
    const response = apiClient.delete("/api/auth/logout", {
      headers: {
        Authorization: token,
      },
    })
    // console.log(response);
    return response;
  } catch (error) {
    // console.log(error)
  }
};

export const checkStatus = (token) => {
  try {
    const response = apiClient.get("/api/auth/token", {
      headers: {
        Authorization: token,
      },
    })
    // console.log(response);
    return response;
  } catch (error) {
    // console.log(error)
  }
};
