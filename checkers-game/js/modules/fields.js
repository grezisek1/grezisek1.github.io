import { fieldClasses, fieldsCount, fieldNodeName, boardNode } from "./constants.js";
const fieldNodeTemplate = document.createElement(fieldNodeName);
fieldNodeTemplate.classList.add(fieldClasses.field);

export default class Fields {
    constructor() {
        this.list = new Array(fieldsCount);
        for (let i = 0; i < fieldsCount; i++) {
            this.list[i] = fieldNodeTemplate.cloneNode();
            this.list[i].innerHTML = i;
            boardNode.appendChild(this.list[i]);
        }
    }

    highlightFields(fields) {
        for (let i = 0; i < fieldsCount; i++) {
            this.list[i].classList.toggle(
                fieldClasses.highlighted,
                fields.includes(i)
            );
        }
    }
    selectFields(fields) {
        for (let i = 0; i < fieldsCount; i++) {
            this.list[i].classList.toggle(
                fieldClasses.selected,
                fields.includes(i)
            );
        }
    }
}
