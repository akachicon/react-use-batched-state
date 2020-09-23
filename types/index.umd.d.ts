import * as React from 'react';

type ExportType = <S = undefined>(
  initValue: S | (() => S)
) => [S, React.Dispatch<React.SetStateAction<S>>];

declare const useBatchedState: ExportType;

declare module 'react' {
  export const useBatchedState: ExportType;
}

export = useBatchedState;
