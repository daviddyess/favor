import { Button, Card, Grid, Select, Table } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Fragment, useState } from 'react';
import BlockEditor from '~/components/Block/Editor';
import type { Block } from '~/interfaces/Block';
import type { BlockType } from '~/interfaces/BlockType';
import { getBlocks } from '~/models/block.server';
import { getBlockTypes } from '~/models/blockType.server';

export function meta() {
  return [{ title: 'Blocks - Admin - BeSquishy' }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const blockTypes = await getBlockTypes();
  const blocks = await getBlocks();
  const data = { blockTypes, blocks };

  return json(data);
}

export const BlockList = () => {
  const data = useLoaderData<typeof loader>();
  const [blockTypeKey, setBlockTypeKey] = useState<string | null>('');
  const [editBlockId, setEditBlockId] = useState<string | null>(null);
  const types = [{ value: '', label: 'Select Block Type' }];

  data?.blockTypes?.nodes?.map((blockType: BlockType, index: number) =>
    types.push({
      value: index.toString(),
      label: blockType.title
    })
  );
  const rows =
    data?.blocks?.nodes.length > 0 ? (
      data?.blocks?.nodes?.map((block: Block) => (
        <Fragment key={block?.id}>
          <Table.Tr>
            <Table.Td>{block.id}</Table.Td>
            <Table.Td>
              {block?.blockType?.title} : {block?.blockTypeId}
            </Table.Td>
            <Table.Td>{block?.title}</Table.Td>
            <Table.Td>{block?.status}</Table.Td>
            <Table.Td>
              <Button
                onClick={() => setEditBlockId(block?.id)}
                size="compact-xs"
              >
                Edit
              </Button>
            </Table.Td>
          </Table.Tr>
          {editBlockId === block?.id ? (
            <Table.Tr key={`${block?.id}-editor`}>
              <Table.Td colSpan={8}>
                <BlockEditor
                  {...block}
                  closeEditor={setEditBlockId}
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
      <Grid.Col span={{ base: 12, md: 3, lg: 2, xl: 2 }}>
        <Select
          label="Block Type"
          placeholder="Select Block Type"
          data={types}
          value={blockTypeKey ?? ''}
          onChange={(value) => {
            setBlockTypeKey(value);
          }}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        {blockTypeKey !== '' ? (
          <BlockEditor
            blockType={data?.blockTypes?.nodes?.[Number(blockTypeKey)]}
            closeEditor={setBlockTypeKey}
            refetch={() => {}}
          />
        ) : null}
      </Grid.Col>
      <Grid.Col span={12}>
        <Card withBorder>
          <Card.Section p={10}>Blocks</Card.Section>
          <Card.Section p={10}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Block Type</Table.Th>
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

export default BlockList;
