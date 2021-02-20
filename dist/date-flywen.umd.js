(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dateFlywen = {}));
}(this, (function (exports) { 'use strict';

  const getYear = (date, w) => {
    [date, w] = helperOverload(date, w);
    return helperPadZero(date.getFullYear().toString(), w);
  };

  const getMonth = (date, w) => {
    [date, w] = helperOverload(date, w);
    return helperPadZero((date.getMonth() + 1).toString(), w);
  };

  const getDate = (date, w) => {
    [date, w] = helperOverload(date, w);
    return helperPadZero(date.getDate().toString(), w);
  };

  const getHours = (date, w) => {
    [date, w] = helperOverload(date, w);
    return helperPadZero(date.getHours().toString(), w);
  };

  const getMinutes = (date, w) => {
    [date, w] = helperOverload(date, w);
    return helperPadZero(date.getMinutes().toString(), w);
  };

  const getSeconds = (date, w) => {
    [date, w] = helperOverload(date, w);
    return helperPadZero(date.getSeconds().toString(), w);
  };

  const getMilliSeconds = (date, w) => {
    [date, w] = helperOverload(date, w);
    return helperPadZero(date.getMilliseconds().toString(), w);

  };

  const getTimeZone = (date) => {
    date = date || new Date();
    let timeZone = date.getTimezoneOffset(),
      zone = Math.abs(timeZone / 60),
      offset = timeZone % 60;
    zone = helperPadZero(zone.toString(), 2);
    offset = helperPadZero(offset.toString(), 2);
    return timeZone < 0 ? "+" + zone + offset : "-" + zone + offset;
  };

  const helperOverload = (date, w) => {
    if(typeof date === "number") {
      w = date;
      date = new Date();
    }  return [ date, w ];
  };

  const helperPadZero = (str, w) => {
    w = w || str.length;
    for(let i = 0; i < w; i++) {
      str = "0" + str;
    }
    let reg = new RegExp(`(.{${w}})$`);
    return reg.exec(str)[1];
  };

  const DEFAULT_PATTERN = "yyyy-MM-dd hh:mm:ss";
  function format(pattern, date) {
    if(typeof pattern == "object") {
      date = pattern;
      pattern = DEFAULT_PATTERN;
    }
    if(typeof pattern == "undefined") {
      date = new Date();
      pattern = DEFAULT_PATTERN;
    }
    if(date == null) {
      date = new Date();
    }
    return pattern
      .replace(/yyyy/, getYear(date))
      .replace(/yy/, getYear(date, 2))
      .replace(/MM/, getMonth(date, 2))
      .replace(/M/, getMonth(date))
      .replace(/dd/, getDate(date, 2))
      .replace(/d/, getDate(date))
      .replace(/hh/, getHours(date, 2))
      .replace(/h/, getHours(date))
      .replace(/mm/, getMinutes(date, 2))
      .replace(/m/, getMinutes(date))
      .replace(/ss/, getSeconds(date, 2))
      .replace(/s/, getSeconds(date))
      .replace(/SS/, getMilliSeconds(date,4))
      .replace(/S/, getMilliSeconds(date))
      .replace(/O/, getTimeZone(date));
  }

  function setDatePart(date, parts, value, local) {
    date[`set${parts}`](value);
  }
  function buildRegexp(pattern) {
    pattern.indexOf("O") > -1;
    let matches = [
      {
        pattern: /y{1,4}/,
        regexp: "\\d{1,4}",
        fn: (date, value) => {
          setDatePart(date, "FullYear", value);
        }
      },
      {
        pattern: /M{1,2}/,
        regexp: "\\d{1,2}",
        fn: (date, value) => {
          setDatePart(date, "Month", value - 1);
        }
      },
      {
        pattern: /(?<!\\)(d{1,2})/,
        regexp: "\\d{1,2}",
        fn: (date, value) => {
          setDatePart(date, "Date", value);
        }
      },
      {
        pattern: /h{1,2}/,
        regexp: "\\d{1,2}",
        fn: (date, value) => {
          setDatePart(date, "Hours", value);
        }
      },
      {
        pattern: /m{1,2}/,
        regexp: "\\d{1,2}",
        fn: (date, value) => {
          setDatePart(date, "Minutes", value);
        }
      },
      {
        pattern: /s{1,2}/,
        regexp: "\\d{1,2}",
        fn: (date, value) => {
          setDatePart(date, "Seconds", value);
        }
      },
      {
        pattern: /S{1,2}/,
        regexp: "\\d{1,4}",
        fn: (date, value) => {
          setDatePart(date, "Milliseconds", value);
        }
      },
      {
        pattern: /O/,
        regexp: "[+-]\\d{4}",
        fn: (date, value) => {
          setDatePart(date, "Month", value);
        }
      }
    ];
    let regexp = matches.reduce((prev, next) => {
      if(next.pattern.test(prev.pattern)) {
        next.index = prev.pattern.match(next.pattern).index;
        prev.pattern = prev.pattern.replace(next.pattern, "(" + next.regexp + ")");
      } else {
        next.index = -1;
      }
      return prev;
    }, {pattern, index: []});
    matches = matches.filter(m => m.index > -1);
    return [regexp, matches];
  }

  const now = new Date();
  function parse(pattern, str) {
    if(!pattern) {
      throw new Error("pattern is undefined");
    }
    if(!str) {
      throw new Error("str is undefined");
    }
    pattern.indexOf("O") > -1;
    let [regex, matches] = buildRegexp(pattern),
      parts = str.match(new RegExp(regex.pattern));
    matches.forEach((match,index) => {
      match.fn(now, parts[index + 1]);
    });
    return now;
  }

  exports.format = format;
  exports.parse = parse;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
