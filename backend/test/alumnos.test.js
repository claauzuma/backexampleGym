import { expect } from 'chai';
import { generarAlumno } from './generador/alumnos.js';
import { validarAlumno } from '../servicio/validaciones/alumnos.js';

describe('***** Test del generador de alumno *****', () => {
  it('el alumno debe contener los campos requeridos y cumplir con las validaciones (CASO NO FELIZ)', () => {
    const alumno = generarAlumno();
    console.log(alumno);

    const { error } = validarAlumno(alumno);
    expect(error).to.be.undefined;
  });

  it('debería generar alumnos aleatorios (CASO FELIZ)', () => {
    const alumno1 = generarAlumno();
    const alumno2 = generarAlumno();
    console.log(alumno1);
    console.log(alumno2);

    expect(alumno1.nombre).to.not.equal(alumno2.nombre);
    expect(alumno1.apellido).to.not.equal(alumno2.apellido);
    // Agregar más expectativas para otros atributos si es necesario...
  });
});