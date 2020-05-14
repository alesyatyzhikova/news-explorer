import countDubl from './countDubl';

export default function sortArray(array) {
  let newArray = countDubl(array)
  let finalArray = Object.keys(newArray).map(i => ({
    keyword: i,
    count: newArray[i],
  })).sort((a, b) => b.count - a.count);

  return finalArray;
}