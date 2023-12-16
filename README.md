# Favor CMS

Favor is in a pre-alpha state, it isn't functional enough for production use yet. I will begin tagging versions with alpha (0.1) and will begin using Favor for my person blog with beta (0.5). Most React SSR applications are built for a single purpose, for a single client. Favor is intended to be more of a content management system that can be deployed and built upon with content, rather than boiler plate, while providing room for developers to build standalone themes for customization.

Favor CMS is a Server-Side React application, built with Remix 2.x and Mantine 7.x, featuring:

- Articles application, supporting multiple Article Types for dynamic content publishing
- Block Groups and Block Types (not fully functional)
- Multiple Theme support and configuration
- ArangoDB database backend, with automated database migrations
- Remix running as ESM

Planned Features:

- Role-based permissions
- Data-driven layouts
- Inline layout editing (with blocks)
- Multi-user content publishing
- Social integrations
- Tags
- Categories
- and more (placeholder for things I forgot to mention)

Requirements:

- Node.js 18+ (20.x used in development)
- ArangoDB 3.3+ (3.10.x used in development)

Development and testing is only done on Linux, no other OS support is guaranteed. Pull Requests are welcome if someone would like to provide support.

- [Remix Docs](https://remix.run/docs)
- [Mantine Docs](https://mantine.dev/getting-started/)
- [ArangoDB Docs](https://docs.arangodb.com/3.10/about-arangodb/)
- [arangojs Docs](https://arangodb.github.io/arangojs/latest/modules/_index_.html)

## Development

### Database Migrations

#### Latest Migration

```sh
npm run migrate
```

#### Rollback to a Previous Migration

```sh
npm run migrate 2
```

### Start in Development mode

From your terminal:

```sh
npm run dev
```

This starts Favor in development mode, rebuilding assets on file changes.

## Deployment

First, build Favor for production:

```sh
npm run build
```

Then run Favor in production mode:

```sh
npm start
```

Migrations run automatically with `npm start`, but not with `npm run dev`

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
