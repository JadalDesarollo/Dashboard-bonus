import { authStateUser } from "auth/context/AuthContext";
import { fetchAuth, fetchConToken, fetchSinToken } from "helpers/fetch";
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
  const resp = await fetchAuth("login", "POST", data);
  if (resp.success) {
    localStorage.setItem("token", resp.data.token);
    const { data: usuario } = resp;
    return {
      status: true,
      userData: {
        id: usuario.uid,
        logged: true,
        name: usuario.name,
        email: "email@test",
        rol: usuario.rol[0],
      },
    };
  }

};
const checkToken = async (): Promise<Login> => {
  const token = localStorage.getItem("token");
  if (!token) {
    return {
      status: false,
      userData: dataUserEmpty,
    };
  }
  const resp = await fetchConToken("login/renew");
  if (resp.ok) {
    localStorage.setItem("token", resp.token);
    const { usuario } = resp;
    return {
      status: false,
      userData: usuario,
    };
  } else {
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
