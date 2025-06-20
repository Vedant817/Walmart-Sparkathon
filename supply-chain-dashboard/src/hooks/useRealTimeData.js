import { useState, useEffect } from 'react';

export const useRealTimeData = (initialData, updateInterval = 5000) => {
  const [data, setData] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data updates
      setData(prevData => {
        return prevData.map(item => {
          // Randomly update some metrics
          if (Math.random() > 0.8) {
            const randomChange = (Math.random() - 0.5) * 0.1; // ±5% change
            const currentValue = parseFloat(item.value.replace(/[^0-9.]/g, ''));
            
            if (!isNaN(currentValue)) {
              const newValue = Math.max(0, currentValue * (1 + randomChange));
              const formattedValue = item.value.includes('%') 
                ? `${newValue.toFixed(1)}%`
                : item.value.includes('$')
                ? `$${newValue.toFixed(1)}M`
                : Math.round(newValue).toString();
              
              return {
                ...item,
                value: formattedValue
              };
            }
          }
          return item;
        });
      });
      setLastUpdated(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return { data, lastUpdated };
};
