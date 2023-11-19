import Game from "./modules/game.js";
import Fields from "./modules/fields.js";
import Pieces from "./modules/pieces.js";
import State from "./modules/state.js";
import UI from "./modules/ui.js";
import Controller from "./modules/controller.js";
import Logic from "./modules/logic.js";
import SimplifiedTakeTree from "./modules/takeTree.js";

const game = new Game({
    fields: new Fields(),
    pieces: new Pieces(),
    state: new State(),
    ui: new UI(),
    logic: new Logic(SimplifiedTakeTree),
    controller: new Controller(),
});