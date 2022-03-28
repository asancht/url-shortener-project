import { object, string } from "yup";

//Esquema de validación de la URL

export default object({
  body: object({
    URLoriginal: string()
      .url("Se requiere una URL valida")
      .required("La URL es requerida"),
  }),
});
