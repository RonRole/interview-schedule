class CreateForm {
  #dom;
  /**
   *
   * @param {startAt, companyName, styleId, place, typeIds} フォームに入力された値
   * @returns
   */
  onSubmit = async ({ startAt, companyName, styleId, place, typeIds }) =>
    console.log("no listener has set");

  constructor(formId) {
    this.#dom = document.getElementById(formId);
    this.#dom.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.onSubmit({
        startAt: e.target["start-at"].value,
        companyName: e.target["company-name"].value,
        styleId: e.target["style-id"].value,
        place: e.target["place"].value,
        typeIds: [e.target["type-ids"].value],
      });
    });
  }
}

const createForm = new CreateForm("create-plan-form");

/**
 * 内部domを操作するメソッドはスレッドアンセーフだけど、
 * 流石にそんな使い方はしないと思いたい...
 */
class SelectBox {
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

const styleSelectBox = new SelectBox("style-id");
const typeSelectBox = new SelectBox("type-ids");

class TableBody {
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

const tableBody = new TableBody("table-body");

class RestRepository {
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

const styleRepository = new RestRepository(
  `${location.origin}/interview/styles`
);

const typeRepository = new RestRepository(`${location.origin}/interview/types`);

const plansRepository = new RestRepository(
  `${location.origin}/interview/plans`
);

class StartAtComponent {
  static DATE_FORMAT_OPTION = {
    year: "numeric",
    month: "long", // 'long' を使用すると日本式の月名になります
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24時間表示
    timeZone: "UTC",
  };
  constructor(src) {
    this.value = new Date(src);
  }

  compare(startAt) {
    return this.value.getTime() < startAt.value.getTime() ? -1 : 1;
  }

  toDom() {
    const dom = document.createElement("span");
    dom.innerText = this.value.toLocaleString(
      "ja-JP",
      StartAtComponent.DATE_FORMAT_OPTION
    );
    return dom;
  }
}

class SpanComponent {
  constructor(styleName) {
    this.value = styleName;
  }

  toDom() {
    const dom = document.createElement("span");
    dom.innerText = this.value;
    return dom;
  }
}
class PlaceComponent {
  static REGEXP_URL = /^https?:\/\/.+$/;

  constructor(placeText) {
    this.value = placeText;
    this.base = new SpanComponent(placeText);
  }

  toDom() {
    if (this.value.match(PlaceComponent.REGEXP_URL)) {
      const anchor = document.createElement("a");
      anchor.href = this.value;
      anchor.innerText = "URL";
      return anchor;
    }
    return this.base.toDom();
  }
}

class TypesComponent {
  constructor(typeNames) {
    this.value = typeNames;
  }

  toDom() {
    const dom = document.createElement("span");
    dom.innerHTML = this.value.join("<br/>");
    return dom;
  }
}

function createPlanComponent({ start_at, company_name, style, place, types }) {
  return {
    start_at: new StartAtComponent(start_at),
    company_name: new SpanComponent(company_name),
    style: new SpanComponent(style),
    place: new PlaceComponent(place),
    types: new TypesComponent(types),
  };
}

class DeleteButtonComponent {
  toDom() {
    return this.#createDom();
  }

  #createDom() {
    const dom = document.createElement("button");
    dom.type = "button";
    dom.textContent = "削除";
    return dom;
  }
}

async function onClickDeleteButton(rowId, planId) {
  const res = await plansRepository.delete(planId);
  if (!res || res["status"] !== 200) {
    alert("エラーやで");
  } else {
    alert("削除したやで");
    tableBody.deleteRow(rowId);
  }
}

async function loadStyleSelectBox() {
  const items = await styleRepository.list();
  items.forEach(({ id, name }) =>
    styleSelectBox.addOption({ value: id, text: name })
  );
}
async function loadTypeSelectBox() {
  const items = await typeRepository.list();
  items.forEach(({ id, name }) => {
    typeSelectBox.addOption({ value: id, text: name });
  });
}
async function loadPlanTable() {
  const items = await plansRepository.list();
  items
    .map((plan) => {
      return {
        id: plan.id,
        ...createPlanComponent(plan),
        deleteButton: new DeleteButtonComponent(),
      };
    })
    .sort((a, b) => b.start_at.compare(a.start_at))
    .forEach(({ id, deleteButton, ...components }) => {
      const deleteButtonDom = deleteButton.toDom();
      const rowDoms = Object.values(components).map((component) =>
        component.toDom()
      );
      const rowId = tableBody.addRow([...rowDoms, deleteButtonDom]);
      deleteButtonDom.onclick = async () => onClickDeleteButton(rowId, id);
    });
}

async function initialize() {
  [styleSelectBox, typeSelectBox, tableBody].forEach((e) => e.clear());
  Promise.all([loadStyleSelectBox(), loadTypeSelectBox(), loadPlanTable()]);
}

window.onload = function () {
  initialize();
};

createForm.onSubmit = async ({
  startAt,
  companyName,
  styleId,
  place,
  typeIds,
}) => {
  const res = await plansRepository.create({
    start_at: startAt,
    style_id: styleId,
    company_name: companyName,
    place: place,
    type_ids: typeIds,
  });
  if (!res || !res["status"] || res["status"] !== 200) {
    alert("エラーやで");
    return;
  }
  await initialize();
  alert("保存したやで");
};
