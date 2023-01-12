import Game from './modules/game';
import View from './modules/view';

import '../styles/main.css';

const game = new Game();
const view = new View();

view.renderBoard(game.p1);
view.renderBoard(game.p2);

view.bindOpponentCells(game.playPlayerTurn.bind(game));
// view.bindPlayerCells();
