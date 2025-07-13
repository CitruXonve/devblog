---
title: Post-interview DS&A Coding Insights in 2025
tags:
  - Interview
  - Python
abbrlink: 33dd1419
date: 2025-07-12 13:22:52
---

The questions below will be in a reverse-chronological order as they appeared in the interviews.

## Simulated Calculator in String Processing

### Calculator V1 - [LC 224. Basic Calculator (Hard)](https://leetcode.com/problems/basic-calculator/)

Essentially, merely `+-` arithmetic operations and parenthesis (nested possible) need to be supported.

#### Concise & efficient Solution after refactoring

Upon second thought, it appears that stack operations are need only when destructing parenthesis and processing the `+-` operators (see also other shared solutions on LeetCode).
<!--more-->
```python
class Solution:
    def calculate(self, s: str) -> int:
        res, num, sign = 0, 0, 1
        stack = [1] # + by default

        for ch in s:
            if ch.isdigit():
                num = num * 10 + int(ch)
            elif ch == '(': # construct
                stack.append(sign)
            elif ch == ')': # destruct
                stack.pop()
            elif ch in set('+-'):
                res += sign * num
                # decide current sign based on parenthesis
                sign = (1 if ch == '+' else -1) * stack[-1]
                num = 0 # reset
        
        return res + sign * num  # remaining number
```

#### Intuitive Solution

It's easier to come up with, but results in many edge cases to be taken care of, still likely ending up in `TLE` on LeetCode.
```python
class Solution:
    def process_add_sub(self, nums, ops) -> int:
        if not len(nums):
            return 0
        res = nums[0]
        # for idx, op in enumerate(ops, start=1):
        for idx in range(1, len(ops) + 1):
            if idx >= len(nums):
                break
            op = ops[idx - 1]
            # print(f"process_add_sub {idx}:", (op, nums[idx]))
            res += -nums[idx] if op == '-' else nums[idx]
        return res

    def locate_last(self, elems: list):
        if type(elems) == list and (len(elems) < 1 or type(elems[-1]) != list):
            return elems
        return self.locate_last(elems[-1])

    def locate_upper(self, elems: list):
        if type(elems) == list and len(elems) and type(elems[-1]) == list and len(elems[-1]) \
            and type(elems[-1][-1]) == list:
            return self.locate_upper(elems[-1])
        return elems

    def calculate(self, s: str) -> int:
        nums, ops, prev_ch = [0], [], '0' # init-value

        for ch in s:
            if ch.isdigit() and not prev_ch.isdigit():
                tar_nums = self.locate_last(nums)
                tar_nums.append(int(ch))
            elif ch.isdigit():
                tar_nums = self.locate_last(nums)
                tar_nums[-1] = tar_nums[-1] * 10 + int(ch)
            elif ch == '(':
                tar_nums = self.locate_last(nums)
                tar_nums.append([]) # dummy 0 in case of leading -
                tar_ops = self.locate_last(ops)
                tar_ops.append([])
                # print('(:', nums, ops)
                pass
            elif ch == ')':
                upper_nums = self.locate_upper(nums)
                tar_nums = upper_nums.pop()
                upper_ops = self.locate_upper(ops)
                tar_ops = upper_ops.pop()
                val = self.process_add_sub(tar_nums, tar_ops)
                upper_nums.append(val)
            elif ch in set('+-'):
                tar_nums = self.locate_last(nums)
                if len(tar_nums) < 1: # in case of leading +- in parenthesis
                    tar_nums.append(0)
                tar_ops = self.locate_last(ops)
                tar_ops.append(ch)
            else: # skip invalid character
                continue
            prev_ch = ch
        
        if len(ops) + 1 < len(nums):
            ops = [['+'] * (len(nums) - len(ops)), *ops]
        return self.process_add_sub(nums, ops)
```


### Calculator V2 - [227. Basic Calculator II (Medium)](https://leetcode.com/problems/basic-calculator-ii/)

It was asked during a recent 60-min coding interview with `OpusClip` in early-July 2025, in which `+-*/` arithmetic operations need to be supported.

