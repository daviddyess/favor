import { Title, Grid, Tabs } from '@mantine/core';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { useLoaderData, useNavigate } from '@remix-run/react';
import ArticlesEditor from '~/components/Editor';
import { getArticleTypes } from '~/models/articleType.server';
import { createArticle } from '~/models/article.server';
import { getSession } from '~/session.server';

export function meta() {
  return [{ title: 'Create Article - BeSquishy' }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const articleTypes = await getArticleTypes();

  const data = { articleTypes };

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const form = await request.formData();
    const session = await getSession(request.headers.get('Cookie'));
    const userId = session.get('userId') as string;

    const article = await createArticle({
      articleTypeId: form.get('articleTypeId') as string,
      createdAt: form.get('createdAt') as string,
      status: form.get('status') as string,
      summary: form.get('summary') as string,
      text: JSON.parse(form.get('text') as string),
      title: form.get('title') as string,
      userId
    });

    if (article?.slug) {
      return redirect(`/articles`);
    } else return article;
  } catch (error) {
    throw error;
  }
}

export default function ArticlesCreate() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Articles</Title>
        <Tabs defaultValue="create" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="create">Create</Tabs.Tab>
            <Tabs.Tab value="browse" onClick={() => navigate('/articles')}>
              Browse
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="create" py={10}>
            <ArticlesEditor
              refetch={() => null}
              articleTypes={data?.articleTypes?.nodes}
            />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
