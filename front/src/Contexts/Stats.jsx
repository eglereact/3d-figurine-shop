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
    const fetchStats = async () => {
      doGet();
    };

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [doGet]);

  useEffect(() => {
    if (null === serverGetResponse) {
      return;
    }

    if (serverGetResponse.data) {
      setStats(serverGetResponse.data);
    } else {
    }
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
