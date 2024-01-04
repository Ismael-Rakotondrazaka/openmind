import dayjs from "dayjs";
import UtcPlugin from "dayjs/plugin/utc.js";
import UpdateLocalPlugin from "dayjs/plugin/updateLocale.js";
import DurationPlugin from "dayjs/plugin/duration.js";
import RelativeTimePlugin from "dayjs/plugin/relativeTime.js";

dayjs.locale("en");
dayjs.extend(RelativeTimePlugin);
dayjs.extend(UtcPlugin);
dayjs.extend(UpdateLocalPlugin);
dayjs.extend(DurationPlugin);

export const useDayjs = (): typeof dayjs => dayjs;
