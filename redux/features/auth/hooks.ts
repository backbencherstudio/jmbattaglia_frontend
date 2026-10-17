"use client";

import { baseApi, useLoginMutation } from "@/redux/api/baseApi";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import {
  logOut,
  selectCurrentRole,
  selectCurrentToken,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux/features/auth/authSlice";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);
  const role = useAppSelector(selectCurrentRole);
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [logIn, loginState] = useLoginMutation();
  const [logoutUser, logoutState] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser().unwrap();
      }
    } catch (error) {
      console.error(getErrorMessage(error, "Logout request failed."));
    } finally {
      dispatch(logOut());
      dispatch(baseApi.util.resetApiState());
    }
  };

  return {
    token,
    role,
    user,
    isAuthenticated,
    logIn,
    logOut: handleLogout,
    isLoginLoading: loginState.isLoading,
    isLogoutLoading: logoutState.isLoading,
    isLoading: loginState.isLoading || logoutState.isLoading,
    loginError: loginState.error,
    logoutError: logoutState.error,
  };
};
