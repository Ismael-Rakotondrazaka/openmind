import { count } from "./count";
import { createFullOne } from "./createFullOne";
import { createOne } from "./createOne";
import { exist } from "./exist";
import { findFullMany } from "./findFullMany";
import { findFullOne } from "./findFullOne";
import { findFullOneOrThrow } from "./findFullOneOrThrow";
import { findOne } from "./findOne";
import { updateFullOne } from "./updateFullOne";
import { updateOne } from "./updateOne";

export const commentRepository = {
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
};
