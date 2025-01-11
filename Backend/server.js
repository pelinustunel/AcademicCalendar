const app = require("./src/app");
const cors = require('cors');

const PORT = process.env.PORT || 3000;


app.use(cors());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
