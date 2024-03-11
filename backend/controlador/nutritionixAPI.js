import NutritionixAPI from "../model/DAO/nutritionixAPI.js";

const API_ID = 'd17f3428'; // Reemplaza con tu ID de aplicación
const API_KEY = '14ca3a0e209a2f307f1aad6099296e2b'; // Reemplaza con tu clave de aplicación

/* EJEMPLO DE QUERY
{
 "ejercicio":"run 3 miles"(EN INGLES),
 "genero":"female",
 "peso":72.5,
 "altura":167.64,
 "edad":30
}
*/


class Controlador {
    constructor() {
      this.nutritionixAPI = new NutritionixAPI(API_ID, API_KEY);
    }

    obtenerEjercicio = async (req,res) => {
        const { ejercicio, genero, peso, altura, edad } = req.body;
      
        try {
          const ejercicioData = await this.nutritionixAPI.obtenerEjercicioNatural(ejercicio, genero, peso, altura, edad);
          res.json(ejercicioData);
        } catch (error) {
          res.status(500).json({ error: 'Error al procesar la solicitud' });
        }
      }
      
}
  


export default Controlador;