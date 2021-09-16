export const nextWeekday = (weekday): string => {
  switch (weekday) {
    case "MON":
      return "TUE";
    case "TUE":
      return "WED";
    case "WED":
      return "THU";
    case "THU":
      return "FRI";
    case "FRI":
      return "SAT";
    case "SAT":
      return "MON";
    default:
      break;
  }
};
