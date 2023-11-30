const baseUrl = process.env.REACT_APP_BASE_URL;
const baseUrlAuth = process.env.REACT_APP_BASE_URL_AUTH;

export const fetchAuth = async (
  endpoint: string,
  method = "GET",
  data?: any
) => {
  try {
    const url = `${baseUrlAuth}/${endpoint}`;
    if (method === "GET") {
      const resp = await fetch(url);
      return await resp.json();
    } else {
      const resp = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await resp.json();
    }
  } catch (error) {
    return;
  }
};
export const fetchAuthRefresh = async (
  endpoint: string,
  method = "GET",
  data?: any
) => {
  try {
    const url = `${baseUrlAuth}/${endpoint}`;

    const token = localStorage.getItem("token") || "";
    if (method === "GET") {
      const resp = await fetch(url);
      return await resp.json();
    } else {
      const resp = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await resp.json();
    }
  } catch (error) {
    return;
  }
};
export const fetchSinToken = async (
  endpoint: string,
  method = "GET",
  data?: any
) => {
  try {
    const url = `${baseUrlAuth}/${endpoint}`;
    if (method === "GET") {
      const resp = await fetch(url);
      return await resp.json();
    } else {
      const resp = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await resp.json();
    }
  } catch (error) {
    return;
  }
};
export const fetchConToken = async (
  endpoint: string,
  method = "GET",
  data?: any
) => {
  try {
    const url = `${baseUrl}/${endpoint}`;
    const token = localStorage.getItem("token") || "";

    if (method === "GET") {
      const resp = await fetch(url, {
        headers: {
          "x-token": token,
        },
      });
      return await resp.json();
    } else {
      const resp = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
          "x-token": token,
        },
        body: JSON.stringify(data),
      });
      return await resp.json();
    }
  } catch (error) {
    return;
  }
};
