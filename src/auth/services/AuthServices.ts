import { authStateUser } from "auth/context/AuthContext";
import {
  fetchAuth,
  fetchAuthRefresh,
  fetchConToken,
  fetchSinToken,
} from "helpers/fetch";

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
  commerce_code: "",
};
const login = async (data: {
  username: string;
  password: string;
}): Promise<Login> => {
  try {
    const resp = await fetchAuth("login", "POST", data);
    console.log(resp);
    if (resp.success) {
      localStorage.setItem("token", resp.token);
      return {
        status: true,
        userData: {
          id: 1,
          logged: true,
          name: "usuario test",
          email: "email@test",
          rol: "bonus",
          commerce_code: "",
        },
      };
    } else {
      return {
        status: false,
        userData: dataUserEmpty,
      };
    }
  } catch (error) {
    console.log(error);
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
    const resp = await fetchAuthRefresh("POST");

    if (resp.success) {
      localStorage.setItem("token", resp.token);

      return {
        status: true,
        userData: {
          id: 1,
          logged: true,
          name: "usuario test",
          email: "email@test",
          rol: "bonus",
          commerce_code: "",
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
