export const aws = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION || "us-east-1",
  bucket: process.env.AWS_S3_BUCKET,
  baseUrl: `https://${process.env.AWS_S3_BUCKET}.s3-${
    process.env.AWS_DEFAULT_REGION || "us-east-1"
  }.amazonaws.com/`,
};

export const db = {
  url: process.env.ARANGO_URL,
  databaseName: process.env.ARANGO_DB,
  auth: { username: process.env.ARANGO_USER, password: process.env.ARANGO_PW },
  devData: process.env.DEV_DATA,
};

export const linode = {
  accessKeyId: process.env?.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env?.AWS_SECRET_ACCESS_KEY,
  region: process.env?.AWS_DEFAULT_REGION || "us-southeast-1",
  bucket: process.env?.AWS_S3_BUCKET,
  baseUrl: `https://${process.env?.AWS_S3_BUCKET}.${
    process.env?.AWS_DEFAULT_REGION || "us-southeast-1"
  }.linodeobjects.com/`,
  endpoint: `https://${
    process.env?.AWS_DEFAULT_REGION || "us-southeast-1"
  }.linodeobjects.com/`,
};

export const mail = {
  smtp: {
    host: process.env?.SMTP_HOST,
    port: process.env?.SMTP_PORT ? Number(process.env?.SMTP_PORT) : 465,
    secure: process.env?.SMTP_SECURE || false,
    auth: {
      user: process.env?.SMTP_USER,
      pass: process.env?.SMTP_PASSWORD,
    },
  },
  noReply: process.env?.MAIL_NO_REPLY,
  support: process.env?.MAIL_SUPPORT,
};

export const s3Provider = process.env?.S3_PROVIDER ?? "linode";

export const s3Providers = { aws, linode };

export const storageURL = s3Providers[s3Provider]?.baseUrl;

export const avatarURL = `${storageURL}avatars/`;

export const session = {
  name: process.env.SESSION_NAME,
  domain: process.env.SESSION_DOMAIN,
  httpOnly: true,
  maxAge: Number(process.env.SESSION_TTL),
  path: "/",
  sameSite: "lax",
  secrets: process.env?.SESSION_SECRET
    ? [process.env.SESSION_SECRET]
    : ["qa4rjmdc9owsyhedolfvjmsxhn!*@ijmsx"],
  secure: true,
};

export const theme = process.env.THEME;

export default {
  session,
  aws,
  db,
  linode,
  s3Provider,
  s3Providers,
  storageURL,
  avatarURL,
  theme,
};