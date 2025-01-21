import jwt from "jsonwebtoken";

export class AuthJwt {
    private secret: string;

    constructor(secret: string) {
        this.secret = secret;
    }

    // Método para gerar um token
    public generateToken(payload: object, expiresIn: string | number = "1h"): string {
        return jwt.sign(payload, this.secret, { expiresIn });
    }

    // Método para verificar um token
    public verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}
