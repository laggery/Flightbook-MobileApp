export class Glider {
    id: number;
    buyDate: string;
    brand: string;
    name: string;
    tandem: boolean;
    archived: boolean;
    note?: string;
    time: number;
    nbFlights: number;
    checks: GliderCheck[] = [];
}

export class GliderCheck {
    date: Date;
    result: string;
}
