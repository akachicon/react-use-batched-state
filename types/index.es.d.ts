import * as React from 'react';

declare const useBatchedState: <S = undefined>(
  initValue: S | (() => S)
) => [S, React.Dispatch<React.SetStateAction<S>>];

export default useBatchedState;
