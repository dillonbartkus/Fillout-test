// 'npm i' then 'npm run dev' to start server

const express = require('express')
const app = express()

app.get('/:formId/filteredResponses', (req, res) => {
    console.log(req)
    res.send('foo')
})

app.use('*', (req, res) => {
    res.status(404).send('Not found')
})

app.listen(3000)