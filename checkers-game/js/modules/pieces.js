import {
    boardNode,
    pieceNodeName,
    dataCount,
    piecesCount,
    xVar, yVar,
    piecesTypes,
    piecesColors,
} from "./constants.js";
import { diToXy } from "./logic.js";

const attributeChangeHandlers = {
    "data-x": function(x) {
        this.x = x;
        this.style.setProperty(xVar, x);
    },
    "data-y": function(y) {
        this.y = y;
        this.style.setProperty(yVar, y);
    }
};

class GamePiece extends HTMLElement {
    static manager = null;
    static observedAttributes = ["data-x", "data-y"];
    constructor() {
        super();
        this.dataset.type = piecesTypes[0];
        if (boardNode.contains(this)) {
            if (GamePiece.manager.pieces[0].includes(this)) {
                this.dataset.color = piecesColors[0];
            } else {
                this.dataset.color = piecesColors[1];
            }
        }
    }

    attributeChangedCallback(name, _, newValue) {
        attributeChangeHandlers[name].call(this, parseInt(newValue));
    }
}

const xytemp = new Uint8Array(2);
export default class Pieces {
    data = new Array(dataCount).fill(null);
    constructor() {
        this.pieces = [
            new Array(piecesCount),
            new Array(piecesCount),
        ];
        
        let di;
        for (let i = 0; i < piecesCount; i++) {
            di = i;
            this.pieces[1][i] = document.createElement(pieceNodeName);
            this.data[di] = this.pieces[1][i];
            this.move(di, di);
            
            di = i + dataCount - piecesCount;
            this.pieces[0][i] = document.createElement(pieceNodeName);
            this.data[di] = this.pieces[0][i];
            this.move(di, di);
        }

        boardNode.append.apply(boardNode, this.pieces[1]);
        boardNode.append.apply(boardNode, this.pieces[0]);

        GamePiece.manager = this;
        customElements.define(pieceNodeName, GamePiece);
    }

    move(from, to) {
        xytemp.set(diToXy(to));
        this.data[from].dataset.x = xytemp[0];
        this.data[from].dataset.y = xytemp[1];
        if (from !== to) {
            this.data[to] = this.data[from];
            this.data[from] = null;
        }
    }

    take(from) {
        this.data[from].dataset.type = piecesTypes[2];
        this.data[from] = null;
    }

    promote(di) {
        this.data[di].dataset.type = piecesTypes[1];
    }

    resetAll() {
        let di;
        this.data.fill(null);
        for (let i = 0; i < piecesCount; i++) {
            di = i;
            this.pieces[1][i].dataset.type = piecesTypes[0];
            this.data[di] = this.pieces[1][i];
            this.move(di, di);

            di = i + dataCount - piecesCount;
            this.pieces[0][i].dataset.type = piecesTypes[0];
            this.data[di] = this.pieces[0][i];
            this.move(di, di);
        }
    }
}