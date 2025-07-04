const express = require('express')//no me deja con E/S MODULE npm install express -D
const movies = require('./movies.json')
const crypto = require('node:crypto')//npm install crypto -E
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js')
const cors = require('cors') // npm install cors -E

const app = express() // para crear nuestro servidor con express
app.disable('x-powered-by')//desactivar informacion inecesaria para la seguridad de la aplicación
//Middleware de json sino los post no funcionan
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:1234'
        ]

        if (ACCEPTED_ORIGINS.includes, origin) {
            return callback(null, true)
        }
        if (!origin) {
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
    }
}))


//trae todas las movies

app.get('/movies', (req, res) => {


    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => { //path-to-regexp
    const { id } = req.params //si en la ruta pusimos :id en const debemos poner lo mismo es importanticimo
    const movie = movies.find(movie => movie.id === id)

    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie Not Found' })

})



app.post('/movies', (req, res) => {
    //validaciones: herramientas interezantes Zod -E junto con jup!!!! estan en carpeta schema
    const result = validateMovie(req.body)

    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })

    }
    //no seria REST xq guardamos los datos en memoria
    const newMovie = {
        id: crypto.randomUUID(), //node.js tiene una biblioteca nativa que te permite id unicas cripto UUID V4  
        ...result.data
    }
    movies.push(newMovie)
    return res.json(newMovie) // el 201 es creado!! no un 200
})

app.delete('/movies/:id', (req, res) => {

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie Not Found' })
    }

    movies.splice(movieIndex, 1)
    return res.json({ messege: 'Movie Delete' })
})


app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })

    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie Not Found' })
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie

    return res.json(updateMovie)

})



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
