import { Button, Card, Grid, Select, Table } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Fragment, useState } from 'react';
import ArticleEditor from '~/components/Article/Editor';
import type { Article } from '~/interfaces/Article';
import type { ArticleType } from '~/interfaces/ArticleType';
import { getArticles } from '~/models/article.server';
import { getArticleTypes } from '~/models/articleType.server';

export function meta() {
  return [{ title: 'Articles - Admin - BeSquishy' }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const articleTypes = await getArticleTypes();
  const articles = await getArticles({});
  const data = { articleTypes, articles };

  return json(data);
}

export const ArticleList = () => {
  const data = useLoaderData<typeof loader>();
  const [articleTypeKey, setArticleTypeKey] = useState<string | null>('');
  const [editArticleId, setEditArticleId] = useState<string | null>(null);
  const types = [{ value: '', label: 'Select Article Type' }];

  data?.articleTypes?.nodes?.map((articleType: ArticleType, index: number) =>
    types.push({
      value: index.toString(),
      label: articleType.title
    })
  );
  const rows = data?.articles?.nodes ? (
    data?.articles?.nodes?.map((article: Article) => (
      <Fragment key={article?.id}>
        <tr>
          <td>{article.id}</td>
          <td>
            {article?.articleType?.title} : {article?.articleTypeId}
          </td>
          <td>{article?.createdAt}</td>
          <td>{article?.title}</td>
          <td>{article?.slug}</td>
          <td>{article?.status}</td>
          <td>{article?.summary}</td>
          <td>{article?.user?.username}</td>
          <td>
            <Button
              onClick={() => setEditArticleId(article?.id)}
              size="compact-xs"
            >
              Edit
            </Button>
          </td>
        </tr>
        {editArticleId === article?.id ? (
          <tr key={`${article?.id}-editor`}>
            <td colSpan={8}>
              <ArticleEditor
                {...article}
                closeEditor={setEditArticleId}
                refetch={() => {}}
              />
            </td>
          </tr>
        ) : null}
      </Fragment>
    ))
  ) : (
    <tr>
      <td colSpan={8}>No Articles Stored</td>
    </tr>
  );

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 3, lg: 2, xl: 2 }}>
        <Select
          label="Article Type"
          placeholder="Select Article Type"
          data={types}
          value={articleTypeKey ?? ''}
          onChange={(value) => {
            setArticleTypeKey(value);
          }}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        {articleTypeKey !== '' ? (
          <ArticleEditor
            articleType={data?.articleTypes?.nodes?.[Number(articleTypeKey)]}
            closeEditor={setArticleTypeKey}
            refetch={() => {}}
          />
        ) : null}
      </Grid.Col>
      <Grid.Col span={12}>
        <Card withBorder>
          <Card.Section p={10}>Articles</Card.Section>
          <Card.Section p={10}>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Article Type</th>
                  <th>Created</th>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Summary</th>
                  <th>User</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default ArticleList;
