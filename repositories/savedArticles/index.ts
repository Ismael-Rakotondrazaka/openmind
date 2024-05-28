import { count } from "./count";
import { createFullOne } from "./createFullOne";
import { createOne } from "./createOne";
import { deleteOne } from "./deleteOne";
import { exist } from "./exist";
import { findFullMany } from "./findFullMany";
import { findFullOne } from "./findFullOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { findOne } from "./findOne";

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
