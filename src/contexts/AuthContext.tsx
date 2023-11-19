import React, { useState, useEffect } from "react";
import { createContext, ReactNode } from "react";

import { api } from "../service/api";
import { UserDTO } from "../dtos/UserDto";
import Utils from "../utils/utils";

import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from "../storage/storageUser";

import {
  storageAuthTokenSave,
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from "../storage/storageAuthToken";

export type AuthContextDataProps = {
  user: UserDTO;
  isLoadingUserStorageData: boolean;
  singOut: () => Promise<void>;
  singIn: (email: string, password: string) => Promise<void>;
  userAvatar: string;
  authToken: string;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const classUtils = Utils.getInstance();
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(false);
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [userAvatar, setUserAvatar] = useState("");
  const [authToken, setAuthToken] = useState("");

  async function contextStorageTokenAndUserUpdate(
    userData: UserDTO,
    token: string
  ) {
    let userAvatarAux = `${api.defaults.baseURL}/images/${userData.avatar}`;
    setUserAvatar(userAvatarAux);
    setUser(userData);
    setAuthToken(token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  async function contextStorageUserAndToken(userData: UserDTO, token: string, refresh_token: string) {
    setIsLoadingUserStorageData(true);
    console.log('token', token)
    try {
      await storageUserSave(userData);
      await storageAuthTokenSave({token, refresh_token});
      await contextStorageTokenAndUserUpdate(userData, token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function singIn(email: string, password: string) {
    try {
      await api
        .post("/sessions", { email, password })
        .then(async (response) => {
          setIsLoadingUserStorageData(true);
          console.log("response", response.data);
          if (response.data && response.data.token && response.data.refresh_token) {
            await contextStorageUserAndToken(
              response.data.user,
              response.data.token,
              response.data.refresh_token
            );
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function singOut() {
    setIsLoadingUserStorageData(true);
    try {
      setUser({} as UserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);
      const userLogged = await storageUserGet();
      const {token} = await storageAuthTokenGet();

      if (userLogged && token) {
        contextStorageTokenAndUserUpdate(userLogged, token);
      }
    } catch (error) {
      console.log("não foi possivel pegar as informções do storage", error);
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenMenager(singOut)

    return () => {
      subscribe();
    }
  }, [singOut])


  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        userAvatar,
        singIn,
        isLoadingUserStorageData,
        singOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
