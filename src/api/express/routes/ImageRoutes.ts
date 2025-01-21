import { ApiExpress } from "../ApiExpress";
import { ImageController } from "../controllers/ImageController";

export class ImageRoutes {
    public static registerRoutes(api: ApiExpress) {
        api.addGetRoute("/image/:id", ImageController, 'loadImage');
    }
}

