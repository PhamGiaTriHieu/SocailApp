import moment from 'moment';

const TIME_FORMAT = 'MMM D';

export const getCreateAt = (time: string) => {
  return moment(time).format(TIME_FORMAT);
};
