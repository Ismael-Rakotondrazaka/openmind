import { createOne } from "./createOne";
import { deleteOne } from "./deleteOne";
import { findFullOne } from "./findFullOne";
import { findOne } from "./findOne";

export const activationTokenRepository = Object.freeze({
  findFullOne,
  findOne,
  deleteOne,
  createOne,
});
