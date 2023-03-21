import express from 'express'

const app = express();

app.use(express.static('public'));

// app.get('/', (req, res) => {
//     res.end()
// })

const port = 5000;
app.listen(port, () => {
    console.log('server listening on ', port)
})