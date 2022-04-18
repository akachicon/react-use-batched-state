# Deprecation note
Since react 18 state updates are batched automatically. Thus, use of this module only makes sense if you use react < 18.

# react-use-batched-state
A hook that allows for batched updates in react.

## Install
```
npm i react-use-batched-state
```
There are umd and es versions if you need.

## Usage
Use it instead of ```React.useState``` wherever you need to batch updates 
(see the [example](#solution)). Typescript support is available.
**This package requires Promise to be available globally**, it is not bundled 
as it's very much likely you already have one.

## Motivation
In certain cases (generally, in effects) state updates initiated by 
```React.useState``` setters are not batched, which leads to rerender for each 
setter call. Consider the following example:
```jsx
import React, { useState, useCallback } from 'react';

export default function BatchedUpdateTest() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  console.log(`render: a = ${a}, b = ${b}`);

  const setUpdate = useCallback(function setUpdate() {
    setTimeout(
      function (x) {
        setA(x);
        setB(x)
      },
      500,
      Math.random()
    );
  }, []);

  return (
    <button onClick={setUpdate}>set update</button>
  );
}
```

If we click on the button, we will see the console prints next two lines:
```
render: a = 0.8447694095332172, b = 0
render: a = 0.8447694095332172, b = 0.8447694095332172
```

## Solution
```react-use-batched-state``` supposed to solve the problem. You can use it 
in place of ```React.useState``` wherever you want updates to batch:
```jsx
import React, { useCallback } from 'react';
import useBatchedState from 'react-use-batched-state';

export default function BatchedUpdateTest() {
  const [a, setA] = useBatchedState(0);
  const [b, setB] = useBatchedState(0);

  console.log(`render: a = ${a}, b = ${b}`);

  const setUpdate = useCallback(function setUpdate() {
    setTimeout(
      function (x) {
        setA(x);
        setB(x)
      },
      500,
      Math.random()
    );
  }, []);

  return (
    <button onClick={setUpdate}>set update</button>
  );
}
```

If we click the button now, the output would be
```
render: a = 0.8447694095332172, b = 0.8447694095332172
```

## How it works
Internally it uses ```unstable_batchedUpdates``` from ```react-dom``` (which is 
not so [unstable](https://github.com/facebook/react/commit/b41883fc708cd24d77dcaa767cde814b50b457fe#commitcomment-35546595)).

## Requirements
This package requires ```Promise``` to be available globally, it is not bundled as 
it's very much likely you already have one.