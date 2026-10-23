---
title: "Using Segment Trees Effectively"
date: "2021-05-21"
category: "algorithm, data structure"
excerpt: "Choosing the right node summary, composing lazy updates, and the Norma problem."
published: true
tags: ["algorithm", "data structure"]
originalDate: "2021-05-21 23:59:59"
legacyPath: "/posts/on-segment-tree.html"
updated: "2026-10-23"
cover: "/images/covers/on-segment-tree.webp"
coverAlt: "A robot exploring a binary tree above a highlighted range of array blocks."
---
A segment tree is only as useful as the information stored in each node. The interesting part of a harder range-query problem is often finding a summary that remains easy to update.

Two examples helped this idea click for me: maintaining products of changing quantities, and composing addition with multiplication.

## Norma: fix the right endpoint

In COCI 2014’s **Norma**, each subarray contributes

$$
\min(A_l,\ldots,A_r)\cdot\max(A_l,\ldots,A_r)\cdot(r-l+1).
$$

We need the sum over all subarrays, keeping the last nine digits: all arithmetic can be performed modulo $10^9$.

Instead of considering every pair $(l,r)$ independently, sweep the right endpoint $r$ from left to right. At step $r$, a leaf indexed by $l$ represents the subarray $[l,r]$. Write its minimum, maximum, and length as $m_l$, $M_l$, and $L_l$.

Moving from $r-1$ to $r$ causes three kinds of changes:

1. Every existing active subarray becomes one element longer.
2. Some suffix of left endpoints gets a new maximum, $A_r$.
3. Some suffix of left endpoints gets a new minimum, $A_r$.

If $g$ is the nearest index before $r$ with $A_g>A_r$, then the maximum becomes $A_r$ for $l\in[g+1,r]$. Likewise, if $s$ is the nearest index with $A_s<A_r$, the minimum becomes $A_r$ for $l\in[s+1,r]$. Use index 0 when no such element exists.

Monotonic stacks find these boundaries in $O(n)$ total time. Pop values $\le A_r$ for the previous strictly greater element, and values $\ge A_r$ for the previous strictly smaller element; this handles duplicates consistently.

## Store the products you will need

For a segment-tree node, maintain the sums of

$$
L,\quad M,\quad m,\quad ML,\quad mL,\quad Mm,\quad MmL,
$$

as well as the number of active leaves, $c$. The answer contributed by the node is $\sum MmL$.

Why all seven sums? Because updating one quantity leaves a product of the other two:

- Assigning $M\leftarrow x$ gives $\sum MmL=x\sum mL$.
- Assigning $m\leftarrow x$ gives $\sum MmL=x\sum ML$.
- Adding $d$ to $L$ gives $\sum MmL\leftarrow\sum MmL+d\sum Mm$.

The other stored sums update by the same algebra. These are constant-time operations on a whole node.

```cpp
using ll = long long;
constexpr ll MOD = 1'000'000'000LL;
ll product(ll a, ll b) { return a * b % MOD; }

// All sums and update values are kept in [0, MOD).
// count is the number of active leaves represented by this node.
struct Summary {
    ll count = 0;
    ll L = 0, M = 0, m = 0;
    ll ML = 0, mL = 0, Mm = 0, MmL = 0;

    void setMax(ll x) {
        x %= MOD;
        M = product(count % MOD, x);
        ML = product(L, x);
        Mm = product(m, x);
        MmL = product(mL, x);
    }

    void setMin(ll x) {
        x %= MOD;
        m = product(count % MOD, x);
        mL = product(L, x);
        Mm = product(M, x);
        MmL = product(ML, x);
    }

    void addLength(ll d) {
        d %= MOD;
        L = (L + product(count % MOD, d)) % MOD;
        ML = (ML + product(M, d)) % MOD;
        mL = (mL + product(m, d)) % MOD;
        MmL = (MmL + product(Mm, d)) % MOD;
    }
};
```

These are the node-update operations, not a complete segment-tree implementation. Merge children by adding their corresponding fields modulo $10^9$; keep `count` as an ordinary count. Original array values, not their residues, determine the monotonic-stack comparisons.

A convenient sweep order is:

1. Add 1 to lengths on $[1,r-1]$.
2. Activate leaf $r$ with $L=1$ and $M=m=A_r$.
3. Assign the new maximum and minimum on the ranges above.
4. Add the root’s $\sum MmL$ to the answer.

Inactive leaves contribute zero. A lazy tag needs separate fields for the length increment and optional maximum/minimum assignments. Use explicit `hasMax` and `hasMin` flags: zero is a value, so it should not also mean “no assignment”. New assignments replace older assignments of the same quantity; length increments accumulate. Operations on these three different quantities commute.

There are a constant number of range updates per endpoint, giving $O(n\log n)$ time and $O(n)$ memory.

## Addition and multiplication are one affine update

For a simpler tree storing range sums, combine both operations into

$$
f(x)=ax+b.
$$

Multiplying by $k$ is $(a,b)=(k,0)$; adding $k$ is $(1,k)$. On a node with sum $S$ and length $c$, the new sum is $aS+bc$.

Suppose the existing lazy tag is $g(x)=mx+d$, and a new update $f(x)=ax+b$ arrives. The combined tag is

$$
f(g(x))=(am)x+(ad+b).
$$

The order matters: multiplying after adding must also multiply the pending addition.

```cpp
struct AffineNode {
    ll sum = 0;
    ll mul = 1, add = 0; // Identity: x -> x.

    void apply(ll a, ll b, ll length) {
        a %= MOD;
        b %= MOD;
        sum = (product(a, sum) + product(b, length % MOD)) % MOD;
        mul = product(a, mul);
        add = (product(a, add) + b) % MOD;
    }
};
```

This snippet uses the `ll`, `MOD`, and `product` definitions above and assumes nonnegative update values. To push, apply the parent’s `(mul, add)` to both children with their respective lengths, then reset the parent tag to `(1,0)`. Do not push from a leaf.

For a quick check, start at $x=2$. Add 3, then multiply by 4: the answer is 20, and the combined tag is $4x+12$. Reversing the updates produces $4x+3=11$.

The recurring idea is to choose a node summary that is closed under the updates. Once the algebra is right, lazy propagation becomes bookkeeping.

## Reference

[COCI 2014/2015 archive](https://hsin.hr/coci/archive/2014_2015/) — Contest 2, Norma.
