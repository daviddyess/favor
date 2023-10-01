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
        <Table.Tr>
          <Table.Td>{article.id}</Table.Td>
          <Table.Td>
            {article?.articleType?.title} : {article?.articleTypeId}
          </Table.Td>
          <Table.Td>{article?.createdAt}</Table.Td>
          <Table.Td>{article?.title}</Table.Td>
          <Table.Td>{article?.slug}</Table.Td>
          <Table.Td>{article?.status}</Table.Td>
          <Table.Td>{article?.summary}</Table.Td>
          <Table.Td>{article?.user?.username}</Table.Td>
          <Table.Td>
            <Button
              onClick={() => setEditArticleId(article?.id)}
              size="compact-xs"
            >
              Edit
            </Button>
          </Table.Td>
        </Table.Tr>
        {editArticleId === article?.id ? (
          <Table.Tr key={`${article?.id}-editor`}>
            <Table.Td colSpan={8}>
              <ArticleEditor
                {...article}
                closeEditor={setEditArticleId}
                refetch={() => {}}
              />
            </Table.Td>
          </Table.Tr>
        ) : null}
      </Fragment>
    ))
  ) : (
    <Table.Tr>
      <Table.Td colSpan={8}>No Articles Stored</Table.Td>
    </Table.Tr>
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
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Article Type</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Slug</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Summary</Table.Th>
                  <Table.Th>User</Table.Th>
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

export default ArticleList;
