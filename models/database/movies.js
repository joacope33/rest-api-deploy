import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
const uri = "mongodb+srv://joaco:1234@cluster0.cqrastu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

async function connect() {
    try {
        await client.connect()
        const database = client.db('database')
        return database.collection('movies')
    } catch (error) {
        console.error('Error connecting to the database')
        console.error(error)
        await client.close()
    }
}

export class MoviesModels {
    static async getAll({ genre }) {
        const db = await connect()

        if (genre) {
            return db.find({
                genre: {
                    $elemMatch: {
                        $regex: genre,
                        $options: 'i'
                    }
                }
            }).toArray()
        }

        return db.find({}).toArray()
    }

    static async getById({ id }) {
        const db = await connect()
        const objectId = new ObjectId(id)
        return db.findOne({ _id: objectId })
    }

    static async create({ input }) {
        const db = await connect()

        const { insertedId } = await db.insertOne(input)

        return {
            id: insertedId,
            ...input
        }
    }

    static async delete({ id }) {
        const db = await connect()
        const objectId = new ObjectId(id)
        const { deletedCount } = await db.deleteOne({ _id: objectId })
        return deletedCount > 0
    }

    static async update({ id, input }) {
        const db = await connect()

        if (!ObjectId.isValid(id)) return false
        const objectId = new ObjectId(id)

        const result = await db.updateOne(
            { _id: objectId },
            { $set: input }
        )

        if (result.matchedCount === 0) return false // No encontró la película

        // Ahora sí: buscá la película actualizada
        const updatedMovie = await db.findOne({ _id: objectId })

        return {
            id: updatedMovie._id.toString(),
            ...updatedMovie,
            _id: undefined
        }
    }
}