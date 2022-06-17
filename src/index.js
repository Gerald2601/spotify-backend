const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
// lee variables del fichero .env (si este existe)
dotenv.config();
const app = express();
const mongo = require('./mongo');
const songsRouter = require('./routers/songRouter')
const bodyParser = require('body-parser');
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }))

app.use(express.json());
app.use(songsRouter);

app.listen(PORT, () => {
    console.log('"Server is up and running in port 3001"')
})