import { Box, Tooltip } from '@mantine/core';
import { format as dateFormat, formatDistanceToNow, parseISO } from 'date-fns';

interface DateTimeProps {
  format?: string;
  timestamp: string;
  className?: string;
  fz?: string;
  pl?: number;
  pr?: number;
  pt?: number;
  pb?: number;
  p?: number;
}

export default function DateTime({
  timestamp,
  format = 'yyy-MM-dd h:mm aaa',
  className,
  fz = 'xs',
  ...others
}: DateTimeProps) {
  const str = dateFormat(parseISO(timestamp), format);
  return (
    <Box className={className} fz={fz} {...others}>
      {str}
    </Box>
  );
}

export function Date({
  timestamp,
  format = 'yyy-MM-dd',
  className,
  fz = 'xs',
  ...others
}: DateTimeProps) {
  const str = dateFormat(parseISO(timestamp), format);
  return (
    <Box className={className} fz={fz} {...others}>
      {str}
    </Box>
  );
}

export function Time({
  timestamp,
  format = 'h:mm aaa',
  className,
  fz = 'xs',
  ...others
}: DateTimeProps) {
  const str = dateFormat(parseISO(timestamp), format);
  return (
    <Box className={className} fz={fz} {...others}>
      {str}
    </Box>
  );
}

export function TimeSince({
  timestamp,
  className,
  fz = 'xs',
  ...others
}: DateTimeProps) {
  const str = formatDistanceToNow(parseISO(timestamp));
  return (
    <Tooltip
      inline
      label={<DateTime timestamp={timestamp} />}
      position="left"
      withArrow
    >
      <Box className={className} fz={fz} {...others}>
        {str} ago
      </Box>
    </Tooltip>
  );
}
