import countDubl from './countDubl';

export default function sortArray(array) {
  const newArray = countDubl(array)
  const finalArray = Object.keys(newArray).map(i => ({
    keyword: i,
    count: newArray[i],
  })).sort((a, b) => b.count - a.count);

  return finalArray;
}