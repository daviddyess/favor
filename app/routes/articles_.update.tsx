import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { getArticleTypes } from '~/models/articleType.server';
import { updateArticle } from '~/models/article.server';
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

    const article = await updateArticle({
      id: form.get('id') as string,
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
