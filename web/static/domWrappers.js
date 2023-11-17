export class Form {
  #dom;
  onSubmit = async (target) => console.log(target);

  constructor(formId) {
    this.#dom = document.getElementById(formId);
    this.#dom.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.onSubmit(e.target);
    });
  }
}

export class SelectBox {
  #dom;
  constructor(selectBoxId) {
    this.#dom = document.getElementById(selectBoxId);
  }

  clear() {
    this.#dom.innerHTML = "";
  }

  addOption({ value, text }) {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = text;
    this.#dom.appendChild(option);
  }
}

export class TableBody {
  #dom;
  constructor(tableBodyId) {
    this.#dom = document.getElementById(tableBodyId);
  }

  clear() {
    this.#dom.innerHTML = "";
  }

  addRow(doms) {
    const tr = document.createElement("tr");
    doms
      .map((dom) => {
        const td = document.createElement("td");
        td.appendChild(dom);
        return td;
      })
      .forEach((td) => tr.appendChild(td));
    this.#dom.appendChild(tr);
    tr.id = crypto.randomUUID();
    return tr.id;
  }

  deleteRow(rowId) {
    const row = document.getElementById(rowId);
    this.#dom.removeChild(row);
  }
}
