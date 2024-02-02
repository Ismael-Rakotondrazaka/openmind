import { findFullMany } from "./findFullMany";
import { findFullOne } from "./findFullOne";
import { createFullOne } from "./createFullOne";
import { createOne } from "./createOne";
import { updateFullOne } from "./updateFullOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { updateOne } from "./updateOne";
import { findOne } from "./findOne";
import { count } from "./count";
import { exist } from "./exist";
import { deleteOne } from "./deleteOne";

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
