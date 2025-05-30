// 'use client';
// import React, { useEffect } from 'react';
// import './clock.css';

// const digitSegments = [
//   [1, 2, 3, 4, 5, 6],
//   [2, 3],
//   [1, 2, 7, 5, 4],
//   [1, 2, 7, 3, 4],
//   [6, 7, 2, 3],
//   [1, 6, 7, 3, 4],
//   [1, 6, 5, 4, 3, 7],
//   [1, 2, 3],
//   [1, 2, 3, 4, 5, 6, 7],
//   [1, 2, 7, 3, 6]
// ];

// const setNumber = (digit, number) => {
//   const segments = digit.querySelectorAll('.segment');
//   const current = parseInt(digit.getAttribute('data-value'));

//   if (!isNaN(current) && current !== number) {
//     digitSegments[current]?.forEach((s, i) => {
//       setTimeout(() => segments[s - 1].classList.remove('on'), i * 45);
//     });
//   }

//   if (isNaN(current) || current !== number) {
//     setTimeout(() => {
//       digitSegments[number].forEach((s, i) => {
//         setTimeout(() => segments[s - 1].classList.add('on'), i * 45);
//       });
//     }, 250);
//     digit.setAttribute('data-value', number);
//   }
// };

// const DigitalNumberClock = ({ targetTime }) => {
//   useEffect(() => {
//     const hours = document.querySelectorAll('.hours');
//     const minutes = document.querySelectorAll('.minutes');
//     const seconds = document.querySelectorAll('.seconds');

//     const updateClock = () => {
//       const now = new Date();
//       const diff = Math.max(0, targetTime - now);
//       const totalSeconds = Math.floor(diff / 1000);

//       const h = Math.floor(totalSeconds / 3600);
//       const m = Math.floor((totalSeconds % 3600) / 60);
//       const s = totalSeconds % 60;

//       setNumber(hours[0], Math.floor(h / 10));
//       setNumber(hours[1], h % 10);
//       setNumber(minutes[0], Math.floor(m / 10));
//       setNumber(minutes[1], m % 10);
//       setNumber(seconds[0], Math.floor(s / 10));
//       setNumber(seconds[1], s % 10);
//     };

//     updateClock();
//     const interval = setInterval(updateClock, 1000);

//     return () => clearInterval(interval);
//   }, [targetTime]);

//   const renderDigit = (type) =>
//     [0, 1].map((_, idx) => (
//       <div key={idx} className={`digit ${type}`} data-value="-1">
//         {Array.from({ length: 7 }, (_, i) => (
//           <div key={i} className="segment"></div>
//         ))}
//       </div>
//     ));
    

//   return (
//     <div className="clock">
//       {renderDigit('hours')}
//       <div className="separator"></div>
//       {renderDigit('minutes')}
//       <div className="separator"></div>
//       {renderDigit('seconds')}
//     </div>
//   );
// };

// export default DigitalNumberClock;



'use client';
import React, { useEffect, useState } from 'react';
import './clock.css';

const digitSegments = [
  [1, 2, 3, 4, 5, 6],
  [2, 3],
  [1, 2, 7, 5, 4],
  [1, 2, 7, 3, 4],
  [6, 7, 2, 3],
  [1, 6, 7, 3, 4],
  [1, 6, 5, 4, 3, 7],
  [1, 2, 3],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 7, 3, 6]
];

const TOTAL_SECONDS = 12 * 60 * 60;

const setNumber = (digit, number) => {
  const segments = digit.querySelectorAll('.segment');
  const current = parseInt(digit.getAttribute('data-value'));

  if (!isNaN(current) && current !== number) {
    digitSegments[current]?.forEach((s, i) => {
      setTimeout(() => segments[s - 1].classList.remove('on'), i * 45);
    });
  }

  if (isNaN(current) || current !== number) {
    setTimeout(() => {
      digitSegments[number].forEach((s, i) => {
        setTimeout(() => segments[s - 1].classList.add('on'), i * 45);
      });
    }, 250);
    digit.setAttribute('data-value', number);
  }
};

const DigitalNumberClock = () => {
  const [targetTime, setTargetTime] = useState(0);

  useEffect(() => {
    const initializeEndTime = () => {
      const newEndTime = Date.now() + TOTAL_SECONDS * 1000;
      localStorage.setItem('countdownEndTime', newEndTime.toString());
      return newEndTime;
    };

    let endTime = parseInt(localStorage.getItem('countdownEndTime') || '', 10);
    if (!endTime || isNaN(endTime)) {
      endTime = initializeEndTime();
    }
    
    setTargetTime(endTime);
  }, []);

  useEffect(() => {
    if (!targetTime) return;

    const hours = document.querySelectorAll('.hours');
    const minutes = document.querySelectorAll('.minutes');
    const seconds = document.querySelectorAll('.seconds');

    const updateClock = () => {
      const now = new Date();
      let diff = Math.floor((targetTime - now) / 1000);

      if (diff <= 0) {
        const newEndTime = Date.now() + TOTAL_SECONDS * 1000;
        localStorage.setItem('countdownEndTime', newEndTime.toString());
        setTargetTime(newEndTime);
        diff = TOTAL_SECONDS;
      }

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      setNumber(hours[0], Math.floor(h / 10));
      setNumber(hours[1], h % 10);
      setNumber(minutes[0], Math.floor(m / 10));
      setNumber(minutes[1], m % 10);
      setNumber(seconds[0], Math.floor(s / 10));
      setNumber(seconds[1], s % 10);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const renderDigit = (type) =>
    [0, 1].map((_, idx) => (
      <div key={idx} className={`digit ${type}`} data-value="-1">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="segment"></div>
        ))}
      </div>
    ));

  return (
    <div className="clock">
      {renderDigit('hours')}
      <div className="separator"></div>
      {renderDigit('minutes')}
      <div className="separator"></div>
      {renderDigit('seconds')}
    </div>
  );
};

export default DigitalNumberClock;