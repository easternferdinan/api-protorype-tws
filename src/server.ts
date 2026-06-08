import "dotenv/config";
import app from "./app.js";
import { env } from "./configs/env.js";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (env.NODE_ENV === "development") {
    console.log("with env: ", env);
  }
});