#### Concise & efficient Solution after refactoring

Upon second thought, it appears that multiply and division operations are only needed when encountering an operator or reaching the end of the expression. Otherwise, simply proceed with adding/subtraction.

```python
class Solution:
    from operator import mul, floordiv

    def process_mul_div(self, nums: list[int], ops: list[str]) -> None:
        if len(nums) > 1 and len(ops) and ops[-1] in set('*/'):
            op, num2, num1 = ops.pop(), nums.pop(), nums.pop()
            nums.append(floordiv(num1, num2) if op == '/' else mul(num1, num2))

    def calculate(self, s: str) -> int:
        nums, ops, prev_ch = [0], [], '0' # init-value
        for ch in s:
            if ch.isdigit() and not prev_ch.isdigit():
                nums.append(int(ch))
            elif ch.isdigit():
                nums[-1] = nums[-1] * 10 + int(ch)
            elif ch in set('+-*/'):
                self.process_mul_div(nums, ops)
                ops.append(ch)
            else: # skip invalid character
                continue
            prev_ch = ch
        
        self.process_mul_div(nums, ops)
        return nums[0] + sum(-nums[idx + 1] if op == '-' else nums[idx + 1] \
            for idx, op in enumerate(ops))
```

#### Intuitive Solution

Used in the original interview - it's easier to come up with, but results in too many edge cases to be taken care of, so as to be difficult to complete in a timely manner during an interview.

```python
class Solution:
    def calculate(self, s: str) -> int:
        # pre-processing
        nums: list[Optional[int]] = [None]
        ops: list[tuple[str, int]] = []
        src = re.sub(r"[^0-9\+\-\*\/]", '', s) # clean-up
        for ch in src:
            if re.match(r"[0-9]", ch): # numeric number
                nums[-1] = nums[-1] * 10 + int(ch) if nums[-1] is not None else int(ch)
            elif ch in set('*/+-'): # operators */+-
                ops.append((ch, len(nums)))
                nums.append(None)

        # pass 1: multiply & division
        new_nums: list[tuple[int, int]] = []
        last_idx: Optional[int] = None
        for op, idx in filter(lambda op: op[0] in set('*/'), ops):
            if last_idx is not None and last_idx + 1 < idx:
                last_idx = None
            if idx >= 1 and idx < len(nums):
                prev_idx = idx - 1
                if last_idx is None:
                    num1, num2 = nums[idx - 1], nums[idx]
                else:
                    num1, num2 = new_nums[-1][1], nums[idx]
                    prev_idx, _ = new_nums.pop()
                new_nums.append((prev_idx, mul(num1, num2) if op == '*' else floordiv(num1, num2)))
                last_idx = idx

        # pass 2: add & subtract
        res, next_ptr = nums[0], 0
        if len(ops) > 0 and ops[0][0] in set('*/'):
            res = new_nums[0][1]
        # use two-pointer to calculate the result
        for op, idx in filter(lambda op: op[0] in set('+-'), ops):
            while next_ptr < len(new_nums) and new_nums[next_ptr][0] < idx:
                next_ptr += 1
            val = new_nums[next_ptr][1] if next_ptr < len(new_nums) and idx == new_nums[next_ptr][0] else nums[idx]
            res = add(res, val) if op == '+' else sub(res, val)
        return res
```

#### Test cases

```python
if __name__ == "__main__":
  assert(solution('') is None)
  assert(solution('  ') is None)
  assert(solution('0') == 0)
  assert(solution('10') == 10)
  assert(solution('1*2+3*4-0') == 14)
  assert(solution(' 3/2 ') == 1)
  assert(solution(' 2/ 3') == 0)
  assert(solution(' 15 / 2+3 ') == 10)
  assert(solution(' 3+15 / 2 ') == 10)
  assert(solution(' 100 / 11 /2*10 -0 -1/2+ 10 +0') == 50)
  assert(solution('1000 0302 *21-9+0  ') == 210006333)
  assert(solution("1+2*5/3+6/4*2") == 1 + 3 + 2)
  assert(solution("111+999+111/999") == 111 + 999)
  assert(solution("1787+2136/3/2*2") == 2499)
  print('Test passed!')
```

