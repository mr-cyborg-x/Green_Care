const express = require('express');
const app = express();
const PORT = 5002;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Minimal server running on port ${PORT}`);
});
