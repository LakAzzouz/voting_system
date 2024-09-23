import express from "express";
import { userRouteur } from "./app/routes/user";
import { topicRouter } from "./app/routes/topic";
import { voteRouteur } from "./app/routes/vote";

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/users", userRouteur);
app.use("/topics", topicRouter);
app.use("/votes", voteRouteur);

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
