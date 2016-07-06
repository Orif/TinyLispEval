export interface IEnvironment {
    find(name: string): any;
}

export class Environment<ENode> implements IEnvironment {
    protected map: Map<string, ENode>;
    private outer: IEnvironment;
    private environments: Map<string, IEnvironment>;

    constructor(outer: IEnvironment = undefined) {
        this.outer = outer;
    }

    find(name: string): ENode {
        if (this.map.has(name)) {
            return this.map.get(name);
        }

        const outerFindResult = this.outer.find(name);
        if (outerFindResult) {
            return outerFindResult;
        }

        throw new ReferenceError(`Unknown reference: ${name}`);
    }
}
