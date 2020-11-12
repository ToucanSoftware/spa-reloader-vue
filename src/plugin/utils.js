/**
 * Check is an argument is a function.
 * @param {*} functionToCheck
 */
export function IsFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

/**
 * Check if an argument is a URL.
 * @param {*} s
 */
export function IsURL(s) {
  if (!s) return false;
  // var pattern = new RegExp(
  //   "/(ftp|http|https|ws|wss)://(w+:{0,1}w*@)?(S+)(:[0-9]+)?(/|/([w#!:.?+=&%@!-/]))?/"
  // );
  // return !!pattern.test(s);
  return true;
}

/**
 * Check is the browser has localstorage.
 */
export function IsLocalStorageAvailable() {
  var test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
