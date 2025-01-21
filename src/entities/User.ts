export class User {
    private uuid?: string;
    private name: string;
    private email: string;
    private password: string;
    private createdAt?: Date;
  
    constructor(
      name: string,
      email: string,
      password: string,
      createdAt?: Date,
      uuid?: string,
    ) {
      this.uuid = uuid;
      this.name = name;
      this.email = email;
      this.password = password;
      this.createdAt = createdAt;
    }
  
    // Getters
    public getUuid(): string | undefined {
      return this.uuid;
    }
  
    public getName(): string {
      return this.name;
    }
  
    public getEmail(): string {
      return this.email;
    }
  
    public getPasswordHash(): string {
      return this.password;
    }
  
    public getCreatedAt(): Date | undefined {
      return this.createdAt;
    }
  
    // Setters
    public setUuid(value: string | undefined): void {
        this.uuid = value;
    }
    public setName(value: string): void {
      this.name = value;
    }
  
  
    public setEmail(value: string): void {
      this.email = value;
    }
  
    public setPasswordHash(value: string): void {
      this.password = value;
    }
  
    public setCreatedAt(value: Date | undefined): void {
      this.createdAt = value;
    }
  
  
  }
  