import { ApiExpress } from "../ApiExpress";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../../../middlewares/AuthMiddleware";
import { UserRoleEnum } from '../../../enums/UserRoleEnum';

export class UserRoutes {
    public static registerRoutes(api: ApiExpress) {
        api.addPostRoute("/user/register", UserController, 'registerUser');
        api.addPostRoute("/user", UserController, 'create', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
        api.addGetRoute("/user", UserController, 'list', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
    }
}

