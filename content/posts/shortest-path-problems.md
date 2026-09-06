---
title: "Problems related to Shortest Path Finding"
date: "2020-05-22"
category: "algorithm, collective"
excerpt: "Collective Notes"
published: true
tags: ["algorithm", "collective"]
originalDate: "2020-05-22 23:59:59"
legacyPath: "/posts/shortest-path-problems.html"
---
Although there are only a few algorithms for shortest path finding,namely BFS,SPFA
or Dijkstra,its applications and problemset is surprisingly vast...

[MIT's Shortest Path - Lecture 15 - 17](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/lecture-notes/)

Shortest Path Problemset :
+ [Artful Painting - CF102394A](#artful-painting)
+ [APIO 2015 - Skyscraper](#apio-2015-skyscraper)
+ Codeforces 102394H
+ Codeforces 1209F
+ AIIO 2020 - Metropole

## Basic Implementation 

1. Dijkstra
_Does not support negative weight edges_
```c++
priority_queue<ii,vii,greater<ii>> pq; // can be a struct or sth
pq.push(mp(0,src));

while (!pq.empty()){
	ii nw = pq.top(); pq.pop();
	if (d[nw.se] != nw.fi) continue;
	for (ii e : g[nw.se]){
		ll nxt = e.se,w = e.fi;
		if (nw.fi + w < d[nxt]){
			d[nxt] = nw.fi + w;
			pq.push(mp(d[nxt],nxt));
		}
	}
}
``` 
2. SPFA
```c++
// SPFA implementation
queue<ll> q;
ll dist[MAXN]; // set dist to be inf
bool in_queue[MAXN];

dist[src] = 0; in_queue[src] = true;
q.push(src);

while (!q.empty()){
	ll u = q.front(); q.pop(); in_queue[u] = false;
	for (ii e : g[u]){
		ll v = e.fi,w = e.se;
		if (dist[u] + w < dist[v]){
			dist[v] = dist[u] + w;
			if (!in_queue[v]){
				q.push(v);
				in_queue[v] = true;
			}
		}
	}
}
```
Though this algorithm runs in O(kE) where k depends on the graph, through
performance experiments, it has proved to be as fast as Dijkstra Algorithm.
SPFA can deal with negative cycle and can be modified to detect negative cycle.

To check is graph exist a negative cycle, we initialize a "counter" array.If there
exits a node which appear in the queue more than V - 1 times, than there is a
negative cycle.

## Artful Painting
It's essential to know that problems involving system of inequalities
can be solved by using shortest-path finding algorithms !

_Furthur information_

[Stanford's lecture](https://web.stanford.edu/class/cs97si/07-shortest-path-algorithms.pdf)

[Some random paper on Researchgate](https://www.researchgate.net/publication/225417333_Solving_Systems_of_Difference_Constraints_Incrementally)

[Random Youtube video](https://www.youtube.com/watch?v=Z7l-sdWIIeg)

[With additional requirement - Stackexchange](https://cs.stackexchange.com/questions/11445/solving-system-of-linear-inequalities)

### Solution
We can see that if we found an answer,painting more doesnt change the state.
That is to say, the more we paint the more we are "wasting". Therefore, we can
apply binary search on this problem. However, we havent managed to find a way to verify an answer.
As above, this issue can be solved by using SPFA.All of the requirements
can be written as :
```text
- pre[r] - pre[l - 1] >= k (or pre[r] - k >= pre[l - 1])
- pre[r] - pre[l - 1] <= x - k (or pre[l - 1] + x - k >= pre[r])
- pre[i] + 0 >= pre[i - 1]
- pre[n] = x
- pre[0] = 0
```
This solution is based on the inequality : 
```text
	dist(u) + w >= dist(v) holds
	unless there is a negative cycle
	where dist(x) is the min-dist from 0 to x

	That is to say
	For every edge u -> v
	if dist(v) > dist(u) + w
```
In conclusion, build a directed graph -> check if exist negative cycle.

```c++
	// spfa
	bool spfa(){
		bool in_queue[3005];
		ll cnt[3005],dist[3005];
		queue<ll> q;
		for (int i = 0 ; i <= n ; i++){
			cnt[i] = 0; in_queue[i] = false;
			dist[i] = inf;
		}
		dist[0] = 0; in_queue[0] = true; cnt[0] = 1;
		q.push(0);
		while (!q.empty()){
			ll u = q.front(); q.pop(); in_queue[u] = false;
			for (ii e : g[u]){
				ll v = e.fi,w = e.se;
				if (w + dist[u] < dist[v]){
					dist[v] = w + dist[u];
					if (dist[v] < 0) return false;
					if (!in_queue[v]){
						in_queue[v] = true;
						cnt[v]++;
						q.push(v);
					}
					if (cnt[v] > n) return false;
				}
			}
		}
		return true;
	}
	// binary search check
	bool check (ll mid){
		for (int i = 0 ; i <= n ; i++){
			g[i].clear();
		}
		for (int i = 1 ; i <= m1 ; i++){
			// pre[r] - pre[l - 1] >= k
			// pre[r] - k >= pre[l - 1]
			g[r[i]].pb(mp(l[i] - 1,-k[i]));
		}
		for (int i = 1 ; i <= m2 ; i++){
			// pre[r] - pre[l - 1] <= mid - k
			g[l[i + m1] - 1].pb(mp(r[i + m1],mid - k[i + m1]));
		}
		// other base edges
		g[0].pb(mp(n,mid));
		g[n].pb(mp(0,-mid));

		for (int i = 1 ; i <= n ; i++){
			g[i - 1].pb(mp(i,1));
			g[i].pb(mp(i - 1,0));
		}
		return spfa();
	}
```

Another interesting observation you should know is that : if we run Bellman-Ford on some "Supernode" with edges to other nodes w = 0 then it will minimizes the difference :
max(xi) - min(xi).

If we want to maximize it, just run Bellman-Ford on node x1 !

Similar problems : POJ 1201,POJ 3169

## APIO 2015 Skyscraper

