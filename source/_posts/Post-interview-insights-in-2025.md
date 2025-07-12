---
title: Post-interview insights in 2025
tags:
  - Interview
  - Python
abbrlink: 33dd1419
date: 2025-07-12 13:22:52
---

## Simulated Calculator

Asked during a recent 60-min coding interview with `OpusClip`.

### [LC 224. Basic Calculator (Hard)](https://leetcode.com/problems/basic-calculator/description/)

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

It's easier to come up with, but results in too many edge cases to be taken care of, so as to be difficult to complete in a timely manner during an interview.

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