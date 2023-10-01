import { randomUUID } from 'crypto';
import { getLogger } from 'logade';
import md5 from 'md5';
import { sanitize } from '~/modules/stringSanitizer';

const log = getLogger('Utils Module');
/**
 * AWS Storage URL
 */

export const awsServer = `https://${process.env.AWS_S3_BUCKET}.s3-${process.env.AWS_DEFAULT_REGION}.amazonaws.com/`;
/**
 * Get IP Address from Request
 * @param {} req
 * @returns
 */
export function getIpAddress(req) {
  try {
    return (
      (req.headers?.['x-forwarded-for'] || '').split(',').pop().trim() ||
      req?.socket?.remoteAddress
    );
  } catch (err) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * Generate Identifier from Request
 * @param {*} req
 * @returns
 */
export function getRequestIdentifier(req) {
  try {
    return md5(`${getIpAddress(req)} + ${req?.headers?.['user-agent']}`);
  } catch (err) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * Current Time Stamp
 * @returns Date String
 */
export const timeStamp = () => {
  try {
    const date = new Date(Date.now());

    return date.toISOString();
  } catch (err) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
};

/**
 * Future Time Stamp
 */
export const futureTime = ({ hours }) => {
  try {
    const date = new Date(Date.now() + hours * 60 * 60 * 1000);

    return date.toISOString();
  } catch (err) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
};

/**
 * Random Number Generator
 * @param {number} length
 * @param {boolean} str
 * @returns number || string
 */
export const randomNumber = (length, str = false) => {
  try {
    let min = '1';

    let max = '9';

    let i = 1;

    while (i < length) {
      min += '0';
      max += '0';
      i++;
    }
    const rand = Math.floor(Number(min) + Math.random() * Number(max));

    if (str) {
      return `${rand}`;
    } else {
      return rand;
    }
  } catch (err) {
    log.error(err.message);
  }
};

/**
 * Slug Generator
 *
 * Generate URL safe string
 * @param {*} options
 * @returns string
 */
export const formatSlug = ({
  format = 'title',
  date = timeStamp(),
  divider = 'addDash',
  id = null,
  lowerCase = true,
  space = 'addUnderscore',
  title = sanitize[space]('no title')
}) => {
  try {
    let url, year, monthDate, dateDate, mmDate, ddDate;

    if (format === 'date-id' || format === 'date-title') {
      const dateObject = new Date(date);

      year = dateObject.getFullYear();
      monthDate = dateObject.getMonth() + 1;
      dateDate = dateObject.getDate();
      mmDate = monthDate >= 10 ? monthDate : `0${monthDate}`;
      ddDate = dateDate >= 10 ? dateDate : `0${dateDate}`;
    }

    switch (format) {
      case 'date-id':
        url = sanitize[divider](`${year} ${mmDate}$ ${ddDate} `) + `${id}`;
        break;
      case 'date-title':
        url =
          sanitize[divider](`${year} ${mmDate} ${ddDate} `) +
          sanitize[space](title);
        break;
      case 'id':
        url = `${id}`;
        break;
      case 'id-title':
        url = sanitize[divider](`${id} `) + sanitize[space](title);
        break;
      case 'title':
        url = sanitize[space](title);
        break;
      case 'title-id':
        url = sanitize[space](title) + sanitize[divider](` ${id}`);
        break;
      default:
        url = sanitize[space](title) + sanitize[divider](` ${id}`);
        break;
    }
    return lowerCase ? url.toLowerCase() : url;
  } catch (err) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
};
/**
 * Generate UUID
 * @returns string
 */
export const uuid = () => {
  return randomUUID();
};
/**
 * Strip HTML Tags
 * @param {string} value
 * @returns string
 */
export const stripTags = (value) => {
  return value.replace(/(<([^>]+)>)/gi, '');
};
