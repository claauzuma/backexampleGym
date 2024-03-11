import fetch from 'node-fetch';

class NutritionixAPI {
  constructor(appId, appKey) {
    this.appId = appId;
    this.appKey = appKey;
    this.endpoint = 'https://trackapi.nutritionix.com/v2/natural/exercise';
  }

  async obtenerEjercicioNatural(ejercicio, genero, peso, altura, edad) {
    const headers = { 'x-app-id': this.appId, 'x-app-key': this.appKey,
        'Content-Type': 'application/json'};
    const requestData = {query: ejercicio, gender: genero, weight_kg: peso,
        height_cm: altura, age: edad};

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al hacer la solicitud POST:', error);
      throw error;
    }
  }
}

export default NutritionixAPI;
