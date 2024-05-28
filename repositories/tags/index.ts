import { count } from "./count";
import { createOne } from "./createOne";
import { deleteOne } from "./deleteOne";
import { exist } from "./exist";
import { findMany } from "./findMany";
import { findOne } from "./findOne";

export const tagRepository = Object.freeze({
  findOne,
  count,
  exist,
  deleteOne,
  findMany,
  createOne,
});
