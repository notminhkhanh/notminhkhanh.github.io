---
title: "Shortest Paths, Beyond the Graph"
date: "2021-05-22"
category: "algorithm, collective"
excerpt: "Dijkstra, negative cycles, and turning systems of inequalities into graphs."
published: true
tags: ["algorithm", "collective"]
originalDate: "2021-05-22 23:59:59"
legacyPath: "/posts/shortest-path-problems.html"
updated: "2026-10-23"
cover: "/images/covers/shortest-path-problems.webp"
coverAlt: "A courier robot following a golden route through a network of nodes."
---
Shortest-path algorithms become much more interesting when the graph is not given explicitly. A state can be a vertex; a transition can be an edge; even an inequality can become a distance constraint.

These notes collect the implementation details and modelling ideas that I want to remember.

## Choosing an algorithm

| Edge weights | A useful starting point | Time complexity |
| --- | --- | --- |
| All edges have the same positive weight | BFS | $O(V+E)$ |
| Only 0 and 1 | 0–1 BFS | $O(V+E)$ |
| Nonnegative weights | Dijkstra with a binary heap | $O((V+E)\log V)$ for a simple graph |
| Negative weights allowed | Bellman–Ford | $O(VE)$ |

A reachable negative cycle means that some distances have no finite minimum. It is not something a shortest-path algorithm can simply ignore.

## Dijkstra: a small, explicit implementation

The key condition is **nonnegative edge weights**. Once the smallest current distance is removed from the heap, no later route can improve it through a negative edge.

```cpp
#include <vector>
#include <queue>
#include <functional>
#include <limits>
#include <utility>

using ll = long long;
struct Edge { int to; ll weight; };
const ll INF = std::numeric_limits<ll>::max() / 4;

std::vector<ll> dijkstra(const std::vector<std::vector<Edge>>& graph,
                         int source) {
    std::vector<ll> dist(graph.size(), INF);
    using State = std::pair<ll, int>;
    std::priority_queue<State, std::vector<State>, std::greater<State>> pq;
    dist[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        auto [du, u] = pq.top();
        pq.pop();
        if (du != dist[u]) continue; // An outdated heap entry.
        for (const auto& edge : graph[u]) {
            if (edge.weight >= INF - du) continue;
            ll candidate = du + edge.weight;
            if (candidate < dist[edge.to]) {
                dist[edge.to] = candidate;
                pq.push({candidate, edge.to});
            }
        }
    }
    return dist;
}
```

Vertices are zero-indexed. Unreachable vertices retain `INF`; choose a distance type and sentinel large enough for every finite answer. This implementation assumes all weights are nonnegative and all relevant shortest distances are strictly below `INF`.

The heap can contain several entries for one vertex. Skipping outdated entries is important: it avoids repeatedly processing an already improved distance.

## SPFA is not a complexity shortcut

SPFA is a queue-based way to schedule Bellman–Ford relaxations. It can work well on some inputs, but its worst-case complexity is still $O(VE)$. It is not generally as fast as Dijkstra, and an implementation without negative-cycle detection can keep relaxing indefinitely.

For difference constraints, the plain Bellman–Ford version below is a useful correctness baseline. When constraints are large, the running-time limit still matters; changing the queue order does not provide a better worst-case guarantee.

## Artful Painting

[Artful Paintings](https://codeforces.com/problemset/gymProblem/102394/A) is a useful example of converting counting conditions into a graph.

Let $p_i$ be the number of painted positions among the first $i$ positions. For a candidate total $x$, the original constraints can be expressed as:

- At least $k$ painted positions inside $[l,r]$: $p_r-p_{l-1}\ge k$.
- At least $k$ painted positions outside $[l,r]$: $p_r-p_{l-1}\le x-k$.
- Each position contributes 0 or 1: $0\le p_i-p_{i-1}\le1$.
- Exactly $x$ positions are painted: $p_n-p_0=x$.

### From an inequality to an edge

A constraint $p_v-p_u\le w$ becomes an edge $u\to v$ of weight $w$. A feasible assignment must satisfy the same inequality as a relaxed shortest-path distance: $p_v\le p_u+w$.

| Constraint | Edge or edges |
| --- | --- |
| $p_r-p_{l-1}\ge k$ | $r\to l-1$ with weight $-k$ |
| $p_r-p_{l-1}\le x-k$ | $l-1\to r$ with weight $x-k$ |
| $0\le p_i-p_{i-1}\le1$ | $i-1\to i$ with weight 1; $i\to i-1$ with weight 0 |
| $p_n-p_0=x$ | $0\to n$ with weight $x$; $n\to0$ with weight $-x$ |

A negative cycle would imply $p_u < p_u$ after summing the inequalities around it, so the system would be impossible. Conversely, if no negative cycle exists, shortest-path potentials from a super-source give a feasible assignment. Subtracting $p_0$ from every potential makes the first prefix zero without changing any differences.

### A feasibility checker

Initializing every distance to zero is equivalent to adding a super-source with zero-weight edges to every vertex. This checks every component, not only vertices reachable from one chosen source.

```cpp
#include <vector>

struct ConstraintEdge {
    int from, to;
    long long weight;
};

bool feasible(int vertices, const std::vector<ConstraintEdge>& edges) {
    std::vector<long long> dist(vertices, 0);
    for (int pass = 0; pass < vertices; ++pass) {
        bool changed = false;
        for (const auto& e : edges) {
            if (dist[e.to] > dist[e.from] + e.weight) {
                dist[e.to] = dist[e.from] + e.weight;
                changed = true;
                if (pass == vertices - 1) return false;
            }
        }
        if (!changed) return true;
    }
    return true;
}
```

This is a reference checker, not a promise that $O(VE)$ will fit every contest limit. It assumes intermediate distance values fit in `long long`. Negative potentials alone are perfectly valid: it is a **negative cycle**, not a negative distance, that makes a difference-constraint system infeasible.

For this problem, painting one more unpainted position cannot reduce the number painted inside or outside any interval. Feasibility is therefore monotone in $x$, which allows binary search over $0\ldots n$. Check that a feasible upper bound exists first.

## APIO 2015 Skyscraper

This remains a problem to revisit from the original notes. The useful modelling question is what information belongs in a state: a building alone, or a building together with a jump length? Creating every possible jump edge directly can make the graph too large; the representation matters as much as the shortest-path algorithm.

## Further reading and practice

- [MIT 6.006: shortest paths, Dijkstra, and Bellman–Ford](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/pages/lecture-notes/).
- [Stanford CS97SI: shortest-path algorithms](https://web.stanford.edu/class/cs97si/07-shortest-path-algorithms.pdf).
- The original practice list also included Codeforces 102394H, Codeforces 1209F, AIIO 2020 Metropole, POJ 1201, and POJ 3169.
