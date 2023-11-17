export class StartAtComponent {
  #value;
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
    this.#value = new Date(src);
  }

  compare(startAt) {
    return this.#value.getTime() < startAt.#value.getTime() ? -1 : 1;
  }

  toDom() {
    const dom = document.createElement("span");
    dom.innerText = this.#value.toLocaleString(
      "ja-JP",
      StartAtComponent.DATE_FORMAT_OPTION
    );
    return dom;
  }
}

export class SpanComponent {
  constructor(styleName) {
    this.value = styleName;
  }

  toDom() {
    const dom = document.createElement("span");
    dom.innerText = this.value;
    return dom;
  }
}
export class PlaceComponent {
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

export class TypesComponent {
  constructor(typeNames) {
    this.value = typeNames;
  }

  toDom() {
    const dom = document.createElement("span");
    dom.innerHTML = this.value.join("<br/>");
    return dom;
  }
}

export class DeleteButtonComponent {
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
