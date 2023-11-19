import { dataCount } from "./constants.js";

export default class State {
    constructor() {
        this.score = new Uint8Array(2);
        this.currentPlayerIndex = 0;
        this.selected = null;
        this.availableMoves = new Array(dataCount).fill(null).map(_=>[]);
        this.kingCandidates = [];
        this.takes = new Array(dataCount).fill(null).map(_=>[]);
    }
}