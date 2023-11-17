import { Form, SelectBox, TableBody } from "./domWrappers.js";
import {
  StartAtComponent,
  SpanComponent,
  PlaceComponent,
  TypesComponent,
  DeleteButtonComponent,
} from "./components.js";
import { RestRepository } from "./io.js";

const createForm = new Form("create-plan-form");
const styleSelectBox = new SelectBox("style-id");
const typeSelectBox = new SelectBox("type-ids");
const tableBody = new TableBody("table-body");

const styleRepository = new RestRepository(
  `${location.origin}/interview/styles`
);
const typeRepository = new RestRepository(`${location.origin}/interview/types`);
const plansRepository = new RestRepository(
  `${location.origin}/interview/plans`
);

createForm.onSubmit = async (target) => {
  const res = await plansRepository.create({
    start_at: target["start-at"].value,
    company_name: target["company-name"].value,
    style_id: target["style-id"].value,
    place: target["place"].value,
    type_ids: [target["type-ids"].value],
  });
  if (!res || !res["status"] || res["status"] !== 200) {
    alert("エラーやで");
    return;
  }
  await initialize();
  alert("保存したやで");
};

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
  const item2components = function ({
    id,
    start_at,
    company_name,
    style,
    place,
    types,
  }) {
    return {
      id: id,
      start_at: new StartAtComponent(start_at),
      company_name: new SpanComponent(company_name),
      style: new SpanComponent(style),
      place: new PlaceComponent(place),
      types: new TypesComponent(types),
      deleteButton: new DeleteButtonComponent(),
    };
  };
  items
    .map(item2components)
    .sort((a, b) => b.start_at.compare(a.start_at))
    .forEach(
      ({ id, start_at, company_name, style, place, types, deleteButton }) => {
        const deleteButtonDom = deleteButton.toDom();
        const rowId = tableBody.addRow([
          start_at.toDom(),
          company_name.toDom(),
          style.toDom(),
          place.toDom(),
          types.toDom(),
          deleteButtonDom,
        ]);
        deleteButtonDom.onclick = async () => onClickDeleteButton(rowId, id);
      }
    );
}

async function initialize() {
  [styleSelectBox, typeSelectBox, tableBody].forEach((e) => e.clear());
  Promise.all([loadStyleSelectBox(), loadTypeSelectBox(), loadPlanTable()]);
}

window.onload = function () {
  initialize();
};
