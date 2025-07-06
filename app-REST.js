import express, { json } from 'express'//no me deja con E/S MODULE npm install express -D
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'

const app = express() // para crear nuestro servidor con express
app.disable('x-powered-by')//desactivar informacion inecesaria para la seguridad de la aplicación
//Middleware de json sino los post no funcionan
app.use(json())//
app.use(corsMiddleware())


//trae todas las movies

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`server listering on url:port http://localhost:${PORT}`)
})



//REST API es un arquitectura de software
//1----- Principios:
//-----//-----Escalabilidad
//-----//-----Simplicidad
//-----//-----Portabilidad
//-----//-----Visibilidad
//-----//-----Fiabilidad
//-----//-----Facil de modificar

//2Fundamentos:
//----- Resources:
//-----//-----Cada recurso se identifica con una URL: puede ser, coleccion[], o individual pero son entidades
//-----//-----Los metodos o Verbos HTTP: GET POST DELETE PATH, son los verbos que se definen las operaciones que se pueden realizar con los recursos

//3Representaciones:
//----- Formatos:
//-----//-----JSON, XML, HTML, ETC. osea el cliente podria decidir la represnetacion del recurso.

//4Stateless:
//----- Informacion suficiente:
//-----//----- Cada solicitud que se haga debe contener toda la informacion necesaria para entender esa solicitud.
//-----//----- Nuestro backend no debe retener informadion de la req para poder responder luego.


//5Interfaz Uniforme:
//----- Estructura similar no romper:

//6Separacion de compectos:
//----- Los componentes del cliente y servidor estan separados:
//Permite que cliente y servidor evolucionen de forma separada
