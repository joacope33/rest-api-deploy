const z = require('zod')
const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is requered.'
    }),
    year: z.number().int().min(1900).max(2025),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).optional(),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci—F1']),
        {
            invalid_type_error: `Movie genre must be an ARRAY: Action, Adventure, Comedy, Drama, Fantasy, Horror, Thriller, Sci—F1`,
            required_error: 'Movie genre is requered.'
        }

    )
})
//funcion para validar completa y crear un input
function validateMovie(object) {
    return movieSchema.safeParse(object)
}
//funcion para modificar parcialmente un valor solamente

function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object)//el metodo partial() hace que cada validacion sea opcional sino esta no la valida, si esta la valida

}

module.exports = {
    validateMovie, validatePartialMovie
}