export default function countDubl(array) {
  let newArray = array.reduce((result, item) => {
    if(result[item.keyword] === undefined) {
      result[item.keyword] = 0;
    }
    result[item.keyword]++;
    return result;
  }, {});
  return newArray;
}