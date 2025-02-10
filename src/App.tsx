import { useCallback, useEffect, useMemo, useState } from 'react';
import AppKey from './adrop_service.json';
import './App.css';
import { Banner } from './types';

const App = () => {
  const [ad, setAd] = useState<Banner>();

  useEffect(() => {
    adrop.initialize(AppKey.app_key);
  }, []);

  const banner = useMemo(() => ad?.ad ?? '', [ad]);

  const request = useCallback(async (unitId: string) => {
    return await adrop.request(unitId);
  }, []);

  const requestBanner = useCallback(async () => {
    setAd(await request('PUBLIC_TEST_UNIT_ID_375_80'));
  }, [request]);

  return (
    <>
      <div className="flex flex-col space-2 gap-4 p-8">
        <h1 className="text-red-600">OpenRhapSody</h1>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
          onClick={requestBanner}
        >
          Request Banner
        </button>

        <h2>Banner</h2>
        <div dangerouslySetInnerHTML={{ __html: banner }} />
      </div>
    </>
  );
};

export default App;
