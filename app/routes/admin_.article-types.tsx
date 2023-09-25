import { Button, Card, Grid, Table } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Fragment, useState } from 'react';
import ArticleTypeEditor from '~/components/ArticleType/Editor';
import type { ArticleType } from '~/interfaces/ArticleType';
import { getArticleTypes } from '~/models/articleType.server';

export function meta() {
  return [{ title: 'Articles Types - Admin - BeSquishy' }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const articleTypes = await getArticleTypes();
  const data = { articleTypes };

  return json(data);
}

export const ArticleTypes = () => {
  const data = useLoaderData<typeof loader>();

  const [articleTypeEditor, setArticleTypeEditor] = useState<
    string | null | boolean
  >(false);
  const [newArticleTypeEditor, setNewArticleTypeEditor] = useState<
    string | null | boolean
  >(false);
  const rows = data?.articleTypes?.nodes ? (
    data?.articleTypes?.nodes?.map((articleType: ArticleType) => (
      <Fragment key={articleType?.name}>
        <tr>
          <td>{articleType?.id}</td>
          <td>{articleType?.name}</td>
          <td>{articleType?.title}</td>
          <td>{articleType?.slug}</td>
          <td>{articleType?.status}</td>
          <td>
            <Button
              onClick={() => setArticleTypeEditor(articleType?.id)}
              size="compact-xs"
            >
              Edit
            </Button>
          </td>
        </tr>
        {articleTypeEditor === articleType?.id ? (
          <tr key={`${articleType?.name}-editor`}>
            <td colSpan={6}>
              <ArticleTypeEditor
                {...articleType}
                closeEditor={setArticleTypeEditor}
                refetch={() => {}}
              />
            </td>
          </tr>
        ) : null}
      </Fragment>
    ))
  ) : (
    <tr>
      <td colSpan={8}>No Articles Types Stored</td>
    </tr>
  );

  return (
    <Grid>
      {newArticleTypeEditor ? (
        <Grid.Col span={12}>
          <ArticleTypeEditor
            closeEditor={setNewArticleTypeEditor}
            refetch={() => {}}
          />
        </Grid.Col>
      ) : null}
      <Grid.Col span={12}>
        <Card withBorder>
          <Card.Section p={10}>Article Types</Card.Section>
          {!newArticleTypeEditor ? (
            <Card.Section p={10}>
              <Button onClick={() => setNewArticleTypeEditor(true)}>
                Add Article Type
              </Button>
            </Card.Section>
          ) : null}
          <Card.Section p={10}>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>TItle</th>
                  <th>Slug</th>
                  <th>Status</th>
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

ArticleTypes.title = 'Article Types';

export default ArticleTypes;
