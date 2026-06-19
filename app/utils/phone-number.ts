import { parsePhoneNumberWithError } from 'libphonenumber-js';
import { z } from 'zod';

export const PhoneNumberSchema = z.string().transform((value, ctx) => {
  const invalidIssueData: z.IssueData = {
    code: z.ZodIssueCode.custom,
  };

  try {
    const result = parsePhoneNumberWithError(value, {
      defaultCountry: 'FR',
    });

    if (result.isValid() === false) {
      ctx.addIssue(invalidIssueData);

      return z.NEVER;
    }

    return result.formatInternational();
  } catch {
    ctx.addIssue(invalidIssueData);

    return z.NEVER;
  }
});
