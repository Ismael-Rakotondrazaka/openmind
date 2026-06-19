import type { Request } from '#shared/requests/request';
import type { ResponseError } from '#shared/responses/response';
import type { ComposerTranslation } from 'vue-i18n';

import { FetchError } from 'ofetch';
import { toast } from 'vue-sonner';

import { translateResponseErrorData } from './translate-response-error-data';

const getMessageParamsFromErrorData = (
  data: Record<string, unknown>
): Record<string, number | string> => {
  for (const value of Object.values(data)) {
    if (
      Array.isArray(value) &&
      value.length >= 1 &&
      typeof value[0] === 'string'
    ) {
      return (value[1] as Record<string, number | string> | undefined) ?? {};
    }
  }

  return {};
};

export const isFetchErrorWithResponseError = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Data extends Request<any, any, any, any>,
>(
  error: unknown
): error is FetchError<ResponseError<Data>> => {
  return (
    error instanceof FetchError &&
    typeof error === 'object' &&
    error !== null &&
    'data' in error
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleFetchError = <TRequest extends Request<any, any, any, any>>(
  error: unknown,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: ComposerTranslation<Record<string, unknown>, any>,
  // message: ReturnType<typeof useMessage>,
  setErrors?: (
    errors: Record<
      keyof ResponseErrorData<TRequest['input']['body']>,
      string | string[] | undefined
    >
  ) => void
): boolean => {
  if (isFetchErrorWithResponseError<TRequest>(error) && error.data) {
    toast.error(
      t(
        error.data.message,
        getMessageParamsFromErrorData(
          error.data.data as Record<string, unknown>
        )
      )
    );

    if (setErrors) {
      setErrors(translateResponseErrorData(t, error.data.data));
    }

    return true;
  }

  toast.error(t('errors.default'));
  return false;
};
