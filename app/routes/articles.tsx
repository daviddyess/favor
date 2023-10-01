import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { Article } from '~/interfaces/Article';
import ArticleCard from '~/components/Article';
import { getArticles } from '~/models/article.server';

export function meta() {
  return [{ title: 'Articles - BeSquishy' }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const articles = await getArticles({});

  const data = { articles };

  return json(data);
}

export default function Articles() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const articles =
    data?.articles?.nodes?.length > 0 ? (
      data?.articles?.nodes?.map((article: Article) => (
        <ArticleCard
          key={article.id}
          data={{
            ...article,
            category: article?.articleType?.title,
            author: {
              name: article?.user?.username,
              description: '',
              image: ''
            }
          }}
        />
      ))
    ) : (
      <h4>No Articles Stored</h4>
    );

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Articles</Title>
        <Tabs defaultValue="browse" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab
              value="create"
              onClick={() => navigate('/articles/create')}
            >
              Create
            </Tabs.Tab>
            <Tabs.Tab value="browse">Browse</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="browse" py={10}>
            {articles}
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
