import {
  getBreakpointValue,
  Paper,
  Tabs,
  useMantineTheme
} from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import type { SetStateAction } from 'react';
import { useState } from 'react';
import ArticleEditor from '~/components/Article/Editor';
import type { ArticleType } from '~/interfaces/ArticleType';

let types: { name: SetStateAction<string | null> }[] = [];

export default function Editor({
  refetch,
  articleTypes
}: {
  refetch: Function;
  articleTypes: ArticleType[];
}) {
  const { width } = useViewportSize();
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<string | null>('');
  const currentBreakpoint = getBreakpointValue(theme.breakpoints.md, theme);
  const breakpoint = Boolean(width >= currentBreakpoint);

  if (articleTypes) {
    articleTypes?.map((articleType: ArticleType) =>
      types.push({ name: articleType?.name })
    );
  }
  const ArticleTypeTabsList = () => {
    return (
      <>
        {articleTypes &&
          articleTypes?.map((articleType: ArticleType) => (
            <Tabs.Tab
              key={articleType.name}
              value={articleType.name}
              onClick={() => setActiveTab(articleType.name)}
            >
              {articleType.title}
            </Tabs.Tab>
          ))}
      </>
    );
  };

  return (
    <>
      {articleTypes ? (
        <Tabs
          keepMounted={false}
          value={activeTab}
          variant="outline"
          orientation={breakpoint ? 'vertical' : 'horizontal'}
          defaultValue="start"
        >
          <Tabs.List>
            <ArticleTypeTabsList />
          </Tabs.List>
          {!activeTab ? (
            <Paper p={10}>Choose a Content Type to Begin</Paper>
          ) : null}

          {articleTypes?.map((articleType: ArticleType) => (
            <Tabs.Panel key={articleType.name} value={articleType.name}>
              <Paper px={breakpoint ? 10 : 0} py={breakpoint ? 0 : 10}>
                <ArticleEditor
                  articleType={articleType}
                  closeEditor={setActiveTab}
                  refetch={refetch}
                />
              </Paper>
            </Tabs.Panel>
          ))}
        </Tabs>
      ) : null}
    </>
  );
}
