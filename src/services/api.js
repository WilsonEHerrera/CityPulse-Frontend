const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  return res.json();
}

export const noticiasService = {
  getAll: (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.municipio) params.append("municipio", filtros.municipio);
    if (filtros.barrio) params.append("barrio", filtros.barrio);
    if (filtros.limit) params.append("limit", String(filtros.limit));

    const query = params.toString();
    return fetchAPI(`/noticias${query ? `?${query}` : ""}`);
  },

  getById: (id) => fetchAPI(`/noticias/${id}`),
};
