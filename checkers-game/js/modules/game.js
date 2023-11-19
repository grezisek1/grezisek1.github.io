export default class Game {
    constructor(modules) {
        this.fields = modules.fields;
        this.pieces = modules.pieces;
        this.state = modules.state;
        this.ui = modules.ui;
        this.logic = modules.logic;
        this.controller = modules.controller;
        this.controller.initController(this)
        this.logic.initLogic(this);
    }
}
