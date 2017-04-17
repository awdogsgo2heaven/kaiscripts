import Virus from './virus';
import Item from '../items/item';
import AlphaCannon from '../items/alpha-cannon';

export default class BetaVirus extends Virus {

    static get totalHealth(): number {
        return 200.0;
    }

    static get antidote(): typeof Item {
        return AlphaCannon;
    }

    static toSymbol() {
        return 'Beta';
    }
}