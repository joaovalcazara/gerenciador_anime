// index.js

const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');


app.use(express.json()); 
app.use(cors());  
app.use(userRoutes);  

 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
