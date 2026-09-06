---
title: "XOR BASIS"
date: "2021-08-29"
category: "algorithm, math"
excerpt: "Collective Notes"
published: true
tags: ["algorithm", "math"]
originalDate: "2021-08-29 23:59:59"
legacyPath: "/posts/xor-basis.html"
---
Source : https://codeforces.com/blog/entry/68953.
Considering bitmasks as vectors to do magic tricks - Gaussian Elimination ?.

## Basis là gì ?
Giả sử chúng ta có mảng A[] nọ khi đó Xor basis của mảng A này sẽ là tập con X.
Sao cho với mỗi phần tử Num trong tập con đấy ta không thể viết được Num dưới dạng xor-sum
của một số phần tử nào đấy khác Num trong tập con X. Và tất cả các phần tử khác không nằm 
trong basis đều có thể viết được dưới dạng xor-sum của một số phần tử từ tập con của X.

Hay nói trong ngôn ngữ toán học, là vector này có thể viết được dưới dạng Linear của các
vector khác.

Và 2 vector khác nhau thì có cách biểu diễn khác nhau, hay nói cách khác mọi vector khác
nhau đều có cách biểu diện độc nhất.

## Một số tính chất của Basis
```text
-For a set of independent vectors, we can change any of these vectors by adding to it any linear combination of all of them, and the vectors will still stay independent. What's more fascinating is that, the set of vectors in the space representable by some linear combination of this independent set stays exactly the same after the change.

-The basis is actually the smallest sized set such that all other vectors in the vector space are representable by a linear combination of just the element vectors of that set.

-The basis vectors are independent.

-For any set with smaller number of independent vectors than the basis, not all of the vectors in the space will be representable.

-And there cannot possibly be larger number of independent vectors than basis in a set. If d is the size of the basis of a vector space, then the moment you have d independent vectors in a set, it becomes a basis. You cannot add another vector into it, since that new vector is actually representable using the basis.

-For a d−dimensional vector space, it's basis can have at most d vector elements.
```
## Thuật toán tìm basis

```c++

int basis[30];
/*
Tùy bài toán mà định nghĩa f(x) sẽ khác đi !

Thường thì f(x) = least significant bit (x) hoặc most significant bit (x)

Ở đây basis[i] sẽ chứa mask của vector mà có f(vector) = i.
Basis đảm bảo mọi vector trong basis đều có giá trị hàm f tương ứng với nó đôi một khác nhau.
*/

int sz; // current size of basis
	
// lease significant bit edition
void insert (int mask){
	for (int i = 0 ; i <= log2_max ; i++){
		if (mask & (1 << i) == 0) continue;
		if (!basis[i]){
			// khong co vector nao co f(vector) = i -> insert vector nay vao
			basis[i] = mask;
			++sz;
			return;
		}
		mask ^= basis[i];
	}
}

// most significant bit edition

void insert (int mask){
	for (int i = log2_max ; i >= 0 ; i--){
		if (mask & (1 << i) == 0) continue;
		if (!basis[i]){
			basis[i] = mask;
			++sz; return;
		}
		mask ^= basis[i];
	}
}

// check if number X can be represented as a subset of array
// check by trying to insert X into basis
bool check (ll x){
	for (int i = 0 ; i <= log2_max ; i++){
		if (x & (1 << i) == 0) continue;
		if (!basis[i]) return false;
		x ^= basis[i];
	}
	return true;
}

```
## Một số bài toán liên quan đến basis
### Codeforces 959F
```text
Ehab has an array a of n integers. He likes the bitwise-xor operation and he likes to bother Mahmoud so he came up with a problem. He gave Mahmoud q queries. In each of them, he gave Mahmoud 2 integers l and x, and asked him to find the number of subsequences of the first l elements of the array such that their bitwise-xor sum is x. Can you help Mahmoud answer the queries?

A subsequence can contain elements that are not neighboring.
```
Chúng ta duy trì mảng basis cho từng prefix. Khi đấy đáp án chính là 2^x trong đó x chính là số vector
trong prefix mà không nằm trong basis của prefix đó. Vì sao lại như thế ?.

Chúng ta nhận thấy nếu chúng ta lấy tất cả subset của tập những vector này (kể cả rỗng). Thì với mỗi subset,
chúng ta có thể cộng/trừ một số vector từ trong basis để achieve được x. Và với mỗi tập thì chỉ có 1 cách.
-> Phân biệt dựa vào đấy được i think.
### Codeforces 1101G
Chúng ta lập mảng prefix xor khi đấy xor-sum của một subset các segment sẽ được tín bằng xor-sum của một subset
prefix xor.

Và chúng ta muốn maximize cái của tập hợp này.

Nhận thấy trong basis, không có subset nào có size >= 2 có xor = 0. -> Lập basis của mảng prefix xor.
Ans = size của basis.

Submission : https://codeforces.com/contest/1101/submission/127440895.