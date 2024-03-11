import { faker } from '@faker-js/faker/locale/en'

const generarRutina = () => {
   const niveles = ['Principiante', 'Intermedio', 'Avanzado'];
  const rutina = {
    descripcion: faker.lorem.words(5),
    nombreAlumno: faker.person.firstName(),
    dniAlumno: faker.number.int({ min: 11111111, max: 99999999}).toString(),  
    nivel: niveles[Math.floor(Math.random() * niveles.length)]
  };
  return rutina;
};

export { generarRutina };