const sortTag = (a, b) => {
  let i = 0;
  while (i !== 3) {
    if (a[i] < b[i]) {
      return -1;
    }
    if (a[i] > b[i]) {
      return 1;
    }
    if (a[i] === b[i]) {
      i++;
    }
  }
  return 0;
};

exports.sortGitTags = function(tags) {
  if (!tags || tags.length == 0) {
    return [];
  }

  // '0.0.1' => [0,0,1]
  const tags$ = tags.slice().map(str => str.split(".").map(n => +n));
  //小版本在前
  tags$.sort(sortTag);

  return tags$.map(arr => arr.join("."));
};
