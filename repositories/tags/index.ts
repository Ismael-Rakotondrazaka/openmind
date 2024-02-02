import { findOne } from "./findOne";
import { count } from "./count";
import { exist } from "./exist";
import { deleteOne } from "./deleteOne";
import { createOne } from "./createOne";
import { findMany } from "./findMany";

export const tagRepository = Object.freeze({
  findOne,
  count,
  exist,
  deleteOne,
  findMany,
  createOne,
});
