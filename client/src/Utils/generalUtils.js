export const strToDate = (dateStr) =>
{
const [dateValues, timeValues] = dateStr.split(' ');
/* console.log(dateValues); // 👉️ "09/24/2022"
console.log(timeValues); // 👉️ "07:30:14" */

const [month, day, year] = dateValues.split('/');
const [hours, minutes] = timeValues.split(':');
const seconds =0
const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);

//  👇️️ Sat Sep 24 2022 07:30:14
//console.log(date);
return date
}

