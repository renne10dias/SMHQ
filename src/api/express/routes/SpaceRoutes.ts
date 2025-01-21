import { ApiExpress } from "../ApiExpress";
import { SpaceController } from "../controllers/SpaceController";
import { MulterConfig } from "../../../util/multer/MulterConfig"; // Importa a classe do multer
import { AuthMiddleware } from "../../../middlewares/AuthMiddleware";
import { UserRoleEnum } from '../../../enums/UserRoleEnum';

export class SpaceRoutes {
    public static registerRoutes(api: ApiExpress) {
        const upload = MulterConfig.getMulterInstance(); // Instância do multer

        api.addPostRoute("/spaces", SpaceController, 'create', upload.single('file'));

        //api.addGetRoute("/spaces", SpaceController, 'listSpaces');
        api.addGetRoute("/spaces", SpaceController, 'listSpaces', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN, UserRoleEnum.ENPLOYEE, UserRoleEnum.USER]));

        api.addGetRoute("/spaces/find/detalhes/:id", SpaceController, 'findSpace', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN, UserRoleEnum.ENPLOYEE]));
        api.addGetRoute("/spaces/:id", SpaceController, 'find', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
        api.addPutRoute("/spaces/:id", SpaceController, 'update', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
        api.addDeleteRoute("/spaces/:id", SpaceController, 'delete', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));


    }
}

