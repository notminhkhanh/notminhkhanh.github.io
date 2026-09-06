---
title: "Merging DP on Segment Tree"
date: "2020-08-21"
category: "algorithm, data structure"
excerpt: "Collective Notes"
published: false
tags: ["algorithm", "data structure"]
originalDate: "2020-08-21 23:59:59"
legacyPath: "/posts/merging-dp-segtree.html"
---
## Codeforces 1380F
We realise that the maximum value of the sum of 2 digits is 18 - which only consists of 2
digits. Therefore,we can use DP for this problem. There are 2 approach for this problem.
### Solution 1 : Matrix Multiplication

```text
dp[i] - the number of expression for the prefix i 

dp[i] = (a[i] + 1) * dp[i - 1] + (a[i - 1] == 1) * (9 - a[i]) * dp[i - 2];

dp[0] = 1; dp[-1] = 1;

We can easily calculate this using the matrix multiplication in each segment tree node.
By maintaining a "1 * 2" matrix [dp[i]  dp[i - 1]],it's not hard to find the recursive
occurence.

Further implementation : https://www.luogu.com.cn/problem/solution/CF1380F
```

### Solution 2 : Regular DP and Merging function
```text
Consider the current node of range [L..R]

dp[i][j] = the number of expression for the range [L+i...R - j]

i and j in range [0...1]

We just merge everything together, and there is only one thing to keep in mind is that
for its simplicity in merging , for dp[i][j] if (R - j < L + i) we set dp[i][j] = 1.

Submission : https://codeforces.com/contest/1380/submission/120354813.
```


