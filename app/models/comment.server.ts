import { aql, db } from '~/modules/arango';
import { getLogger } from 'logade';
import type { CommentInput } from '~/interfaces/Comment';
import { getArticleType } from './articleType.server';
import { formatSlug, timeStamp } from '~/modules/utils';

const log = getLogger('Users Query');
const articles = db.collection('articles');
const comments = db.collection('comments');
const streams = db.collection('streams');
const users = db.collection('users');

export async function createComment({
  articleTypeId,
  createdAt = null,
  status = 'draft',
  summary,
  text,
  title,
  images = [],
  userId
}: CommentInput) {
  try {
    const {
      options: {
        slugFormat,
        usePublishedDate,
        useSetDateAndTime,
        useStatus,
        useSummary
      },
      title: articleTypeTitle
    } = await getArticleType(articleTypeId);

    const data = {
      articleTypeId,
      text,
      title,
      createdAt:
        useSetDateAndTime && createdAt !== null ? createdAt : timeStamp(),
      userId
    };

    if (useStatus) {
      data.status = status;
    }
    if (useSummary) {
      data.summary = summary;
    }

    const article = await articles.save(data, {
      returnNew: true
    });

    const slug = formatSlug({
      format: slugFormat,
      id: article._key,
      title
    });
    const _images: {
      base64?: string;
      description?: string;
      file?: string;
      name?: string;
    }[] = [];

    if (images.length > 0) {
      images?.map(async (file) => {
        if (file?.base64) {
          file.name = `${article._key}_${Date.now()}.webp`;
          // file.deleteFile = data?.avatar;
          await processImage({ file });
          _images.push({
            file: file?.name,
            description: file?.description
          });
        }
      });
    }

    await articles.update(article._key, {
      slug,
      images: _images
    });

    article.new.slug = slug;
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
  images = [],
  userId
}: CommentInput) {
  try {
    const {
      options: {
        slugFormat,
        usePublishedDate,
        useSetDateAndTime,
        useStatus,
        useSummary
      },
      title: articleTypeTitle
    } = await getArticleType(articleTypeId);
    const articleQuery = await db.query(aql`
          FOR article IN ${articles}
            FILTER article._key == ${id}
            LIMIT 1
            RETURN article.status
        `);

    const prevStatus = await articleQuery.next();
    const data = { status, summary, text, title, updatedAt: timeStamp() };

    if (
      usePublishedDate &&
      prevStatus !== 'published' &&
      status === 'published'
    ) {
      data.createdAt = timeStamp();
      data.slug = formatSlug({ format: slugFormat, id, title });
    }
    if (useStatus) {
      data.status = status;
    }
    if (useSummary) {
      data.summary = summary;
    }

    const article = await articles.update(id, data, {
      returnNew: true
    });

    return article.new;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getComments({
  filter = {}
}: {
  filter?: { username?: string; stream?: string };
}) {
  try {
    let user,
      stream,
      userFilter = '',
      streamFilter = '';
    const bindVars = {} as { userId?: string; streamId?: string };

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
      userFilter = `FILTER article.userId == @userId`;
      bindVars.userId = user.id;
    }
    if (filter?.stream) {
      const streamSlug = filter?.username
        ? `${user.id}/${filter.stream}`
        : filter?.stream;
      const streamQuery = await db.query(
        aql`
            FOR stream IN ${streams}
              FILTER stream.slug == ${streamSlug}
              LIMIT 1
              RETURN {
                "id" : stream._key
              }
          `
      );

      stream = await streamQuery.next();
      streamFilter = `FILTER article.streamId == @streamId`;
      bindVars.streamId = stream.id;
    }

    const article = await db.query(
      {
        query: `FOR article IN articles
          ${userFilter}
          ${streamFilter}
          FOR articleType in articleTypes
            FILTER articleType._key == article.articleTypeId
          FOR user IN users
            FILTER user._key == article.userId
          SORT article.createdAt DESC
          RETURN {
            "id" : article._key,
            "articleType" : MERGE(articleType, {"id": articleType._key}),
            "articleTypeId" : article.articleTypeId,
            "createdAt" : article.createdAt,
            "slug" : article.slug,
            "summary" : article.summary,
            "status" : article.status,
            "text" : article.text,
            "title" : article.title,
            "updatedAt" : article.updatedAt,
            "user" : user,
            "userId" : article.userId
          }`,
        bindVars
      },
      { fullCount: true }
    );

    const totalCount = await article?.extra?.stats?.fullCount;
    const nodes = await article.all();
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
