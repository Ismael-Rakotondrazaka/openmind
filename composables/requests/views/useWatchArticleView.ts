export const useWatchArticleView = (payload: {
  articleId: MaybeRefOrGetter<string>;
  view: MaybeRefOrGetter<View | null>;
  // eslint-disable-next-line no-unused-vars
  onViewCreated: (view: ViewFull) => void;
  // eslint-disable-next-line no-unused-vars
  onViewUpdated: (view: ViewFull) => void;
}) => {
  const { viewFull: createdViewFull, execute: executeStoreView } =
    useStoreArticleView({
      body: () => ({
        articleId: toValue(payload.articleId),
      }),
    });

  const { viewFull: updatedViewFull, execute: executeUpdateView } =
    useUpdateArticleView({
      viewId: () => toValue(payload.view)?.id ?? -1,
    });

  const createView = async () => {
    await executeStoreView();

    if (createdViewFull.value !== null) {
      payload.onViewCreated(createdViewFull.value);
    }
  };

  const updateView = async () => {
    await executeUpdateView();

    if (updatedViewFull.value !== null) {
      payload.onViewUpdated(updatedViewFull.value);
    }
  };

  const MIN_READ_DURATION: number = 10 * 1000; // 10s

  const isRead = ref<boolean>(false);

  const handleWatch = async () => {
    if (toValue(payload.view) !== null) {
      await updateView();
    } else {
      await createView();
    }
  };

  const { start: startViewTimeout, stop: stopViewTimeout } = useTimeoutFn(
    async () => {
      isRead.value = true;
      await handleWatch();
    },
    MIN_READ_DURATION,
    {
      immediate: false,
    },
  );

  onMounted(() => {
    isRead.value = false;
    startViewTimeout();
  });

  onBeforeUnmount(() => {
    stopViewTimeout();

    if (isRead.value) {
      // when leaving the page, we update the view to the latest
      handleWatch();
    }
  });
};
