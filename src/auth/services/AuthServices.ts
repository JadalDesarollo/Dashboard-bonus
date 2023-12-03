import { authStateUser } from "auth/context/AuthContext";
import {
  fetchAuth,
  fetchAuthRefresh,
  fetchConToken,
  fetchSinToken,
} from "helpers/fetch";
import { useCallback } from "react";

export interface Login {
  status: boolean;
  userData: authStateUser;
}
const dataUserEmpty: authStateUser = {
  id: null,
  logged: false,

  name: null,
  email: null,
  rol: null,
};
const login = async (data: {
  email: string;
  password: string;
}): Promise<Login> => {
  try {
    const resp = await fetchAuth("login", "POST", data);
    if (resp.success) {
      localStorage.setItem("token", resp.data.token);
      const { data: usuario } = resp;
      return {
        status: true,
        userData: {
          id: usuario.id,
          logged: true,
  
          name: usuario.name,
          email: "email@test",
          rol: usuario.rol[0],
        },
      };
    } else {
      return {
        status: false,
        userData: dataUserEmpty,
      };
    }
  } catch (error) {
    return {
      status: false,
      userData: dataUserEmpty,
    };
  }
};
const checkToken = async (): Promise<Login> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        status: false,
        userData: dataUserEmpty,
      };
    }
    const resp = await fetchAuthRefresh("refresh/token", "POST");

    if (resp.success) {
      localStorage.setItem("token", resp.data.token);
      const { data: usuario } = resp;

      return {
        status: true,
        userData: {
          id: usuario.id,
          logged: true,
          name: usuario.name,
          email: "email@test",
          rol: usuario.rol[0],
        },
      };
    } else {
      return {
        status: false,
        userData: dataUserEmpty,
      };
    }
  } catch (error) {
    return {
      status: false,
      userData: dataUserEmpty,
    };
  }
};
export const serviceAuth = {
  login,
  checkToken,
};
