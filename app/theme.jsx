
import { useState } from "react";
import { ThemeContext } from "~/hooks/useTheme";
import { theme as defaultTheme } from '~/modules/config.server';
import { Theme } from '@/favor';

export function ThemeProvider({ children }) {

  const [theme, setTheme] = useState(defaultTheme);
  const [page, setPage] = useState('Page');
  const Page = Theme[page];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, page, setPage }}>
     <Page>{ children }</Page>
    </ThemeContext.Provider>
  );
}
