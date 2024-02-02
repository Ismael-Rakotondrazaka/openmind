import { findFullMany } from "./findFullMany";
import { findFullOne } from "./findFullOne";
import { createFullOne } from "./createFullOne";
import { createOne } from "./createOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { findOne } from "./findOne";
import { count } from "./count";
import { exist } from "./exist";
import { deleteOne } from "./deleteOne";

export const savedArticleRepository = Object.freeze({
  findFullMany,
  findFullOne,
  createFullOne,
  createOne,
  findFullOneOrThrow,
  findOne,
  count,
  exist,
  deleteOne,
});
