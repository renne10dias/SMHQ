import { ApiExpress } from "../ApiExpress";
import { ReservationController } from "../controllers/ReservationController";
import { AuthMiddleware } from "../../../middlewares/AuthMiddleware";
import { UserRoleEnum } from '../../../enums/UserRoleEnum';

export class ReservationRoutes {
    public static registerRoutes(api: ApiExpress) {

       
        api.addPostRoute("/reservation", ReservationController, 'createReservationWithResponsible');
        api.addGetRoute("/reservation/listReservationsBySportsCoutUuid/:sportsCoutUuid", ReservationController, 'listReservationsBySportsCoutUuid');
        api.addGetRoute("/reservation/getReservationsWithResponsibleAndSportsCout/:reservationUuid", ReservationController, 'getReservationsWithResponsibleAndSportsCout');

        api.addPutRoute("/reservation/updateEnabledStatus/:reservationUuid/:sportsCoutUuid/:responsibleCoutUuid", ReservationController, 'updateEnabledStatus');

        api.addGetRoute("/reservation/getAllResponsibles", ReservationController, 'getAllResponsibles');

        api.addGetRoute("/reservation/searchResponsiblesByName/:name", ReservationController, 'searchResponsiblesByName');

        api.addPostRoute("/reservation/createReservationAddResponsible", ReservationController, 'createReservationAddResponsible');
        


    }
}

