import type { EventHandlerRequest, H3Event } from 'h3';

import {
  type useTranslation as IUseTranslation,
  useTranslation,
} from '@intlify/h3';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Type instantiation is excessively deep and possibly infinite.
type TranslationFunction = Awaited<ReturnType<typeof IUseTranslation>>;
// @ts-check

export class Translator {
  readonly t: TranslationFunction;

  private constructor(t_: TranslationFunction) {
    this.t = t_;
  }

  public static async new(
    event: H3Event<EventHandlerRequest>
  ): Promise<Translator> {
    const t = await useTranslation(event);

    return new Translator(t);
  }
}
