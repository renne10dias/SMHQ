import { ApiExpress } from "../ApiExpress";
import { AuthController } from "../controllers/AuthController";

export class AuthRoutes {
    public static registerRoutes(api: ApiExpress) {
        api.addPostRoute("/auth/login", AuthController, 'login');
    }
}

