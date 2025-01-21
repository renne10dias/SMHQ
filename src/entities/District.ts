export class District {
    private uuid?: string;
    private name: string;
    private user_uuid: string;
  
    constructor(
      name: string,
      user_uuid: string,
      uuid?: string,
    ) {
      this.uuid = uuid;
      this.user_uuid = user_uuid;
      this.name = name;
      
    }
  
    // Getters
    public getUuid(): string | undefined {
      return this.uuid;
    }
  
    public getName(): string {
      return this.name;
    }

    public getUserUuid(): string {
        return this.user_uuid;
      }
  
    
    
  
    // Setters
    public setUuid(value: string | undefined): void {
        this.uuid = value;
    }

    public setName(value: string): void {
      this.name = value;
    }

    public setUserUuid(value: string): void {
        this.user_uuid = value;
      }
  
  
}
  