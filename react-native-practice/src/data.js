import { useState, useEffect } from "react";

// Custom hook: returns `value` only after it has stopped changing for `delay` ms.
export function useDebounce(val, delay) {
  const [debounceVal, setDebounceVal] = useState(val);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceVal(val);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [val, delay]);
  return debounceVal;
}

// Generated large dataset (256 items) so pagination / infinite scroll is meaningful.
// FlatList wants each item to have a stable key, so we use objects with an id.
const FRUIT_NAMES = [
  "Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry",
  "Cherry", "Coconut", "Cranberry", "Date", "Dragonfruit", "Fig",
  "Grape", "Grapefruit", "Guava", "Kiwi", "Lemon", "Lime",
  "Mango", "Melon", "Nectarine", "Orange", "Papaya", "Peach",
  "Pear", "Pineapple", "Plum", "Pomegranate", "Raspberry",
  "Strawberry", "Tangerine", "Watermelon",
];
const ADJECTIVES = ["Organic", "Fresh", "Wild", "Sweet", "Golden", "Ripe", "Frozen", "Dried"];

export const FRUITS = FRUIT_NAMES.flatMap((name, i) =>
  ADJECTIVES.map((adj, j) => {
    const id = i * ADJECTIVES.length + j + 1;
    return { id, name: `${adj} ${name} #${id}` };
  })
);
// -> 32 fruits x 8 adjectives = 256 unique items.

// Fake "send message" network call for the chat scenario.
// Resolves after ~800ms, but randomly rejects ~30% of the time so you can
// practice the failure / retry path of optimistic updates.
export function fakeSendMessage(text) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error("Network error"));
      } else {
        resolve({ id: `srv-${Date.now()}`, text, at: Date.now() });
      }
    }, 800);
  });
}
