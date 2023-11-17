export class RestRepository {
  #apiUrl;

  constructor(apiUrl) {
    this.#apiUrl = apiUrl;
  }

  async list() {
    const res = await fetch(this.#apiUrl);
    const json = await res.json();
    return json["data"];
  }

  async create(body) {
    return fetch(this.#apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async delete(id) {
    return fetch(`${this.#apiUrl}/${id}`, {
      method: "DELETE",
    });
  }
}
