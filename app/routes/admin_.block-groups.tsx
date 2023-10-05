import { Button, Card, Grid, Table } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Fragment, useState } from 'react';
import BlockGroupEditor from '~/components/BlockGroup/Editor';
import type { BlockGroup } from '~/interfaces/BlockGroup';
import { getBlockGroups } from '~/models/blockGroup.server';

export function meta() {
  return [{ title: 'Block Groups - Admin - BeSquishy' }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const blockGroups = await getBlockGroups();
  const data = { blockGroups };

  return json(data);
}

export const BlockGroups = () => {
  const data = useLoaderData<typeof loader>();

  const [blockGroupEditor, setBlockGroupEditor] = useState<
    string | null | boolean
  >(false);
  const [newBlockGroupEditor, setNewBlockGroupEditor] = useState<
    string | null | boolean
  >(false);
  const rows = data?.blockGroups?.nodes ? (
    data?.blockGroups?.nodes?.map((blockGroup: BlockGroup) => (
      <Fragment key={blockGroup?.name}>
        <Table.Tr>
          <Table.Td>{blockGroup?.id}</Table.Td>
          <Table.Td>{blockGroup?.name}</Table.Td>
          <Table.Td>{blockGroup?.title}</Table.Td>
          <Table.Td>{blockGroup?.description}</Table.Td>
          <Table.Td>{blockGroup?.status}</Table.Td>
          <Table.Td>
            <Button
              onClick={() => setBlockGroupEditor(blockGroup?.id)}
              size="compact-xs"
            >
              Edit
            </Button>
          </Table.Td>
        </Table.Tr>
        {blockGroupEditor === blockGroup?.id ? (
          <Table.Tr key={`${blockGroup?.name}-editor`}>
            <Table.Td colSpan={6}>
              <BlockGroupEditor
                {...blockGroup}
                closeEditor={setBlockGroupEditor}
                refetch={() => {}}
              />
            </Table.Td>
          </Table.Tr>
        ) : null}
      </Fragment>
    ))
  ) : (
    <Table.Tr>
      <Table.Td colSpan={8}>No Block Groups Stored</Table.Td>
    </Table.Tr>
  );

  return (
    <Grid>
      {newBlockGroupEditor ? (
        <Grid.Col span={12}>
          <BlockGroupEditor
            closeEditor={setNewBlockGroupEditor}
            refetch={() => {}}
          />
        </Grid.Col>
      ) : null}
      <Grid.Col span={12}>
        <Card withBorder>
          <Card.Section p={10}>Block Groups</Card.Section>
          {!newBlockGroupEditor ? (
            <Card.Section p={10}>
              <Button onClick={() => setNewBlockGroupEditor(true)}>
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
                  <Table.Th>Description</Table.Th>
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

BlockGroups.title = 'Block Groups';

export default BlockGroups;
