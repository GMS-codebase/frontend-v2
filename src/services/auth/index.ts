import { LOGIN } from "@/actions/AuthActions";
import store from "@/store";
import { LogInForm, SetPasswordForm, SignUpForm } from "@/types/forms";
import { authorizedApi, unauthorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { Router } from "next/router";

class AuthService {
  async signup(data: SignUpForm, callback?: () => void) {
    try {
      await unauthorizedApi.post("/applicant/register", data);
      callback && callback();
    } catch (error: any) {
      notifications.show({
        title: error.response.message
          ? error.response.data.message
          : "Error Signing Up In",
        message: "There was an error singinup in",
        color: "red",
      });
    }
  }

  async login(data: LogInForm, push: (to: string) => void) {
    try {
      const response = await unauthorizedApi.post("/auth/login", data);
      setCookie("token", response.data.data.data);
      const tokenData: { role: string } = jwtDecode(response.data.data.data);
      console.log(tokenData);
      push(tokenData.role);
    } catch (error: any) {
      notifications.show({
        title: "Error Logging In ",
        message: error?.response?.data?.message,
        color: "red",
      });
    }
  }

  async requestReset(email: string, callback?: () => void) {
    try {
      await unauthorizedApi.put("/auth/password/reset", {
        email,
      });
      notifications.show({
        title: "Reset password email sent successfully",
        message: "Check your email for the reset password link",
        color: "green",
      });
      callback && callback();
    } catch (error: any) {
      notifications.show({
        title: "Error requesting to reset password  ",
        message: error?.response?.data?.message,
        color: "red",
      });
    }
  }
  async setPassword(
    data: SetPasswordForm,
    token: string,
    callback?: () => void
  ) {
    try {
      const response = await unauthorizedApi.post(
        `/auth/set-password?token=${token}`,
        data
      );
      setCookie("token", response.data.token);
      callback && callback();
    } catch (error) {
      notifications.show({
        title: "Error Setting Up Your Password ",
        message:
          "There was an error while setting up your password, Please recheck the link from your email or contact our team",
        color: "red",
      });
    }
  }
}

const service = new AuthService();
export default service;
