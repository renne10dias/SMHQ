export class Reservation {
    private uuid?: string;
    private startDate: Date;
    private endDate: Date;
    private status: string;
    private details: string;
    private createdAt?: Date;
    private spaceId: string;
    private userId: string;
    private shiftIds: string[]; // Adicionando um array para armazenar IDs de turnos

    constructor(
        startDate: Date,
        endDate: Date,
        status: string,
        details: string,
        spaceId: string,
        userId: string,
        shiftIds: string[], // Parâmetro para os IDs dos turnos
        uuid?: string,
        createdAt?: Date,
    ) {
        this.uuid = uuid;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.details = details;
        this.createdAt = createdAt;
        this.spaceId = spaceId;
        this.userId = userId;
        this.shiftIds = shiftIds; // Inicializando o array de shiftIds
    }

    // Getters
    public getUuid(): string | undefined {
        return this.uuid;
    }

    public getStartDate(): Date {
        return this.startDate;
    }

    public getEndDate(): Date {
        return this.endDate;
    }

    public getStatus(): string {
        return this.status;
    }

    public getDetails(): string {
        return this.details;
    }

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    public getSpaceId(): string {
        return this.spaceId;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getShiftIds(): string[] { // Adicionando um getter para shiftIds
        return this.shiftIds;
    }



    // Setters
    // Setters
    public setUuid(value: string | undefined): void {
        this.uuid = value;
    }

    public setStartDate(value: Date): void {
        this.startDate = value;
    }

    public setEndDate(value: Date): void {
        this.endDate = value;
    }

    public setStatus(value: string): void {
        this.status = value;
    }

    public setDetails(value: string): void {
        this.details = value;
    }

    public setCreatedAt(value: Date | undefined): void {
        this.createdAt = value;
      }

    public setSpaceId(value: string): void {
        this.spaceId = value;
    }

    public setUserId(value: string): void {
        this.userId = value;
    }

}
