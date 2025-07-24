const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const publicFetch = async (endpoint, method = "GET", body = null) => {
  let params = {
    method,
    headers: {},
  };

  if (body) {
    params.body = JSON.stringify(body);
    params.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(apiUrl + endpoint, params);

    if (response.status >= 500) {
      console.error(response.status, response.statusText);
      return null;
    }

    if (response.status >= 400) {
      console.error(response.status, response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const privateFetch = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const params = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include", // importante si usas cookies en Codespaces
  };

  if (body) {
    params.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(apiUrl + endpoint, params);

    if (!response.ok) {
      console.warn(`❌ HTTP ${response.status} ${response.statusText}`);
      try {
        return await response.json();
      } catch {
        return { msg: `Error HTTP ${response.status}` };
      }
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error de red:", error);
    return { msg: "Error de red" };
  }
};
