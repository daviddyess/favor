import {
  Button,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Form, useLoaderData, useSubmit } from '@remix-run/react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

import { BlockEditors } from '~/blocks';

interface Editor {
  id?: string | null;
  name?: string;
  title?: string;
  content?: any;
  status?: string;
  closeEditor?: Dispatch<SetStateAction<string | null | boolean>>;
  refetch: Function;
}

const getBlockContentEditor = ({
  type,
  content,
  form
}: {
  type: string;
  content: any;
  form: any;
}) => {
  switch (type) {
    case 'HTML':
      return (
        <BlockEditors.HTMLBlockContentEditor content={content} form={form} />
      );
    default:
      return null;
  }
};

const BlockEditor = ({
  blockType,
  id = null,
  name = '',
  title = '',
  content = '',
  status = '',
  closeEditor = () => false,
  refetch = Function
}: Editor) => {
  const [errorMsg] = useState({});
  const { error } = useLoaderData();

  const route = !id ? '/admin/blocks/create' : '/admin/blocks/update';

  const submit = useSubmit();
  const form = useForm({
    initialValues: {
      id,
      name,
      title,
      content,
      status
    }
  });

  const Content = () => getBlockContentEditor({ type, content, form });

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const autoFill = (name: string, value: string) => {
    switch (name) {
      case 'title':
        if (form.values.name === '') {
          form.setFieldValue('name', value.toLowerCase());
        }
        break;
      default:
    }
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 4 }}>
        <Card withBorder>
          <Card.Section p={10}>Block Editor</Card.Section>
          <Card.Section p={10}>
            <pre>{JSON.stringify(errorMsg, null, 2)}</pre>
            <Form
              method="POST"
              action={route}
              onSubmit={form.onSubmit((_v, e) => submit(e.currentTarget))}
            >
              <Stack>
                {id && <input type="hidden" name="id" value={id} />}
                <TextInput
                  label="Block Title"
                  name="title"
                  type="text"
                  placeholder="e.g. Announcements"
                  {...form.getInputProps('title')}
                  onBlur={({ currentTarget: { value } }) =>
                    autoFill('title', value)
                  }
                />
                <TextInput
                  label="Unique Name"
                  name="name"
                  type="text"
                  placeholder="e.g. announcements"
                  {...form.getInputProps('name')}
                  onBlur={({ currentTarget: { value } }) =>
                    autoFill('name', value)
                  }
                />
                {Content && <Content />}
                <Select
                  label="Block Status"
                  name="status"
                  placeholder="Select Status"
                  {...form.getInputProps('status')}
                  data={[
                    { value: '', label: 'Select Status' },
                    {
                      value: 'enabled',
                      label: 'Enabled'
                    },
                    {
                      value: 'disabled',
                      label: 'Disabled'
                    }
                  ]}
                />
                <Group align="center" mt="md">
                  <Button type="submit">Save</Button>
                  <Button onClick={() => closeEditor(false)}>Cancel</Button>
                </Group>
              </Stack>
            </Form>
          </Card.Section>
          <Card.Section>
            <pre>{JSON.stringify(form.values, null, 2)}</pre>
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default BlockEditor;
