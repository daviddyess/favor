import {
  Alert,
  Button,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.css';
import { Form, useSubmit } from '@remix-run/react';
import type { JSONContent } from '@tiptap/core';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import MantineEditor from '~/components/Tiptap/Editor';
import type { ArticleType } from '~/interfaces/ArticleType';

interface Editor {
  articleType?: ArticleType;
  id?: string | null;
  createdAt?: string | null;
  status?: string;
  summary?: string;
  text?: { type?: string; content?: JSONContent[] | undefined };
  title?: string;
  closeEditor?: Dispatch<SetStateAction<string | null>>;
  refetch?: Function;
  stream?: { id: string; name: string };
}

const ArticleEditor = ({
  articleType = { id: '', title: '', name: '' },
  id = null,
  createdAt = null,
  status = '',
  summary = '',
  text = { type: 'doc' },
  title = '',
  closeEditor = () => null,
  refetch = () => null
}: Editor) => {
  const form = useForm({
    initialValues: {
      articleTypeId: articleType.id,
      id,
      createdAt,
      status,
      summary,
      text,
      title
    }
  });

  const [errorMsg, setErrorMsg] = useState('');

  const route = !id ? '/articles/create' : '/articles/update';

  const submit = useSubmit();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            <Title order={3}>{articleType?.title} Editor</Title>
          </Card.Section>
          <Card.Section p={10}>
            {errorMsg ? (
              <Alert title="Error" color="red">
                {errorMsg}
              </Alert>
            ) : null}
            <Form
              method="post"
              action={route}
              onSubmit={form.onSubmit((_v, e) => submit(e.currentTarget))}
            >
              <Stack>
                {id && <input type="hidden" name="id" value={id} />}
                <input
                  type="hidden"
                  name="articleTypeId"
                  value={articleType.id}
                />
                <TextInput
                  label="Article Title"
                  name="title"
                  type="text"
                  placeholder="Title"
                  {...form.getInputProps('title')}
                />
                {articleType?.options?.useSummary ? (
                  <Textarea
                    placeholder="Summary"
                    label="Article Summary"
                    name="summary"
                    value={form.values.summary}
                    onChange={(event) =>
                      form.setFieldValue('summary', event.currentTarget.value)
                    }
                  />
                ) : null}
                <MantineEditor name="text" form={form} />
                <input
                  type="hidden"
                  name="text"
                  value={JSON.stringify(form.values.text)}
                />
                {articleType?.options?.useStatus ? (
                  <Select
                    label="Article Status"
                    name="status"
                    placeholder="Select Status"
                    {...form.getInputProps('status')}
                    data={[
                      { value: '', label: 'Select Status' },
                      {
                        value: 'published',
                        label: 'Published'
                      },
                      {
                        value: 'draft',
                        label: 'Draft'
                      },
                      {
                        value: 'private',
                        label: 'Private'
                      }
                    ]}
                  />
                ) : null}
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
export default ArticleEditor;
