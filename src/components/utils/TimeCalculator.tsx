import { useEffect, useState } from 'react';

export default function TimeCalculator(startDate: number, duration: number) {
  const [isTime, setIsTime] = useState<string>('none');

  const startTime = startDate;
  const [currentTime, setIsCurrentTime] = useState<any>(Date.now());
  const finishTime = startDate + duration * 60000;

  const daysBefore = Math.floor((startTime - currentTime) / 86400000);
  const hoursBefore = Math.floor((startTime - currentTime - daysBefore * 86400000) / 3600000);
  const minutesBefore = Math.floor((startTime - currentTime - daysBefore * 86400000 - hoursBefore * 3600000) / 60000);
  const secondsBefore = Math.floor(
    (startTime - currentTime - daysBefore * 86400000 - hoursBefore * 3600000 - minutesBefore * 60000) / 1000,
  );

  const hoursCurrent = Math.floor((finishTime - currentTime) / 3600000);
  const minutesCurrent = Math.floor((finishTime - currentTime - hoursCurrent * 3600000) / 60000);
  const secondsCurrent = Math.floor(
    (finishTime - currentTime - hoursCurrent * 3600000 - minutesCurrent * 60000) / 1000,
  );

  useEffect(() => {
    const clock = setInterval(() => {
      setIsCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (currentTime < startTime) {
      setIsTime('before');
    } else if (currentTime >= startTime && currentTime <= finishTime) {
      setIsTime('running');
    } else if (currentTime > finishTime) {
      setIsTime('after');
    }
  });

  const result = {
    isTime,
    beforeTime: {
      days: daysBefore,
      hours: hoursBefore,
      minutes: minutesBefore,
      seconds: secondsBefore,
    },
    remainingTime: {
      hours: hoursCurrent,
      minutes: minutesCurrent,
      seconds: secondsCurrent,
    },
  };

  return result;
}
