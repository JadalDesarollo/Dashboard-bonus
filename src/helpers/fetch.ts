const baseUrl = process.env.REACT_APP_BASE_URL;
//const baseUrlAuth = process.env.REACT_APP_BASE_URL_AUTH;

export const fetchAuth = async (
  endpoint: string,
  method = "GET",
  data?: any
) => {
  try {
    const url = `${baseUrl}/auth/${endpoint}`;
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
export const fetchAuthRefresh = async (method = "GET") => {
  try {
    const url = `${baseUrl}/auth/renewToken`;
    const token = localStorage.getItem("token") || "";
    const resp = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(resp)
    return await resp.json();
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
    const url = `${baseUrl}/${endpoint}`;
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
          'Authorization': `Bearer ${token}`
        },
      });
      return await resp.json();
    } else {
      const resp = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      return await resp.json();
    }
  } catch (error) {
    return;
  }
};
