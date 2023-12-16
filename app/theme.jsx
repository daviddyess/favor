import { useState } from 'react';
import { ThemeContext } from '~/hooks/useTheme';
import { theme as defaultTheme } from '~/modules/config.server';
import { Theme, Pages } from '@/favor';

export function ThemeProvider({ children, defaultPage = 'Page' }) {
  const [theme, setTheme] = useState(defaultTheme);
  const [page, setPage] = useState(defaultPage);
  const Page =
    page !== defaultPage ? Theme[page] : Theme[Pages?.root ?? defaultPage];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, page, setPage }}>
      <Page>{children}</Page>
    </ThemeContext.Provider>
  );
}
