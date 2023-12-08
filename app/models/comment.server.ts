import { aql, db } from '~/modules/arango';
import { getLogger } from 'logade';
import type { CommentInput } from '~/interfaces/Comment';
import { getArticleType } from './articleType.server';
import { timeStamp } from '~/modules/utils';

const log = getLogger('Users Query');
const articles = db.collection('articles');
const comments = db.collection('comments');
const streams = db.collection('streams');
const users = db.collection('users');

export async function createComment({
  articleTypeId,
  text,
  title,
  userId
}: CommentInput) {
  try {
    const { title: articleTypeTitle } = await getArticleType(articleTypeId);

    const data = {
      articleTypeId,
      text,
      title,
      createdAt: timeStamp(),
      userId
    };

    const article = await comments.save(data, {
      returnNew: true
    });

    article.new.articleType = { title: articleTypeTitle };

    return article.new;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updateComment({
  id,
  articleTypeId,
  status = 'draft',
  text,
  title,
  userId
}: CommentInput) {
  try {
    const { title: articleTypeTitle } = await getArticleType(articleTypeId);

    const data = { status, text, title, updatedAt: timeStamp() };

    const comment = await comments.update(id, data, {
      returnNew: true
    });
    comment.new.articleType = { title: articleTypeTitle };
    return comment.new;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getComments({
  filter = {}
}: {
  filter?: {
    username?: string;
    articleId?: string;
    article?: string;
    articleTypeId?: string;
  };
}) {
  try {
    let article,
      user,
      articleFilter,
      userFilter = '';
    const bindVars = {} as {
      articleId?: string;
      userId?: string;
    };

    if (filter?.username) {
      const userQuery = await db.query(
        aql`
            FOR user IN ${users}
              FILTER user.username == ${filter.username}
              LIMIT 1
              RETURN {
                "id" : user._key
              }
          `
      );

      user = await userQuery.next();
      userFilter = `FILTER comment.userId == @userId`;
      bindVars.userId = user.id;
    }
    if (filter?.article) {
      const articleQuery = await db.query(
        aql`
            FOR article IN ${articles}
              FILTER atricle.slug == ${filter.article}
              LIMIT 1
              RETURN {
                "id" : article._key
              }
          `
      );

      article = await articleQuery.next();
      articleFilter = `FILTER comment.articleId == @articleId`;
      bindVars.articleId = article.id;
    }
    if (filter?.articleId) {
      articleFilter = `FILTER comment.articleId == @articleId`;
      bindVars.articleId = filter.articleId;
    }

    const comment = await db.query(
      {
        query: `FOR comment IN comments
          ${articleFilter}
          ${userFilter}
          FOR user IN users
            FILTER user._key == comment.userId
          SORT comment.createdAt DESC
          RETURN {
            "id" : comment._key,
            "articleId" : comment.articleId,
            "createdAt" : comment.createdAt,
            "text" : comment.text,
            "updatedAt" : comment.updatedAt,
            "user" : user,
            "userId" : comment.userId
          }`,
        bindVars
      },
      { fullCount: true }
    );

    const totalCount = await comment?.extra?.stats?.fullCount;
    const nodes = await comment.all();
    console.log(nodes);
    return {
      count: nodes.length,
      totalCount,
      nodes
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
