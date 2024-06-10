import { enUS } from "date-fns/locale";
import format from "date-fns/format";

export const dateFormat = ({ date }) => {
  const language = enUS;

  const formatedDate = {
    day: format(new Date(date), "dd"),
    month: format(new Date(date), "LL"),
    year: format(new Date(date), "yyyy"),
    hour: format(new Date(date), "h"),
    minute: format(new Date(date), "mm"),
    hourFormat: format(new Date(date), "aaa", { locale: language }),
  };

  return `${formatedDate.year}-${formatedDate.month}-${formatedDate.day} ${formatedDate.hour}:${formatedDate.minute} ${formatedDate.hourFormat}`;
};

export const getFormattedDate = (date, dateFormat) => {
  if (date) {
    return format(new Date(date), dateFormat);
  } else {
    return "-";
  }
};
