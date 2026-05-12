class Dispositif {
    private id: number;
    private nom: string;
    private isOn: boolean;

    constructor(id: number,nom: string) {
        this.nom = nom;
        this.id = id;
        this.isOn = false;
    }


    getId(): number {return this.id;}
    
    getNom(): string {return this.nom;}

    setOn(isOn: boolean): void {this.isOn = isOn;}

    getOn(): boolean {return this.isOn;}

}

export default Dispositif;