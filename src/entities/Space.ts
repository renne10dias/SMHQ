export class Space {
    private uuid?: string;
    private name: string;
    private location: string;
    private capacity: number;
    private type: string;
    private equipment?: string;
    private activityStatus?: boolean;

    constructor(
        name: string,
        location: string,
        capacity: number,
        type: string,
        activityStatus?: boolean,
        uuid?: string,
        equipment?: string,
    ) {
        this.uuid = uuid;
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.type = type;
        this.equipment = equipment;
        this.activityStatus = activityStatus;
    }

    // Getters
    public getUuid(): string | undefined {
        return this.uuid;
    }

    public getName(): string {
        return this.name;
    }

    public getLocation(): string {
        return this.location;
    }

    public getCapacity(): number {
        return this.capacity;
    }

    public getType(): string {
        return this.type;
    }

    public getEquipment(): string | undefined {
        return this.equipment;
    }

    public isActivityStatus(): boolean | undefined {
        return this.activityStatus;
    }

    // Setters
    public setUuid(value: string | undefined): void {
        this.uuid = value;
    }
    public setName(value: string): void {
        this.name = value;
    }

    public setLocation(value: string): void {
        this.location = value;
    }

    public setCapacity(value: number): void {
        this.capacity = value;
    }

    public setType(value: string): void {
        this.type = value;
    }

    public setEquipment(value: string | undefined): void {
        this.equipment = value;
    }

    public setActivityStatus(value: boolean | undefined): void {
        this.activityStatus = value;
    }
}
