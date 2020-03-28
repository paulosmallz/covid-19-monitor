const app = require("./app");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.info(`The app is listening on port ${PORT}`);
});
