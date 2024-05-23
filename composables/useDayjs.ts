import dayjs from "dayjs";
import DurationPlugin from "dayjs/plugin/duration.js";
import RelativeTimePlugin from "dayjs/plugin/relativeTime.js";
import UpdateLocalPlugin from "dayjs/plugin/updateLocale.js";
import UtcPlugin from "dayjs/plugin/utc.js";

dayjs.locale("en");
dayjs.extend(RelativeTimePlugin);
dayjs.extend(UtcPlugin);
dayjs.extend(UpdateLocalPlugin);
dayjs.extend(DurationPlugin);

export const useDayjs = (): typeof dayjs => dayjs;
