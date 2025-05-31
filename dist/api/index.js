"use strict";
const express = require('express');
const pg = require('pg');
const app = express();
const PORT = 8000;
app.get('/', (req, res)=>{
    res.send('Hello World');
});
app.get('/about', (req, res)=>{
    res.send('About route 🎉 ');
});
app.listen(PORT, ()=>{
    console.log(`✅ Server is running on port ${PORT}`);
});

//# sourceMappingURL=index.js.map