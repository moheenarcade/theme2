import React, { useState, useEffect, useRef } from 'react';
import './multidigit.css';
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";


const TOTAL_SECONDS = 24 * 60 * 60;

const MultiDigitClock = () => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [colonVisible, setColonVisible] = useState(true);
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();


  const blockData = [
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1], // 0
    [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1], // 1
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1], // 2
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1], // 3
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1], // 4
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // 5
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1], // 6
    [1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1], // 7
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 8
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1]  // 9
  ];

  // Setup countdown timer with localStorage persistence
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

    const updateTimer = () => {
      const now = Date.now();
      let diff = Math.floor((endTime - now) / 1000);

      if (diff <= 0) {
        endTime = initializeEndTime();
        diff = TOTAL_SECONDS;
      }

      setTimeLeft(diff);
      setColonVisible(prev => !prev);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secondsLeft) => {
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    return { hours, minutes, seconds };
  };

  const splitNumber = (num, digits) => {
    const str = num.toString().padStart(digits, '0');
    return str.split('').map(Number);
  };

  const renderDigitBlock = (number, index) => {
    if (number >= 10) {
      return (
        <div className="block_bg" key={index}>
          <div className="block" style={{ left: '2.2vw', top: '2.2vw', opacity: number === 11 ? 1 : 0 }} />
          <div className="block" style={{ left: '2.2vw', top: '6.6vw', opacity: number === 11 ? 1 : 0 }} />
        </div>
      );
    }

    return (
      <div className="block_bg" key={index}>
        {blockData[number].map((visible, i) => (
          <div key={i} className="block" style={{ opacity: visible ? 1 : 0 }} />
        ))}
      </div>
    );
  };

  const getDisplayDigits = () => {
    const { hours, minutes, seconds } = formatTime(timeLeft);
    const digits = [];

    // Hardcoded day "01"
    digits.push(0, 1); // 0 and 1 for "01"

    // Optional colon or separator between day and time
    digits.push(colonVisible ? 11 : 10);

    const hourDigits = splitNumber(hours, 2);
    const minuteDigits = splitNumber(minutes, 2);
    const secondDigits = splitNumber(seconds, 2);

    digits.push(...hourDigits);
    digits.push(colonVisible ? 11 : 10);
    digits.push(...minuteDigits);
    digits.push(colonVisible ? 11 : 10);
    digits.push(...secondDigits);

    return digits;
  };


  return (
    <>
      <div className="multi-digit-clock md:absolute md:top-[-18px] lg:top-[-22px] xl:top-[-45px] md:right-[-130px] lg:right-[-300px] xl:right-[-444px] 2xl:right-[-500px]">
        <div className="container-clock" ref={containerRef}>
          {getDisplayDigits().map((digit, index) => renderDigitBlock(digit, index))}
        </div>
      </div>
      <div className={`label-clock text-white font-[300] ${language === 'ar' ? "gap-[25px]" : "gap-[15px]"} md:gap-[40px] lg:gap-[18px] xl:gap-[35px] 2xl:gap-[46px] pt-3 flex justify-center items-center mx-auto md:relative top-[35px] md:top-[21px] lg:top-[35px right-[-40px] lg:right-[-108px] xl:right-[-54px] 2xl:right-[-52px]`}>
        <p className='text-[10px] relative left-1'>{t("Days")}</p>
        <p className='text-[10px] relative left-2'>{t('Hours')}</p>
        <p className='text-[10px] relative left-2'>{t('Minutes')}</p>
        <p className='text-[10px]'>{t("Seconds")}</p>
      </div>
    </>
  );
};

export default MultiDigitClock;
