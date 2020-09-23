import { useState } from 'react';
import { unstable_batchedUpdates as batch } from 'react-dom';

type UpdateRecord = [(value: any) => void, unknown];
type UpdateRecordList = UpdateRecord[];

let updates: UpdateRecordList = [];
let updatePromise: Promise<void> | null = null;

const scheduleBatchUpdate = () => {
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

  function batchSetter(value: S | ((prevState: S) => S)) {
    const setterUpdate: UpdateRecord = [setter, value];

    updates.push(setterUpdate);
    scheduleBatchUpdate();
  }

  stateHookRes[1] = batchSetter;

  return stateHookRes;
};

const exportedHook = window === undefined ? useState : useBatchedState;

export default exportedHook;
