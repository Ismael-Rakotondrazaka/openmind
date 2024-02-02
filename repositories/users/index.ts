import { findFullMany } from "./findFullMany";
import { createOne } from "./createOne";
import { updateOne } from "./updateOne";
import { findOne } from "./findOne";
import { count } from "./count";
import { exist } from "./exist";
import { findFullOne } from "./findFullOne";
import { updateFullOne } from "./updateFullOne";
import { findOneOrThrow } from "./findOneOrThrow";

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
