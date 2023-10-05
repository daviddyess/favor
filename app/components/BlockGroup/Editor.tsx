import {
  Button,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Form, useLoaderData, useSubmit } from '@remix-run/react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

interface Editor {
  id?: string | null;
  name?: string;
  title?: string;
  description?: string;
  status?: string;
  closeEditor?: Dispatch<SetStateAction<string | null | boolean>>;
  refetch: Function;
}

const BlockGroupEditor = ({
  id = null,
  name = '',
  title = '',
  description = '',
  status = '',
  closeEditor = () => false,
  refetch = Function
}: Editor) => {
  const [errorMsg] = useState({});
  const { error } = useLoaderData();

  const route = !id
    ? '/admin/block-groups/create'
    : '/admin/block-groups/update';

  const submit = useSubmit();
  const form = useForm({
    initialValues: {
      id,
      name,
      title,
      description,
      status
    }
  });

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
          <Card.Section p={10}>Block Group Editor</Card.Section>
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
                  label="Block Group Title"
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
                <Textarea
                  placeholder="e.g. purpose, audience, .etc of articles"
                  label="Block Group Description"
                  name="description"
                  {...form.getInputProps('description')}
                />
                <Select
                  label="Block Group Status"
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
export default BlockGroupEditor;
