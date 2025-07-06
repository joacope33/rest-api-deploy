import { MoviesModels } from "../models/database/movies.js"
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
    static async getAll(req, res) {

        try {
            const { genre } = req.query
            const movies = await MoviesModels.getAll({ genre })
            res.json(movies)
        } catch (error) {
            res.status(500).json({ messege: error.message })
        }
    }
    static async getById(req, res) {
        const { id } = req.params //si en la ruta pusimos :id en const debemos poner lo mismo es importanticimo
        const movie = await MoviesModels.getById({ id })

        if (movie) return res.json(movie)

        res.status(404).json({ message: 'Movie Not Found' })
    }
    static async create(req, res) {
        const result = validateMovie(req.body)

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })

        }
        //no seria REST xq guardamos los datos en memoria
        const newMovie = await MoviesModels.create({ input: result.data })
        return res.json(newMovie) // el 201 es creado!! no un 200
    }
    static async delete(req, res) {
        const { id } = req.params
        const result = await MoviesModels.delete({ id })

        if (result === false) {
            return res.status(404).json({ message: 'Movie Not Found' })
        }
        return res.json({ messege: "Movie Deleted" })

    }
    static async update(req, res) {
        const result = validatePartialMovie(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })

        }

        const { id } = req.params
        const updatedMovie = await MoviesModels.update({ id, input: result.data })
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie Not Found' })
        }
        return res.json(updatedMovie)
    }
}