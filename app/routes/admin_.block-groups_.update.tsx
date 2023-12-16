import type { ActionFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { redirect } from '@remix-run/node'; // or cloudflare/deno
import { updateBlockGroup } from '~/models/blockGroup.server';
//import { getSession } from '~/session.server';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const form = await request.formData();
    //const session = await getSession(request.headers.get('Cookie'));
    //const userId = session.get('userId') as string;
    console.log(form.get('slug') as string);
    const blockGroup = await updateBlockGroup({
      id: form.get('id') as string,
      name: form.get('name') as string,
      title: form.get('title') as string,
      description: form.get('description') as string,
      status: form.get('status') as string
    });

    if (blockGroup?.id) {
      return redirect(`/admin/block-groups`);
    } else return blockGroup;
  } catch (error) {
    throw error;
  }
}
