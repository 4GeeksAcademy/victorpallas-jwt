const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const publicFetch = async (endpoint, method = "GET", body = null) => {
  //Inicializar los parámetros de la petición con el método
  let params = { method, headers: { "Access-Control-Allow-Origin": "*" } };
  if (body) {
    params.body = JSON.stringify(body);
    params.headers["Content-Type"] = "application/json";
  }

  try {
    let response = await fetch(apiUrl + endpoint, params);
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
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    params.body = JSON.stringify(body);
    params.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + endpoint,
      params
    );

    if (!response.ok) {
      console.warn(`❌ HTTP ${response.status} ${response.statusText}`);
      // intentar extraer JSON, pero proteger por si no hay
      try {
        return await response.json();
      } catch {
        return { msg: `Error HTTP ${response.status}` };
      }
    }

    return await response.json(); // éxito
  } catch (error) {
    console.error("❌ Error de red:", error);
    return { msg: "Error de red" };
  }
};
