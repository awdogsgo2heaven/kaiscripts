import Item from '../items/item';
import AlphaCannon from '../items/alpha-cannon';

export default class Virus {
    static get totalHealth(): number {
        return 100.0;
    }

    static get antidote(): typeof Item {
        return AlphaCannon;
    }

    static toSymbol() {
        return 'Virus';
    }

    static get factionPoints(): number {
        return 3;
    }
}