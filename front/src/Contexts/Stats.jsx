import { createContext, useEffect, useState } from "react";
import useServerGet from "../Hooks/useServerGet";
import * as l from "../Constants/urls";

export const StatsContext = createContext();

export const Stats = ({ children }) => {
  const { doAction: doGet, response: serverGetResponse } = useServerGet(
    l.SITE_GET_STATS
  );

  const [stats, setStats] = useState(null);

  useEffect(() => {
    doGet();
  }, [doGet]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }

    setStats(serverGetResponse.data ?? null);
  }, [serverGetResponse]);

  return (
    <StatsContext.Provider
      value={{
        stats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
