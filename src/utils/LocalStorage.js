export const setLocalStorageItem = (key, value) => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      console.warn("LocalStorage is not accessible in this environment.");
    }
  } catch (error) {
    console.error("Error setting localStorage item:", error);
  }
};

export const getLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    const value = window.localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.warn(`Unable to parse the value for key "${key}":`, error);
        return value; // Return the raw string if it's not JSON.
      }
    }
    return null;
  }
  return null;
};

export const removeLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  }
};