## Multi-unit Conversion as Graph

Originally asked during a recent 60-min coding interview with Snap in mid-Jan 2025. The problem was so challenging that the proper solution wasn't brought up until after about 40 minutes.

Problem Description:
```markdown
Your old code in javascript has been preserved below.

Create a function convertUnits, to convert a number from a given starting unit to a given ending unit. 
You're given a list of conversion factors consisting of triple `(c, u, v)`, where `c` is a float and `u, v` are unit names.
```
Example:
```python
list = [[12, 'in', 'ft'], [3, 'ft', 'yd'], [5280, 'ft', 'mi'], [220, 'yd', 'furlong'], [25.4, 'mm', 'in'], [100, 'cm', 'm'], [10, 'mm', 'cm']]

convertUnits(0.125, 'mi', 'furlong', list) # returns 1
convertUnits(1, 'mi', 'm', list) # returns 1609.34
```

After revision, it appears to be totally applicable to convert the problem into graph-traversal:

```python
from typing import Optional
from collections import deque, defaultdict

def convertUnits(c: float, u: str, v: str, factors: list[list]) -> Optional[float]:
    # build adjacency list using dictionary denoting the direct conversion factors of every unit
    adj_list: defaultdict[str, list[list]] = defaultdict(list) # DefaultDict[str, List[List[str, float]]]
    for factor in factors:
        rate: float = factor[0]
        unit1: str = factor[1]
        unit2: str = factor[2]
        # set up conversion list for both units
        adj_list[unit1].append([rate, unit2])
        adj_list[unit2].append([1.0 / rate, unit1])

    # perform BFS from u to v and calculate the overall rate
    visited: dict[str, float] = { u: 1.0 }
    que: deque[str] = deque()
    que.append(u)
    while len(que) and v not in visited:
        cur_unit = que.popleft()
        for factor in adj_list.get(cur_unit, []):
            next_rate: float = factor[0]
            next_unit: str = factor[1]
            if next_unit in visited:
                continue
            visited[next_unit] = visited[cur_unit] * next_rate
            que.append(next_unit)
    
    return c / visited[v] if v in visited else None

factors = [[12, 'in', 'ft'], [3, 'ft', 'yd'], [5280, 'ft', 'mi'], [220, 'yd', 'furlong'], [25.4, 'mm', 'in'], [100, 'cm', 'm'], [10, 'mm', 'cm']]
print(convertUnits(0.125, 'mi', 'furlong', factors)) # 1.0
print(convertUnits(1, 'mi', 'm', factors)) # 1609.344
```

Original intuitive BFS implementation failed to cope with those beyond 2-step conversions within the tight interview timeline:

```typescript
const convertUnits = (c: number, u: string, v: string, factors: Array<[number, string, string]>): number => {
    var ratio: number = 1.0;
    var conversion: Map<string, number> = new Map();
    var adj: string[] = [];
    // key: Array<u, v> -> value: ratio number
    
    // parse the ratios
    for (const factor of factors) {
        var pair1 = [factor[1], factor[2]].join('');
        var pair2 = [factor[2], factor[1]].join('');
        conversion[pair1] = factor[0];
        conversion[pair2] = 1.0 / factor[0];
        adj.append(pair1);
        adj.append(pair2);
    }
    // combine the ratios
    for (const factor1 of factors) {
        for (const factor2 of factors) {
            if (factor1[1] === factor2[2]) { // check overlapping units
                var pair1 = [factor1[2], factor2[1]].join('');
                var pair2 = [factor2[1], factor1[2]].join('');
                var rate = factor1[0] * factor2[0]
                conversion[pair1] = factor1[0] * factor2[0];
                conversion[pair2] = 1.0 / rate;
            }
            //  || factor1[2] === factor2[1]
        }
    }
    
    // breath-first search using queue
    var que: string[] = [u];
    while (que.length > 0) {
        var top = que[0];
        que.shift();
        for (const factor in conversion) {
            
        }
    }
    return ratio * c;
};
```