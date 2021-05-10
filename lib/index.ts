import { useCallback, useState } from 'react';
import { unstable_batchedUpdates as batch } from 'react-dom';

type UpdateRecord = [(value: any) => void, unknown];
type UpdateRecordList = UpdateRecord[];

const updates: { list: UpdateRecordList } = { list: [] };
let updatePromise: Promise<void> | null = null;

function pushUpdate(updateRecord: UpdateRecord): void {
  updates.list.push(updateRecord);
}

function flushUpdates(): void {
  updates.list = [];
}

function getUpdates() {
  return updates.list;
}

const scheduleBatchUpdate = () => {
  if (updatePromise) return;

  updatePromise = Promise.resolve();

  void updatePromise.then(() => {
    batch(() => {
      const updates = getUpdates();

      for (let it = 0; it < updates.length; it++) {
        const [setter, val] = updates[it];
        setter(val);
      }
    });
    flushUpdates();
    updatePromise = null;
  });
};

const useBatchedState = <S = undefined>(initValue: S | (() => S)) => {
  const stateHookRes = useState<S>(initValue);
  const setter = stateHookRes[1];

  const batchSetter = useCallback(
    (value: S | ((prevState: S) => S)) => {
      const setterUpdate: UpdateRecord = [setter, value];

      pushUpdate(setterUpdate);
      scheduleBatchUpdate();
    },
    [setter]
  );

  stateHookRes[1] = batchSetter;

  return stateHookRes;
};

const exportedHook = typeof window === 'undefined' ? useState : useBatchedState;

export default exportedHook;
