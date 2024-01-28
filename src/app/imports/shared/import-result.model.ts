export class Result {
    inserted: number;
    existed: number;
    updated: number;

    constructor() {
        this.inserted = 0;
        this.existed = 0;
        this.updated = 0;
    }
}

export class ImportResult {
    glider: Result;
    place: Result;
    flight: Result;
}
