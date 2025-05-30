import { App } from "@/app";
import { ValidateEnv } from "@utils/validateEnv";

import { AuthRoute } from "@routes/auth.routes";
import { UserRoute } from "@routes/users.routes";
import { AccountRoute } from "@routes/account.routes";
import { FileRoute } from "@routes/files.routes";

import { CategoryRoute } from "@routes/categories.routes";
import { ArticleRoute } from "@routes/articles.routes";
import { CommentRoute } from "./routes/comments.routes";
import { ReplyRoute } from "./routes/replies.routes";

ValidateEnv();

export const app = new App([
  new AuthRoute(), 
  new UserRoute(),
  new AccountRoute(),
  new FileRoute(),

  new CategoryRoute(),
  new ArticleRoute(),
  new CommentRoute(),
  new ReplyRoute()
]);

app.listen();