import { count } from "./count";
import { createFullOne } from "./createFullOne";
import { createOne } from "./createOne";
import { deleteOne } from "./deleteOne";
import { exist } from "./exist";
import { findFullMany } from "./findFullMany";
import { findFullOne } from "./findFullOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { findOne } from "./findOne";
import { updateFullOne } from "./updateFullOne";
import { updateOne } from "./updateOne";

export const viewRepository = Object.freeze({
  findFullMany,
  findFullOne,
  createFullOne,
  updateFullOne,
  createOne,
  findFullOneOrThrow,
  updateOne,
  findOne,
  count,
  exist,
  deleteOne,
});
