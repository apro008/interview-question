/**
 * LeetCode Practice Scratchpad
 * ----------------------------
 * Run:        node leetcode.js
 * Watch:      node --watch leetcode.js        (re-runs on save)
 * Debug:      node inspect leetcode.js         (CLI debugger)
 *             or VS Code: F5 with a Node launch config / "Run and Debug"
 *             Drop a `debugger;` statement anywhere and run `node inspect`.
 *
 * Workflow: write your solution, register test cases, hit save.
 */

"use strict";

// ----------------------------------------------------------------------------
// Tiny test helpers — no dependencies.
// ----------------------------------------------------------------------------

// const nums = [2,7,11,15]

var twoSum = function (nums, target) {
	// for (let i = 0; i < nums.length; i++){
	//   for (let j = i + 1; j < nums.length; j++) {
	//     if (nums[i] + nums[j] === target) {
	//       return [i , j]
	//     }
	//     return `not found`
	//   }
	// }
	const seen = {};
	for (let i = 0; i < nums.length; i++) {
		const need = target - nums[i];
		console.log("seen", seen, `need`, need, `seen[need]`, seen[need]);
		if (seen[need] !== undefined) {
			return [seen[need], i];
		}

		seen[nums[i]] = i;
	}
	return `not found`;
};

// console.log(twoSum(nums, 9));

// const strs = ["flower","flow","flight"]
// // Output: "fl"

// function commonString(str) {
//   str.forEach(element => {
//     // console.log('element', element);
//     for (let i = 0; i < element.length; i++) {
//       const el = element[i];
//       console.log('el', el)
//     }
//   });
// }

// commonString(strs)

const nums = [1, 1, 1, 1, 2, 3];
var removeDuplicates = function (nums) {
	const unique = [...new Set(nums)];
	console.log("unique", unique);
	for (let i = 0; i < unique.length; i++) {
		nums[i] = unique[i];
	}

	return unique.length;
};

// console.log(removeDuplicates(nums));

// console.log('nums', nums)

// nums = [0,0,1,1,1,2,2,3,3,4]
// Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
function removeDuplicate(nums) {
	const newArr = [...new Set(nums)];

	for (let i = 0; i < nums.length; i++) {
		nums[i] = newArr[i];
	}
	return newArr.length;
}

console.log(removeDuplicate(nums));

// Closour//

function testClosure() {
	let count = 0;

	return function increment() {
		count++;
		console.log(count);
	};
}

const incre = testClosure();
incre();
incre();

function multiply(a) {
	return function (b) {
		return function (c) {
			a * b * c;
		};
	};
}

function debounce(fn, delay) {
	let timer;

	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn(args);
		}, delay);
	};
}

const search = (text = "hi") => {
	// console.log('text', text)
};

function cache(fn) {
	const map = new Map();

	return function (...arghs) {
		const key = JSON.stringify(arghs);

		if (map.has(key)) {
			console.log("cache val");

			return map.get(key);
		}

		const result = fn(...arghs);

		map.set(key, result);
		return result;
	};
}

function sum(a, b) {
	return a + b;
}

const cacheVal = cache(sum);

// console.log('cacheVal', cacheVal(2, 2))
// console.log('cacheVal', cacheVal(2, 2));

function outer() {
	let counter = 0;

	return function () {
		count++;
	};
}

const counter = outer();

const promise = new Promise((resolve, reject) => {
	const success = true;

	if (success) {
		resolve(console.log("resolve"));
	} else {
		reject(console.log("reject"));
	}
});

//bubble sort []2,34,5,35 , compare 0,1 th then swap if need then 1,2 etc

const arr = [2, 3, 43, 535, 2];

const arrLen = arr.length;

function bubbleSort(params) {
	for (let i = 0; i < arrLen - 1; i++) {
		for (let j = 0; j < arrLen - i - 1; j++) {
			if (arr[j] > arr[j + 1]) {
				[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
			}
		}
	}
	return arr
}


console.log('bubbleSort', bubbleSort(arr))


const arr1 = [2, 3, 43, 535, 2];

function twoSumNew(arr, target) {

	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++){
			if (arr[i] + arr[j] === target) {
				return [i, j]
			}
		}
	}
		
	
	
}

console.log('twoSumNew', twoSumNew(arr1, 5))