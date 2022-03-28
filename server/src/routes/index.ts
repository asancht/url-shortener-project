import { Express, Request, Response } from "express";
import {
  crearURLcorta,
  handleRedirect,
  getURLCorta,
  updateStatusURL,
  updateNuevaURL,
} from "../controller/Urlcorta.controller";
import validateResourse from "../middleware/validateResourse";
import shortUrlSchema from "../schemas/crearURLcorta.schema";


function routes(app: Express) {
  
/**
 * @swagger
 * /api/url/healthcheck:
 *   get:
 *     summary: Validación que la API esta operativa.
 *     description: Realiza una validación del healthcheck a la API
 *     responses:
 *       200:
 *         description: API Operativa.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       500:
 *         description: API no esta operativa.     
 */
  app.get("/api/url/healthcheck", (req: Request, res: Response) => {
    return res.send("API operativa !");
  });


  /**
     * @swagger
     * /api/url:
     *   post:
     *     summary: Crea una URL corta.
     *     description: "Se debe ingresar la URL Original en el URLoriginal y devuleve el parametro URLcortaId"
     *     operationId: crearURLcorta
     *     produces:
     *         - application/json
     *     parameters:
     *       - name: body
     *         in: body
     *         description: URL ORiginal.
     *         required: true
     *         schema:
     *              type: object
     *              properties:
     *                URLoriginal:  
     *                    type: string
     *     responses:
     *       302:
     *         description: Redireccional sitio original
     *       403:
     *         description: URL no encontrada o no habilitada
     *       400:
     *         description: parametros no enviados
     *       500:
     *         description: Error al tratar de recuperar la URL
     *      
     */
  app.post("/api/url", validateResourse(shortUrlSchema), crearURLcorta);
  
  /**
     * @swagger
     * /{URLcortaId}:
     *   get:
     *     summary: Redirecciona a la URL original con la URL corta.
     *     description: "Se ingresa la URL corta generada y se llama a la URL original,
     *                  <b>DISCLAIMER ==> Esta UI no hace el rediccionamiento solo entrega la nueva URL."
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: URLcortaId
     *         in: path
     *         description: URL corta.
     *         required: true
     *         type: string
     *     responses:
     *       302:
     *         description: Redireccional sitio original
     *       403:
     *         description: URL no encontrada o no habilitada
     *       500:
     *         description: Error al tratar de recuperar la URL
     *      
     */
     
  app.get("/:URLcortaId", handleRedirect);
  
    /**
     * @swagger
     * /api/url/{URLcortaId}:
     *   get:
     *     summary: Recupera los datos de las URLs.
     *     description: "Con el ID de la URL corta recupera la URL original"
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: URLcortaId
     *         in: path
     *         description: URL corta.
     *         required: true
     *         type: string
     *     responses:
     *       302:
     *         description: Redireccional sitio original
     *         
     *       403:
     *         description: URL no encontrada o no habilitada
     *       500:
     *         description: Error al tratar de recuperar la URL
     *      
     */
  app.get("/api/url/:URLcortaId", getURLCorta);

 /**
     * @swagger
     * /api/url/update/status:
     *   post:
     *     summary: Actualiza el status de la URL.
     *     description: "Se debe ingresar ingresar ID de la URL y el nuevo estado y devuleve los datos actualizados"
     *     operationId: updateStatusURL
     *     produces:
     *         - application/json
     *     parameters:
     *       - name: body
     *         in: body
     *         description: ID URL y el estado.
     *         required: true
     *         schema:
     *              type: object
     *              properties:
     *                URLcortaId:  
     *                    type: string
     *                habilitada:
     *                    type: boolean
     *     responses:
     *       200:
     *         description: Datos actualizados correctamente
     *       204:
     *         description: No se actulizo ningun dato por que el ID de URL no existe
     *       400:
     *         description: parametros no enviados
     *       500:
     *         description: Error al tratar de recuperar la URL
     *      
     */
  app.post("/api/url/update/status", updateStatusURL);

   /**
     * @swagger
     * /api/url/update/url:
     *   post:
     *     summary: Actualiza la URL Original.
     *     description: "Se debe ingresar ingresar ID de la URL y la nueva URLs , devuelve los datos actualizados"
     *     operationId: updateNuevaURL
     *     produces:
     *         - application/json
     *     parameters:
     *       - name: body
     *         in: body
     *         description: ID URL y la nueva URL.
     *         required: true
     *         schema:
     *              type: object
     *              properties:
     *                URLcortaId:  
     *                    type: string
     *                URLoriginal:
     *                    type: string
     *     responses:
     *       200:
     *         description: Datos actualizados correctamente
     *       204:
     *         description: No se actulizo ningun dato por que el ID de URL no existe
     *       400:
     *         description: parametros no enviados
     *       500:
     *         description: Error al tratar de recuperar la URL
     *      
     */
  app.post("/api/url/update/url", validateResourse(shortUrlSchema),updateNuevaURL);

}

export default routes;
