function createRandomColor() {
  let randomNumber = Math.random();
  if (randomNumber < 0.1) randomNumber += 0.1;
  return "#" + Math.floor(randomNumber * 16777215).toString(16);
}

function CreateRandomAvatarName(name, type) {
  if (type === "user") {
    return name.slice(0, 1).toUpperCase();
  }
  if (type === "group") {
    return name.slice(0, 2).toUpperCase();
  }
}

module.exports = {
  createRandomColor,
  CreateRandomAvatarName,
};
