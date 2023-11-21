import { Sequelize, DataTypes, Model } from "sequelize";

import { ArticleView } from "@interfaces/article.interface";

export type ArticleViewCreationAttributes = ArticleView;

export class ArticleViewModel extends Model<ArticleView, ArticleViewCreationAttributes> implements ArticleView {
  public article_id: number;
  public user_id: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: Sequelize): typeof ArticleViewModel {
  ArticleViewModel.init(
    {
      article_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "articles_views",
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  return ArticleViewModel;
}