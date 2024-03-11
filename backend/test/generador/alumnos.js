import { faker } from '@faker-js/faker/locale/en'

function generarAlumno() {
  const alumno = {
    nombre: faker.person.firstName(),
    apellido: faker.person.lastName(),
    dni: faker.number.int({ min: 11111111, max: 99999999}).toString(),  
    email: faker.internet.email(),
    contraseña: faker.internet.password(),
    ingreso: faker.number.int({ min: 111111, max: 999999 }).toString(),  
    plan: faker.number.int({ min: 0, max: 5 }).toString()  
  };

  return alumno;
}
export { generarAlumno };