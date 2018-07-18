const express = require('express');

const app = express();
app.get('/', (req,res)=>{
  res.send({hi:'My name is Ozlem'});
});


const PORT = process.env.PORT || 5000;
app.listen(PORT);
