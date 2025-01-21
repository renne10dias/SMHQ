import { ApiExpress } from "../ApiExpress";
import { AuthMiddleware } from "../../../middlewares/AuthMiddleware";
import { UserRoleEnum } from '../../../enums/UserRoleEnum';
import { SportCoutController } from "../controllers/SportCoutController";

export class SportCoutRoutes {
    public static registerRoutes(api: ApiExpress) {
 
    
        api.addGetRoute("/sport-cout/getAllSportCout", SportCoutController, 'getAllSportCout');
       
    }
}

