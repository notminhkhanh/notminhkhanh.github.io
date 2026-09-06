---
title: "Using Segment Tree Effectively"
date: "2020-05-21"
category: "algorithm, data structure"
excerpt: "Collective Notes"
published: true
tags: ["algorithm", "data structure"]
originalDate: "2020-05-21 23:59:59"
legacyPath: "/posts/on-segment-tree.html"
---
## Problem 1 : Norma - COCI 2014
Given an array, you have to calculate sum of following 
value of all subarray : 
```text
	max * min * len
	in which max is the maximum element of subarray,
	min is the minimum,len is length of subarray.
```
### Solution
To make the problem more simple to solve, why not fixing the right
"bound" of the subarray and calculate the answers. That is to iterate
R from 1 to N and add to the answer cal(1,R),cal(2,R),...,cal(R,R).

We need to find some sort of data structure which may help us solve
this problem efficently!

Supposing we are at position R - 1, how the answers would change if we move
to position R ? 
First of all the length for all subarray with fixed-endpoint will increase 1
in size ([1,r-1] -> [1,r] , ...,[r-1,r],[r,r]).

When adding number A[R], it will also affect the answer for every subarray
with left-point in range [mx[r] + 1,r] and [mi[r] + 1,r], in which mx[r] and
mi[r] denote the position of the nearest number larger A[R] and the nearest
smaller number than A[R] respectively.

Given these, we can think of segment tree to solve this problem with queries
updating value L,Max,Min for a given range.

But how can we apply lazy propagation in this specific problem ?

For its simplicity, for each interval we save the following values :
```markdown
* L,Max,Min
* Sum of value : Max * Min, Min * L , Max * L 
* Sum needed Value : Max * Min * L
```
Given those values, when we update Max, Min or L at a time it's easy
to update Max * Min * L

Now the work is mostly done, After each insertion and update,we just need to add
the sum of value Max * Min * L of range [1,i] to the answer.

The work of finding nearest greater/smaller number can be easily solved by using 
a monotonic stack in O(n)

Total time complexity : O(n log n)
```c++
	// lazy propaganda
	void apply (ll node,ll tl,ll tr){
		ll add_l = lazy[node].l ; // updating length
		ll new_mx = lazy[node].mx; // updating max value
		ll new_mi = lazy[node].mi;

		if (new_mx != 0){
			seg[node].MAX = (tr - tl + 1) * new_mx;
			seg[node].MAXL = seg[node].L * new_mx;
			seg[node].MAXMIN = seg[node].MIN * new_mx;
			seg[node].MAXMINL = seg[node].MINL * new_mx;
		}

		if (new_mi != 0){
			seg[node].MIN = (tr - tl + 1) * new_mi;
			seg[node].MAXMIN = seg[node].MAX * new_mi;
			seg[node].MINL = seg[node].L * new_mi;
			seg[node].MAXMINL = seg[node].MAXL * new_mi;
		}

		if (add_l != 0){
			seg[node].L = (seg[node].L + (tr - tl + 1) * add_l);
			seg[node].MAXL = (seg[node].MAXL + seg[node].MAX * add_l);
			seg[node].MINL = (seg[node].MINL + seg[node].MIN * add_l);
			seg[node].MAXMINL = (seg[node].MAXMINL + add_l*seg[node].MAXMIN);
		}

		if (tl != tr){
			if (add_l != 0){
				lazy[node << 1].l += add_l;
				lazy[node << 1 | 1].l += add_l;
			}
			if (new_mx != 0){
				lazy[node << 1].mx = new_mx;
				lazy[node << 1 | 1].mx = new_mx;
			}
			if (new_mi != 0){
				lazy[node << 1].mi = new_mi;
				lazy[node << 1 | 1].mi = new_mi;
			}
		}

		lazy[node] = {0,0,0};
	}
```

## Processing Addition and Multiplication in Lazy Propaganda

```c++
	void apply (ll node,ll tl,ll tr){
		ll len = tr - tl + 1;
		ll lf = len - len/2,rt = len / 2;

		if (mul[node] != 1){
			st[node << 1] *= mul[node];
			mul[node << 1] *= mul[node];
			add[node << 1] *= mul[node];

			st[node << 1 | 1] *= mul[node];
			mul[node << 1 | 1] *= mul[node];
			add[node << 1 | 1] *= mul[node];

			mul[node] = 1; 
		}

		if (add[node] != 0){
			st[node << 1] += lf * add[node];
			st[node << 1 | 1] += rt * add[node];

			add[node << 1] += add[node];
			add[node << 1 | 1] += add[node];

			add[node] = 0;
		}
		return;
	}
```
