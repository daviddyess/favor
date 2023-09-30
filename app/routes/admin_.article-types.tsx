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
        <Table.Tr>
          <Table.Td>{articleType?.id}</Table.Td>
          <Table.Td>{articleType?.name}</Table.Td>
          <Table.Td>{articleType?.title}</Table.Td>
          <Table.Td>{articleType?.slug}</Table.Td>
          <Table.Td>{articleType?.status}</Table.Td>
          <Table.Td>
            <Button
              onClick={() => setArticleTypeEditor(articleType?.id)}
              size="compact-xs"
            >
              Edit
            </Button>
          </Table.Td>
        </Table.Tr>
        {articleTypeEditor === articleType?.id ? (
          <Table.Tr key={`${articleType?.name}-editor`}>
            <Table.Td colSpan={6}>
              <ArticleTypeEditor
                {...articleType}
                closeEditor={setArticleTypeEditor}
                refetch={() => {}}
              />
            </Table.Td>
          </Table.Tr>
        ) : null}
      </Fragment>
    ))
  ) : (
    <Table.Tr>
      <Table.Td colSpan={8}>No Articles Types Stored</Table.Td>
    </Table.Tr>
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
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>TItle</Table.Th>
                  <Table.Th>Slug</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

ArticleTypes.title = 'Article Types';

export default ArticleTypes;
