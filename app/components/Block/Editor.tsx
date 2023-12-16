import {
  Alert,
  Button,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useSubmit } from '@remix-run/react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { BlockType } from '~/interfaces/BlockType';
import { BlockEditors } from '~/blocks';

interface Editor {
  blockType?: BlockType;
  id?: string | null;
  name?: string;
  title?: string;
  status?: string;
  content?: any;
  closeEditor?: Dispatch<SetStateAction<string | null>>;
  refetch?: Function;
  stream?: { id: string; name: string };
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
    case 'html':
      return (
        <BlockEditors.HTMLBlockContentEditor content={content} form={form} />
      );
    case 'rich-text':
      return (
        <BlockEditors.RichTextBlockContentEditor
          content={content}
          form={form}
        />
      );
    default:
      return null;
  }
};

const BlockEditor = ({
  blockType = { id: '', title: '', name: '' },
  id = null,
  name = '',
  title = '',
  status = '',
  content = '',
  closeEditor = () => null,
  refetch = () => null
}: Editor) => {
  const [errorMsg, setErrorMsg] = useState('');
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
  const route = !id ? '/admin/blocks/create' : '/admin/blocks/update';

  const submit = useSubmit();
  const form = useForm({
    initialValues: {
      blockTypeId: blockType.id,
      id,
      name,
      title,
      content,
      status
    }
  });
  const Content = getBlockContentEditor({
    type: blockType.name,
    content,
    form
  });

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>{blockType?.title} Editor</Title>
          </Card.Section>
          <Card.Section p={10}>
            {errorMsg ? (
              <Alert title="Error" color="red">
                {errorMsg}
              </Alert>
            ) : null}
            <Form
              method="POST"
              action={route}
              onSubmit={form.onSubmit((_v, e) => submit(e.currentTarget))}
            >
              <Stack>
                {id && <input type="hidden" name="id" value={id} />}
                <input type="hidden" name="blockTypeId" value={blockType.id} />
                <TextInput
                  label="Block Title"
                  name="title"
                  type="text"
                  placeholder="Title"
                  {...form.getInputProps('title')}
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
                {Content}
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
              </Stack>
              <Group align="center" mt="md">
                <Button type="submit">Save</Button>
                <Button onClick={() => closeEditor('')}>Cancel</Button>
              </Group>
            </Form>
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default BlockEditor;
