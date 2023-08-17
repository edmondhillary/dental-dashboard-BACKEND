import moment from "moment";
import faker from "faker"; // ahora mismo voy a desinstarlar faker ya que no me gusta esta dependencia. 20/6
import patientModel from "../api/models/patientSchema.js";

// Generador de datos aleatorios utilizando Faker
function generarDatosAleatorios() {
  const fechaNacimiento = moment(faker.date.past()).format("YYYY-MM-DD"); // Formatear la fecha de nacimiento utilizando moment
  const telefono = `+34${faker.phone.phoneNumber()}`;
  const email = `JR${faker.internet.email()}`;
  const datosAleatorios = [];

  for (let i = 0; i < 7000; i++) {
    const paciente = {
      firstName: faker.name.firstName(),
      secondName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: email,
      phone: telefono,
      dateOfBirth: fechaNacimiento,
      gender: faker.random.arrayElement(["Masculino", "Femenino"]),
      address: faker.address.streetAddress(),
      dni: faker.random.alphaNumeric(8),
      profesion: faker.name.jobTitle(),
      historialClinicoEnfermedades: [faker.lorem.word()],
      historialDental: [faker.lorem.word()],
      alergias: [faker.lorem.word()],
      otrosCamposMedicos: faker.lorem.sentence(),
      appointments: [],
      budget: [],
      treatment: [],
      tooth: [],
      firstVisit: faker.datatype.boolean(),
    };
    datosAleatorios.push(paciente);
  }
  return datosAleatorios;
}

// Insertar pacientes en la base de datos
// insertarPacientes.js

export async function insertarPacientes() {
  console.log("Iniciando inserción de pacientes...");

  try {
    const datosAleatorios = generarDatosAleatorios();
    await patientModel.insertMany(datosAleatorios);
    console.log("Se insertaron los pacientes correctamente.");
  } catch (error) {
    console.error("Ocurrió un error al insertar los pacientes:", error);
  }

  console.log("Inserción de pacientes completada.");
}

// Llamar a la función para insertar los pacientes
