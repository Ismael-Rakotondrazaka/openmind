import { createOne } from "./createOne";
import { findOne } from "./findOne";
import { findFullOne } from "./findFullOne";
import { deleteOne } from "./deleteOne";

export const activationTokenRepository = Object.freeze({
  findFullOne,
  findOne,
  deleteOne,
  createOne,
});
