export class SportsCout {
    private uuid?: string;
    private name: string;
    private opening: Date;
    private closest: Date;
    private district_uuid: string;
  
    constructor(
      name: string,
      opening: Date,
      closest: Date,
      district_uuid: string,
      uuid?: string,
    ) {
      this.uuid = uuid;
      this.district_uuid = district_uuid;
      this.name = name;
      this.opening = opening;
      this.closest = closest;
      
    }
  
    // Getters
    public getUuid(): string | undefined {
      return this.uuid;
    }
  
    public getName(): string {
      return this.name;
    }

    public getOpening(): Date {
      return this.opening;
    }

    public getClosest(): Date {
      return this.closest;
    }

    public getDistrictUuid(): string {
        return this.district_uuid;
      }
  
    
    
  
    // Setters
    public setUuid(value: string | undefined): void {
        this.uuid = value;
    }

    public setName(value: string): void {
      this.name = value;
    }

    public setOpening(value: Date): void {
      this.opening = value;
    }

    public setClosest(value: Date): void {
      this.closest = value;
    }

    public setDistrictUuid(value: string): void {
        this.district_uuid = value;
      }
  
  
}
  