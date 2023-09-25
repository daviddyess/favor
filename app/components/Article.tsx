import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Group,
  Text,
  useMantineTheme
} from '@mantine/core';
import { IconHeart, IconBookmark, IconShare } from '@tabler/icons-react';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';
import classes from '~/styles/Article.module.css';

interface ArticleCardProps {
  image?: string;
  category?: string;
  createdAt?: string;
  title: string;
  text: object;
  footer?: string;
  author: {
    name: string;
    description: string;
    image: string;
  };
  updatedAt?: string;
}

export default function ArticleCard({
  data: {
    image = '',
    category = '',
    createdAt = '',
    text = {},
    title = '',
    footer = '',
    author,
    updatedAt = ''
  }
}: {
  data: ArticleCardProps;
}) {
  const theme = useMantineTheme();

  return (
    <Card withBorder mb={6} radius="md" className={classes.card}>
      <Card.Section p={3}>
        <Group justify="space-between">
          <Group gap={0} p={4}>
            <Badge radius="md" size="md">
              {category}
            </Badge>
          </Group>
          <Group gap={0}>
            <TimeSince timestamp={createdAt} pr={4} />
          </Group>
        </Group>
      </Card.Section>
      {title ? (
        <Text fw={700} className={classes.title}>
          {title}
        </Text>
      ) : null}

      <HTMLContent content={text} />

      {footer ? (
        <Group mt="xs">
          <Text size="xs" color="dimmed">
            {footer}
          </Text>
        </Group>
      ) : null}

      <Card.Section className={classes.footer}>
        <Group align="apart">
          <Group gap={0}>
            <Avatar src={author.image} radius="sm" />
            <div>
              <Text size="sm" fw={500} pl={3}>
                {author.name}
              </Text>
              <Text size="xs" color="dimmed" pl={3}>
                {author.description}
              </Text>
            </div>
          </Group>
          <Group gap={0}>
            <ActionIcon>
              <IconHeart size={22} color={theme.colors.red[6]} stroke={1.5} />
            </ActionIcon>
            <ActionIcon>
              <IconBookmark
                size={22}
                color={theme.colors.yellow[6]}
                stroke={1.5}
              />
            </ActionIcon>
            <ActionIcon>
              <IconShare size={22} color={theme.colors.blue[6]} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
}
