export const useReactionPreviewText = (payload: {
  authReaction: MaybeRefOrGetter<ReactionFull | null>;
  otherReactionsExtract: MaybeRefOrGetter<ReactionFull[]>;
  count: MaybeRefOrGetter<number>;
}) => {
  const text = computed<string>(() => {
    const getFullName = (user: User): string =>
      `${user.firstName} ${user.name}`;

    let result = "";

    const authReaction = toValue(payload.authReaction);
    const otherReactionsExtract = toValue(payload.otherReactionsExtract);
    const count = toValue(payload.count);

    if (count > 0) {
      if (authReaction === null) {
        if (otherReactionsExtract.length === 1) {
          result = getFullName(otherReactionsExtract[0].user);
        } else {
          result = `${getFullName(otherReactionsExtract[0].user)} and ${toNumericAbbreviation(count - 1)} others`;
        }
      } else if (authReaction !== null) {
        if (otherReactionsExtract.length === 0) {
          result = "You";
        } else if (otherReactionsExtract.length === 1) {
          result = `You, ${getFullName(otherReactionsExtract[0].user)}`;
        } else {
          result = `You, ${getFullName(otherReactionsExtract[0].user)} and ${toNumericAbbreviation(count - 2)} others`;
        }
      }
    }

    return result;
  });

  return text;
};
