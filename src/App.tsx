import React, { useState, useRef, useCallback, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

type IDataAndRecovery = {
  data: any,
  recovery: (data: any) => void
}[]


function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

function useStateCollect(dataAndRecovery: IDataAndRecovery) {
  const flag = useRef(false)
  const type = useRef<'func' | 'effect'>('func')
  const prevDataAndRecovery = usePrevious(dataAndRecovery)
  useEffect(() => {
    if (flag.current) {
      (type.current === 'func' ? prevDataAndRecovery : dataAndRecovery)!.forEach(({ data, recovery }) => {
        recovery(data)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })
  flag.current = false;
  return useCallback((propsType: 'func' | 'effect') => {
    flag.current = true
    type.current = propsType
  }, [])
}

function App() {
  const [arr, setArr] = useState<{ a: number }[]>([{ a: 0 }])
  const [test, setTest] = useState(0)
  useEffect(() => {
    try {
      const a = arr[10].a
    } catch {
      recap('effect')
      alert('be careful! error!')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr])
  useEffect(() => {
    try {
      if (arr.length > 0) {
        setTest((test) => test + 1)
      }
    } catch {
      recap('effect')
      alert('be careful! error!')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr.length])
  const click = useCallback(() => {
    try {
      setArr((arr) => [...arr, { a: arr.length }])
    } catch {
      recap('func')
      alert('be careful! error!')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // useEffect在最后的时刻进行
  const recap = useStateCollect([{ data: arr, recovery: setArr }, { data: test, recovery: setTest }])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={click}>click me</button>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
