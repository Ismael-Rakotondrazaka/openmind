import { count } from "./count";
import { createOne } from "./createOne";
import { exist } from "./exist";
import { findFullMany } from "./findFullMany";
import { findFullOne } from "./findFullOne";
import { findOne } from "./findOne";
import { findOneOrThrow } from "./findOneOrThrow";
import { updateFullOne } from "./updateFullOne";
import { updateOne } from "./updateOne";

export const userRepository = Object.freeze({
  findFullMany,
  createOne,
  updateOne,
  findOne,
  count,
  exist,
  findOneOrThrow,
  updateFullOne,
  findFullOne,
});
