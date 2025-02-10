import { useEffect } from 'react';
import AppKey from './adrop_service.json';
import './App.css';

const App = () => {
  useEffect(() => {
    adrop.initialize(AppKey.app_key);
  }, []);

  return (
    <>
      <h1 className="text-red-600">Hello World</h1>
    </>
  );
};

export default App;
