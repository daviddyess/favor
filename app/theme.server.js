import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { theme as defaultTheme } from '~/modules/config.server';

const __base = fileURLToPath(new URL('./', import.meta.url));
const __root = dirname(`${__base}`);
const __dirname = '/app';

export function TplLookup({ theme = defaultTheme, nameSpace, component }) {
  if (
    existsSync(
      join(
        __root,
        __dirname,
        `/themes/${theme}/components${nameSpace ? `/${nameSpace}` : ''}${
          component ? `/${component}` : ''
        }.tsx`
      )
    )
  ) {
    console.log('in theme inTheme: true');
    console.log(
      existsSync(
        join(
          __root,
          __dirname,
          `/themes/${theme}/components${nameSpace ? `/${nameSpace}` : ''}${
            component ? `/${component}` : ''
          }.tsx`
        )
      )
    );
    return {
      inTheme: true,
      theme,
      component: `${nameSpace ? nameSpace : ''}${
        component ? `/${component}` : ''
      }`,
      path: `app/themes/${theme}/components${nameSpace ? `/${nameSpace}` : ''}${
        component ? `/${component}` : ''
      }`
    };
  } else if (
    existsSync(
      join(
        __root,
        __dirname,
        `/components${nameSpace ? `/${nameSpace}` : ''}${
          component ? `/${component}` : ''
        }.tsx`
      )
    )
  ) {
    console.log('not in theme');
    return {
      inTheme: false,
      component: `${nameSpace ? nameSpace : ''}${
        component ? `/${component}` : ''
      }`,
      path: `~/components${nameSpace ? `/${nameSpace}` : ''}${
        component ? `/${component}` : ''
      }`
    };
  } else {
    console.log('Template not found');
  }
}
