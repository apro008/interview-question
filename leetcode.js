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

'use strict';

// ----------------------------------------------------------------------------
// Tiny test helpers — no dependencies.
// ----------------------------------------------------------------------------

// const nums = [2,7,11,15]

var twoSum = function(nums, target) {
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
    console.log('seen', seen, `need`, need, `seen[need]`, seen[need])
    if (seen[need] !== undefined) {
      return [seen[need], i]
    }

    seen[nums[i]] = i
    
  }
  return `not found`
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

const nums = [1, 1, 1, 1, 2]
var removeDuplicates = function(nums) {
    const unique = [...new Set(nums)];
  console.log('unique', unique)
    for (let i = 0; i < unique.length; i++) {
        nums[i] = unique[i];
    }

    return unique.length;
};

console.log(removeDuplicates(nums));

console.log('nums', nums)
