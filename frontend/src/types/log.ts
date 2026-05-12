class Log {
    private endroit: string;
    private date: Date;

    constructor(endroit: string, date: Date) {
        this.endroit = endroit;
        this.date = date;
    }

    public getEndroit(): string {
        return this.endroit;
    }

    public getTimestamp(): number {
        return this.date.getTime();
    }

    public getDateString(): string {
        return this.date.toLocaleString();
    }
}

export default Log;