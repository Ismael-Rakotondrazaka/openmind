import { z } from "zod";
import { zu } from "zod_utilz/index";

export default defineNuxtPlugin(() => {
  const dayjs = useDayjs();

  z.setErrorMap(
    zu.makeErrorMap({
      required: (context) =>
        `This field is required, expect a ${context.expected}, received a ${context.received}`,
      too_small: (ctx) => {
        if (ctx.message !== undefined) {
          return ctx.message;
        } else {
          const map: Record<
            z.ZodTooSmallIssue["type"],
            Record<"exact" | "inclusive" | "not_inclusive", string>
          > = {
            array: {
              exact: `Must contain exactly {{minimum}} element(s), given ${ctx.data.length} element(s)`,
              inclusive: `Must contain at least {{minimum}} element(s), given ${ctx.data.length} element(s)`,
              not_inclusive: `Must contain more than {{minimum}} element(s), given ${ctx.data.length} element(s)`,
            },
            string: {
              exact: `Must contain exactly {{minimum}} character(s), given ${ctx.data.length} character(s)`,
              inclusive: `Must contain at least {{minimum}} character(s), given ${ctx.data.length} character(s)`,
              not_inclusive: `Must contain over {{minimum}} character(s), given ${ctx.data.length} character(s)`,
            },
            number: {
              exact: `Must be exactly {{minimum}}, given ${ctx.data}`,
              inclusive: `Must be greater than or equal to {{minimum}}, given ${ctx.data}`,
              not_inclusive: `Must be greater than {{minimum}}, given ${ctx.data}`,
            },
            set: {
              exact: "Invalid input",
              inclusive: "Invalid input",
              not_inclusive: "Invalid input",
            },
            bigint: {
              exact: `Must be exactly {{minimum}}, given ${(ctx.data as bigint).toString()}`,
              inclusive: `Must be greater than or equal to {{minimum}}, given ${(ctx.data as bigint).toString()}`,
              not_inclusive: `Must be greater than {{minimum}}, given ${(ctx.data as bigint).toString()}`,
            },
            date: {
              exact: "Must be exactly {{- minimum, datetime}}",
              inclusive: "Must be after or equal to {{- minimum, datetime}}",
              not_inclusive: "Must be after {{- minimum, datetime}}",
            },
          };

          let raw: string = "";
          if (ctx.exact == true) {
            raw = map[ctx.type].exact;
          } else if (ctx.inclusive) {
            raw = map[ctx.type].inclusive;
          } else {
            raw = map[ctx.type].not_inclusive;
          }

          if (ctx.type == "date") {
            const a = dayjs(new Date(ctx.minimum as number));
            raw = raw.replaceAll("{{- minimum, datetime}}", a.format("LL"));
          } else {
            raw = raw.replaceAll("{{minimum}}", `${ctx.minimum}`);
          }

          return raw;
        }
      },
      too_big: (ctx) => {
        const map: Record<
          z.ZodTooBigIssue["type"],
          Record<"exact" | "inclusive" | "not_inclusive", string>
        > = {
          array: {
            exact: `Must contain exactly {{maximum}} element(s), given ${(ctx.data as unknown[]).length} element(s)`,
            inclusive: `Must contain at most {{maximum}} element(s), given ${(ctx.data as unknown[]).length} element(s)`,
            not_inclusive: `Must contain less than {{maximum}} element(s), given ${(ctx.data as unknown[]).length} element(s)`,
          },
          string: {
            exact: `Must contain exactly {{maximum}} character(s), given ${(ctx.data as string).length} character(s)`,
            inclusive: `Must contain at most {{maximum}} character(s), given ${(ctx.data as string).length} character(s)`,
            not_inclusive: `Must contain under {{maximum}} character(s), given ${(ctx.data as string).length} character(s)`,
          },
          number: {
            exact: `Must be exactly {{maximum}}, given ${ctx.data}`,
            inclusive: `Must be less than or equal to {{maximum}}, given ${ctx.data}`,
            not_inclusive: `Must be less than {{maximum}}, given ${ctx.data}`,
          },
          bigint: {
            exact: `Must be exactly {{maximum}}, given ${(ctx.data as bigint).toString()}`,
            inclusive: `Must be less than or equal to {{maximum}}, given ${(ctx.data as bigint).toString()}`,
            not_inclusive: `Must be less than {{maximum}}, given ${(ctx.data as bigint).toString()}`,
          },
          set: {
            exact: "Invalid input",
            inclusive: "Invalid input",
            not_inclusive: "Invalid input",
          },
          date: {
            exact: "Must be exactly {{- maximum, datetime}}",
            inclusive: "Must be before or equal to {{- maximum, datetime}}",
            not_inclusive: "Must be before {{- maximum, datetime}}",
          },
        };

        let raw: string = "";
        if (ctx.exact == true) {
          raw = map[ctx.type].exact;
        } else if (ctx.inclusive) {
          raw = map[ctx.type].inclusive;
        } else {
          raw = map[ctx.type].not_inclusive;
        }

        if (ctx.type == "date") {
          const a = dayjs(new Date(ctx.maximum as number));
          raw = raw.replaceAll("{{- maximum, datetime}}", a.format("LL"));
        } else {
          raw = raw.replaceAll("{{maximum}}", `${ctx.maximum}`);
        }

        return raw;
      },
    }),
  );
});
