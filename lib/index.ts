import { useCallback, useState } from 'react';
import { unstable_batchedUpdates as batch } from 'react-dom';
import type { Dispatch, SetStateAction } from 'react';

type UpdateRecord = [(value: any) => void, unknown];
type UpdateRecordList = UpdateRecord[];

let updates: UpdateRecordList = [];
let updatePromise: Promise<void> | null = null;

const scheduleBatchUpdate = (updateRecord: UpdateRecord) => {
  updates.push(updateRecord);

  if (updatePromise) return;

  updatePromise = Promise.resolve();

  void updatePromise.then(() => {
    batch(() => {
      for (let it = 0; it < updates.length; it++) {
        const [setter, val] = updates[it];
        setter(val);
      }
    });
    updates = [];
    updatePromise = null;
  });
};

const useBatchedState = <S = undefined>(initValue: S | (() => S)) => {
  const stateHookRes = useState<S>(initValue);
  const setter = stateHookRes[1];

  const batchSetter = useCallback<Dispatch<SetStateAction<S>>>(
    (value) => {
      const setterUpdate: UpdateRecord = [setter, value];
      scheduleBatchUpdate(setterUpdate);
    },
    [setter]
  );

  stateHookRes[1] = batchSetter;

  return stateHookRes;
};

const exportedHook = typeof window === 'undefined' ? useState : useBatchedState;

export default exportedHook;
