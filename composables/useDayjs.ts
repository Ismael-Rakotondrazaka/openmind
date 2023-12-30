import dayjs from "dayjs";
import RelativeTimePlugin from "dayjs/plugin/relativeTime";
import UtcPlugin from "dayjs/plugin/utc";
import UpdateLocalPlugin from "dayjs/plugin/updateLocale";
import DurationPlugin from "dayjs/plugin/duration";

dayjs.locale("en");
dayjs.extend(RelativeTimePlugin);
dayjs.extend(UtcPlugin);
dayjs.extend(UpdateLocalPlugin);
dayjs.extend(DurationPlugin);

export const useDayjs = (): typeof dayjs => dayjs;
