import moment from "moment";

/**
 * https://momentjs.com/docs/#/durations/humanize/
 * @param dateString {string}
 * @return {string}  ͌ "A day ago 👻"
 */
export const humanizeDateString = (dateString: string): string => {
    return moment(dateString).fromNow();
};

/**
 * https://momentjs.com/docs/#/displaying/format/
 * @param dateString {string}
 * @return {string}  ͌ "Sunday, February 14th 2010, 3:25 pm"
 */
export const formatDateString = (dateString: string): string => {
    return moment().format("dddd, MMMM Do YYYY, h:mm a")
};
