export const getUniqueNumber = (string1, string2) => {
  const number1 = string1.split(",");
  const number2 = string2.split(",");
  const allNumbers = [...number1, ...number2];
  const uniqueNumbers = allNumbers.filter(
    (item, index) => allNumbers.indexOf(item) === index
  );
  return uniqueNumbers;
};
