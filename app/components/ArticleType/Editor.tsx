import {
  Button,
  Card,
  Grid,
  Group,
  Select,
  Switch,
  Stack,
  Textarea,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { ArticleTypeInput } from '~/interfaces/ArticleType';

interface Editor {
  id?: string | null;
  createdAt?: string;
  name?: string;
  title?: string;
  description?: string;
  options?: {
    slugFormat: string;
    usePublishedDate: boolean;
    useSetDateAndTime: boolean;
    useStatus: boolean;
    useSummary: boolean;
    useSummaryAsIntro: boolean;
    useImage: boolean;
  };
  slug?: string;
  status?: string;
  closeEditor?: Dispatch<SetStateAction<string | null | boolean>>;
  refetch: Function;
}

const defaultOptions = {
  slugFormat: '',
  usePublishedDate: false,
  useSetDateAndTime: false,
  useStatus: false,
  useSummary: false,
  useSummaryAsIntro: false,
  useImage: false
};

const ArticleTypeEditor = ({
  id = null,
  createdAt = '',
  name = '',
  title = '',
  description = '',
  options = defaultOptions,
  slug = '',
  status = '',
  closeEditor = () => false,
  refetch = Function
}: Editor) => {
  const [errorMsg] = useState({});

  const form = useForm({
    initialValues: {
      id,
      createdAt,
      name,
      title,
      description,
      options,
      slug,
      status
    }
  });

  const handleArticleType = async (values: ArticleTypeInput) => {
    // eslint-disable-next-line no-console
    console.log(values);
    refetch();
    closeEditor(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const autoFill = (name: string, value: string) => {
    switch (name) {
      case 'title':
        if (form.values.name === '') {
          form.setFieldValue('name', value.toLowerCase());
        }
        if (form.values.slug === '') {
          form.setFieldValue('slug', value.toLowerCase());
        }
        break;
      case 'name':
        form.setFieldValue('slug', value.toLowerCase());
        break;
      default:
    }
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 4 }}>
        <Card withBorder>
          <Card.Section p={10}>Article Type Editor</Card.Section>
          <Card.Section p={10}>
            <pre>{JSON.stringify(errorMsg, null, 2)}</pre>
            <form
              onSubmit={form.onSubmit((values) => handleArticleType(values))}
            >
              <Stack>
                <TextInput
                  label="Article Type Title"
                  type="text"
                  placeholder="e.g. Announcements"
                  {...form.getInputProps('title')}
                  onBlur={({ currentTarget: { value } }) =>
                    autoFill('title', value)
                  }
                />
                <TextInput
                  label="Unique Name"
                  type="name"
                  placeholder="e.g. announcements"
                  {...form.getInputProps('name')}
                  onBlur={({ currentTarget: { value } }) =>
                    autoFill('name', value)
                  }
                />
                <Textarea
                  placeholder="e.g. purpose, audience, .etc of articles"
                  label="Article Type Description"
                  {...form.getInputProps('description')}
                />
                <Switch
                  checked={form.values.options.useImage}
                  label="Image Uploads"
                  onChange={({ currentTarget: { checked } }) => {
                    form.setFieldValue('options.useImage', checked);
                  }}
                />
                <Switch
                  checked={form.values.options.useSummary}
                  label="Summary"
                  onChange={({ currentTarget: { checked } }) => {
                    form.setFieldValue('options.useSummary', checked);
                    if (!checked) {
                      form.setFieldValue('options.useSummaryAsIntro', checked);
                    }
                  }}
                />
                {form.values.options.useSummary ? (
                  <Switch
                    checked={form.values.options.useSummaryAsIntro}
                    label="Display Summary on Article Page"
                    onChange={({ currentTarget: { checked } }) =>
                      form.setFieldValue('options.useSummaryAsIntro', checked)
                    }
                  />
                ) : null}
                <Switch
                  checked={form.values.options.useStatus}
                  label="Statuses"
                  onChange={({ currentTarget: { checked } }) => {
                    form.setFieldValue('options.useStatus', checked);
                    if (!checked) {
                      form.setFieldValue('options.usePublishedDate', checked);
                    }
                  }}
                />
                {form.values.options.useStatus ? (
                  <Switch
                    checked={form.values.options.usePublishedDate}
                    label="Published Date"
                    onChange={({ currentTarget: { checked } }) => {
                      form.setFieldValue('options.usePublishedDate', checked);
                    }}
                  />
                ) : null}
                <Switch
                  checked={form.values.options.useSetDateAndTime}
                  label="Date Field"
                  onChange={({ currentTarget: { checked } }) =>
                    form.setFieldValue('options.useSetDateAndTime', checked)
                  }
                />
                <TextInput
                  label="URL Slug"
                  type="text"
                  placeholder="article-type"
                  {...form.getInputProps('slug')}
                  onChange={({ currentTarget: { value } }) =>
                    form.setFieldValue('slug', value)
                  }
                />
                <Select
                  label="URL Format"
                  placeholder="Select URL Format"
                  {...form.getInputProps('options.slugFormat')}
                  data={[
                    { value: '', label: 'Select URL Format' },
                    {
                      value: 'date-id',
                      label: `Date-ID (/${
                        form.values?.slug || 'name'
                      }/yyyy-mm-dd-id)`
                    },
                    {
                      value: 'date-title',
                      label: `Date-Title (/${
                        form.values?.slug || form.values?.name || 'name'
                      }/yyyy-mm-dd-title)`
                    },
                    {
                      value: 'id',
                      label: `ID (/${
                        form.values?.slug || form.values?.name || 'name'
                      }/id)`
                    },
                    {
                      value: 'id-title',
                      label: `ID-Title (/${
                        form.values?.slug || form.values?.name || 'name'
                      }/id-title)`
                    },
                    {
                      value: 'title',
                      label: `Title (/${
                        form.values?.slug || form.values?.name || 'name'
                      }/title)`
                    },
                    {
                      value: 'title-id',
                      label: `Title-ID (/${
                        form.values?.slug || form.values?.name || 'name'
                      }/title-id)`
                    }
                  ]}
                />
                <Select
                  label="Article Type Status"
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
            </form>
          </Card.Section>
          <Card.Section>
            <pre>{JSON.stringify(form.values, null, 2)}</pre>
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default ArticleTypeEditor;
