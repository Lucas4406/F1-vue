export function isItemInSessionStorage(key) {
    if (sessionStorage.getItem(key) === null) {
      return false;
    }
    return true;
}
  