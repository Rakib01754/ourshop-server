const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware 

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n58ahyf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // databse collections 
        const productCollection = client.db("OurShop").collection("products");
        const brandCollection = client.db("OurShop").collection("brand");
        // get products from database
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        });
        // get limited data for homepage 
        app.get('/productssample', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query).limit(5)
            const productsData = await cursor.toArray()
            res.send(productsData)
        });

        //get brands from database
        app.get('/brands', async (req, res) => {
            const query = {}
            const cursor = brandCollection.find(query).limit(5)
            const brands = await cursor.toArray()
            res.send(brands)
        });

        //get advertised product by query
        app.get('/advertised', async (req, res) => {
            const query = { advertise: 'true' }
            const data = await productCollection.find(query).toArray();
            res.send(data)
        });

        //get specific products by id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result)
        })
        //get specific products by id
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id
            const query = { categoryId: id }
            const result = await productCollection.find(query).toArray();
            res.send(result)
        })
    } finally {
        //   await client.close();
    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Our Shop project server running')
});

app.listen(port, () => {
    console.log(`project server running on port ${port}`)
})