import { findFullMany } from "./findFullMany";
import { createOne } from "./createOne";
import { updateOne } from "./updateOne";
import { findOne } from "./findOne";
import { count } from "./count";
import { exist } from "./exist";

export const userRepository = Object.freeze({
  findFullMany,
  createOne,
  updateOne,
  findOne,
  count,
  exist,
});
