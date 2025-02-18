/**
 * import dayjs from 'extended-dayjs' instead of 'dayjs' directly to ensure that extension will work correctly.
 */

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export { default } from 'dayjs'
