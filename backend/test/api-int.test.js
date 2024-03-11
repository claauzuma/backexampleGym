import { expect } from "chai";
import supertest from "supertest";
import { generarAlumno } from "./generador/alumnos.js";
import { generarRutina } from "./generador/rutinas.js";
import Server from "../server.js";


describe("Test API para agregar usuarios y rutinas", () => {
  describe("POST para agregar usuario", () => {
    it("debería incorporar un usuario", async () => {
      const server = new Server(8081, "MONGODB");
      const app = await server.start();  
      const request = supertest(app);
      console.log(request); // Debug step

      const usuario = generarAlumno();

      const response = await request
        .post("/api/usuarios/alumnos")
        .send(usuario);
      expect(response.status).to.eql(200);

      const usuarioAgregado = response.body;
      expect(usuarioAgregado).to.include.keys(
        "nombre",
        "apellido",
        "dni",
        "email",
        "contraseña",
        "ingreso",
        "plan"
      );
      await server.stop();
    });
  });

  describe("POST para agregar rutina", () => {
    it("debería incorporar una rutina // NO LA INCORPORA SI EL DNI DE ALUMNO NO EXISTE", async () => {
      const server = new Server(8082, "MONGODB");
      const app = await server.start();
      const request = supertest(app);

      const rutina = generarRutina();

      const response = await request.post("/api/rutinas/agregar").send(rutina);
      expect(response.status).to.eql(200);

      const rutinaAgregada = response.body;
      expect(rutinaAgregada).to.include.keys(
        "descripcion",
        "nombreAlumno",
        "dniAlumno",
        "nivel"
      );

      await server.stop();
    });
  });

  describe("POST para agregar usuario", () => {
    it('debería manejar un caso "no feliz". NO RECIBE EL EMAIL a proposito', async () => {
      const server = new Server(8083, "MONGODB");
      const app = await server.start();
      const request = supertest(app);

      const usuario = {
        // omitimos el campo 'email'
        nombre: "NombreEjemplo",
        apellido: "ApellidoEjemplo",
        dni: "12345678",
        contraseña: "contraseña123",
        ingreso: "ingreso123",
        plan: "plan123",
      };

      const response = await request
        .post("/api/usuarios/alumnos")
        .send(usuario);
        try {
          await request
            .post("/api/usuarios/alumnos")
            .send(usuario);
          throw new Error('La prueba debería haber fallado debido a la falta de campo "email".');
        } catch (error) {
          expect(error.message).to.equal('ValidationError: "email" is required');
    
          expect(error.name).to.equal('ValidationError');
      await server.stop();
    }
  });
});
});
