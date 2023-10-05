import { Button, Card, Grid, Table } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Fragment, useState } from 'react';
import BlockEditor from '~/components/Block/Editor';
import type { Block } from '~/interfaces/Block';
import { getBlocks } from '~/models/block.server';

export function meta() {
  return [{ title: 'Blocks - Admin - BeSquishy' }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const blocks = await getBlocks();
  const data = { blocks };

  return json(data);
}

export const Blocks = () => {
  const data = useLoaderData<typeof loader>();

  const [blockEditor, setBlockEditor] = useState<string | null | boolean>(
    false
  );
  const [newBlockEditor, setNewBlockEditor] = useState<string | null | boolean>(
    false
  );
  const rows = data?.blocks?.nodes ? (
    data?.blocks?.nodes?.map((block: Block) => (
      <Fragment key={block?.name}>
        <Table.Tr>
          <Table.Td>{block?.id}</Table.Td>
          <Table.Td>{block?.name}</Table.Td>
          <Table.Td>{block?.title}</Table.Td>
          <Table.Td>{block?.status}</Table.Td>
          <Table.Td>
            <Button onClick={() => setBlockEditor(block?.id)} size="compact-xs">
              Edit
            </Button>
          </Table.Td>
        </Table.Tr>
        {blockEditor === block?.id ? (
          <Table.Tr key={`${block?.name}-editor`}>
            <Table.Td colSpan={6}>
              <BlockEditor
                {...block}
                closeEditor={setBlockEditor}
                refetch={() => {}}
              />
            </Table.Td>
          </Table.Tr>
        ) : null}
      </Fragment>
    ))
  ) : (
    <Table.Tr>
      <Table.Td colSpan={8}>No Blocks Stored</Table.Td>
    </Table.Tr>
  );

  return (
    <Grid>
      {newBlockEditor ? (
        <Grid.Col span={12}>
          <BlockEditor closeEditor={setNewBlockEditor} refetch={() => {}} />
        </Grid.Col>
      ) : null}
      <Grid.Col span={12}>
        <Card withBorder>
          <Card.Section p={10}>Block Groups</Card.Section>
          {!newBlockEditor ? (
            <Card.Section p={10}>
              <Button onClick={() => setNewBlockEditor(true)}>
                Add Block Group
              </Button>
            </Card.Section>
          ) : null}
          <Card.Section p={10}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Title</Table.Th>
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

Blocks.title = 'Block Groups';

export default Blocks;
