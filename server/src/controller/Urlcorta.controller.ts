import { Request, Response } from "express";
import URLCorta from "../models/Urlcorta.model";
import { pool as visitas } from "../db/postgres";
import { promisify } from "util";
import { redis } from "../db/redis";
import dotenv from "dotenv";
dotenv.config();

//Definicion de funciones redis
const GET_ASYNC = promisify(redis.get).bind(redis);
const SET_ASYNC = promisify(redis.set).bind(redis);
const DEL_ASYNC = promisify(redis.del).bind(redis);


/* Crear una nueva URL corta */
export async function crearURLcorta(req: Request, res: Response) {
  
  // Recupera Url original del JSON
  const { URLoriginal } = req.body;
  
  // Crear una URL corta
  const nuevaURL = new URLCorta({ URLoriginal });
  await nuevaURL.save();
  
  // Retorna URL corta
  return res.send(nuevaURL);
}


/*Rediecrt con la URL Corta*/
export async function handleRedirect(req: Request, res: Response) {
  //Se recibe la ID de URL Corta
  const { URLcortaId } = req.params;
  let strURLcortaId = { URLcortaId }.URLcortaId;
  console.log("url corta");
  console.log( { URLcortaId } );
  console.log(strURLcortaId);
  //Se recupera de Redis la URL
  let strURLOriginal = await GET_ASYNC(strURLcortaId);
  
  console.log("Original Cache");
  console.log(strURLOriginal);

  //Valida si recupero datos
  if(!strURLOriginal)
  {
      //Se recupera el OBJETO con los datos de la URL desde la BD Mongo
      const query = {  URLcortaId , "habilitada":true }; 
      const URL = await URLCorta.findOne(query).lean();
     
      //Se valida si se recupera URL
      if (!URL) {
        return res.sendStatus(403);
      }
      else
      {
        //guarda en cache Redis
        const saveResult = await SET_ASYNC(URL.URLcortaId ,URL.URLoriginal);
        strURLOriginal= URL.URLoriginal;        
      }
   }
  
   
  try {
  
    console.log("url antes SQL");
  console.log( strURLOriginal);
  console.log(strURLcortaId); 
  //Se resgitra visita
  const insertaVisita = await visitas.query({text: process.env.PG_QUERY , values: [strURLcortaId, strURLOriginal ,new Date()]});

} catch (err) {
    //se registra error en registro de visita
    console.log(err);
}finally
{ 
  //Se realiza el redirect a la URL Original 
  return res.redirect(strURLOriginal);
}

}

 /*Recupera la URL y estado da URL corta*/
export async function getURLCorta(req: Request, res: Response) {
  
  //recine el Url corta
  const { URLcortaId } = req.params;

  //Recupera datos de la URL
  const URLcorta = await URLCorta.findOne({ URLcortaId }).lean();
  
  //Valida que exista , si error HTTP sin contendido
  if (!URLcorta) {
    return res.sendStatus(204);
  }
  
  //retrona los datos de la URL corta
  return res.json(URLcorta);
}


/* Update de la URL si esta habilitada o no*/
export async function updateStatusURL(req: Request, res: Response) {
  // Recupera URlCortaID y el valor boolean del campo habilitada
  const obj = req.body;

  // Actualiza el estado de la URL
  const URL = await URLCorta.findOneAndUpdate( {"URLcortaId": obj.URLcortaId}, {"habilitada" : obj.habilitada} ,{ returnOriginal: false });
  
  //Borra cache de ID actualizado
  const saveResult = await DEL_ASYNC(obj.URLcortaId);

  //Se valida si realizo el update , en caso contrario envia HTTP 204 ( sin contenido )
  if (!URL) {
    return res.sendStatus(204);
  }

  // Retorna URL modificada
  return res.send(URL);
}

/* Update de la URL : se actualiza la URL original*/
export async function updateNuevaURL(req: Request, res: Response) {
  // Recupera URlCortaID y la nueva URL
  const obj = req.body;
  
  // actualiza la URL original
  const URL = await URLCorta.findOneAndUpdate( {"URLcortaId": obj.URLcortaId}, {"URLoriginal" : obj.URLoriginal} ,{ returnOriginal: false });
  
  //Borra cache de ID actualizado
  const saveResult = await DEL_ASYNC(obj.URLcortaId);

  //Se valida si realizo el update , en caso contrario envia HTTP 204 ( sin copntenido )
  if (!URL) {
    return res.sendStatus(204);
  }

  // Retorna URL modificada
  return res.send(URL);
}