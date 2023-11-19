export const fieldClasses = {
    field: "field",
    selected: "field--selected",
    highlighted: "field--highlighted",
};

export const fieldsCount = 100;
export const dataCount = 50;
export const piecesCount = 20;
export const autoplaySpeed = 80;
export const fieldNodeName = "button";
export const pieceNodeName = "game-piece";
export const boardNode = board;
export const kingMoveDirections = [
    -1, -1, "fl",    1, -1, "fr",
    -1,  1, "bl",    1,  1, "br",
];
export const kingCandidateRows = [1, 8];
export const piecesColors = ["white", "black"];
export const piecesTypes = ["piece", "king", "taken"];
export const xVar = "--x";
export const yVar = "--y";
