import type { ActionFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { redirect } from '@remix-run/node'; // or cloudflare/deno
import { updateArticleType } from '~/models/articleType.server';
//import { getSession } from '~/session.server';

export function meta() {
  return [{ title: 'Create Article - BeSquishy' }];
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const form = await request.formData();
    //const session = await getSession(request.headers.get('Cookie'));
    //const userId = session.get('userId') as string;
    console.log(form.get('slug') as string);
    const article = await updateArticleType({
      id: form.get('id') as string,
      createdAt: form.get('createdAt') as string,
      name: form.get('name') as string,
      title: form.get('title') as string,
      description: form.get('description') as string,
      options: JSON.parse(form.get('options') as string),
      slug: form.get('slug') as string,
      status: form.get('status') as string
    });

    if (article?.slug) {
      return redirect(`/admin/article-types`);
    } else return article;
  } catch (error) {
    throw error;
  }
}
