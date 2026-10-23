---
title: "XOR Basis: từ bitmask đến không gian vector"
date: "2021-08-29"
category: "algorithm, math"
excerpt: "Khử Gauss trên bitmask, kiểm tra khả năng biểu diễn và đếm các tập con có XOR cho trước."
published: true
tags: ["algorithm", "math"]
originalDate: "2021-08-29 23:59:59"
legacyPath: "/posts/xor-basis.html"
updated: "2026-10-23"
cover: "/images/covers/xor-basis.webp"
coverAlt: "A robot combining rows of binary tiles at a workbench."
---
Bitmask không chỉ là một cách lưu tập hợp. Nếu xem mỗi bit là một tọa độ trên trường $\mathbb{F}_2$, phép XOR chính là phép cộng vector. Từ góc nhìn này, XOR basis là một phiên bản gọn của khử Gauss: giữ lại đủ thông tin để biểu diễn mọi XOR có thể tạo ra từ mảng.

## Basis là gì?

Một **XOR basis** của mảng $A$ là một tập vector độc lập tuyến tính có cùng không gian sinh với $A$. Điều đó có nghĩa là:

- Không vector nào trong basis có thể viết thành XOR của các vector còn lại.
- Mọi phần tử của mảng, và mọi XOR của một tập con các phần tử, đều có thể biểu diễn bằng basis.
- Mỗi giá trị trong không gian sinh có đúng một cách biểu diễn bằng các vector của **basis đã chọn**.

Basis không nhất thiết là duy nhất. Sau các phép khử, những vector được lưu cũng không nhất thiết còn là các phần tử nguyên bản của mảng.

Ví dụ, xét $3 = 011_2$, $5 = 101_2$ và $6 = 110_2$. Vì $3 \oplus 5 = 6$, chỉ cần hai vector $3$ và $5$. Chúng sinh ra bốn giá trị $\{0,3,5,6\}$.

Nếu basis có $r$ vector độc lập thì có đúng $2^r$ giá trị XOR khác nhau. Với số nguyên có $B$ bit, ta luôn có $r \le B$.

## Khử theo bit cao nhất

Ta duy trì `basis[i]` là một vector có bit cao nhất bằng $i$. Mỗi vị trí chỉ chứa tối đa một vector.

Khi thêm $x$, duyệt từ bit cao xuống thấp. Nếu bit $i$ của $x$ bằng 1:

1. Nếu `basis[i]` chưa tồn tại, đặt $x$ vào đó. Không gian sinh tăng thêm một chiều.
2. Nếu đã có, XOR $x$ với `basis[i]` để khử bit $i$, rồi tiếp tục.

Nếu $x$ trở thành 0 thì nó đã thuộc không gian sinh hiện tại. Việc XOR một vector với vector khác là phép biến đổi khả nghịch nên không làm mất thông tin về không gian sinh.

```cpp
#include <array>
#include <cstdint>
#include <algorithm>

struct XorBasis {
    std::array<std::uint64_t, 64> basis{};
    int rank = 0;

    bool insert(std::uint64_t x) {
        for (int i = 63; i >= 0; --i) {
            if (((x >> i) & 1ULL) == 0) continue;
            if (basis[i] == 0) {
                basis[i] = x;
                ++rank;
                return true;
            }
            x ^= basis[i];
        }
        return false;
    }

    bool contains(std::uint64_t x) const {
        for (int i = 63; i >= 0; --i) {
            if (((x >> i) & 1ULL) == 0) continue;
            if (basis[i] == 0) return false;
            x ^= basis[i];
        }
        return true;
    }

    std::uint64_t maximum() const {
        std::uint64_t result = 0;
        for (int i = 63; i >= 0; --i)
            result = std::max(result, result ^ basis[i]);
        return result;
    }
};
```

Mỗi thao tác mất $O(B)$ thời gian; xây basis từ $n$ phần tử mất $O(nB)$ và dùng $O(B)$ bộ nhớ. `maximum()` tìm XOR lớn nhất của một tập con, với thứ tự số nguyên **không dấu**.

Cẩn thận với biểu thức kiểm tra bit. `mask & (1 << i) == 0` được C++ hiểu là `mask & ((1 << i) == 0)`, không phải điều ta muốn. Viết rõ ngoặc hoặc dùng phép dịch như trên. Kiểu không dấu cũng tránh việc dịch vào bit dấu.

## Codeforces 959F: đếm tập con trong một prefix

Với prefix dài $l$, cần đếm số cách chọn các vị trí sao cho XOR bằng $x$. Gọi $r$ là rank của prefix:

$$
\text{answer} =
\begin{cases}
0 & x \notin \operatorname{span}(a_1,\ldots,a_l),\\
2^{l-r} & x \in \operatorname{span}(a_1,\ldots,a_l).
\end{cases}
$$

Có $2^l$ tập con theo vị trí, nhưng chỉ có $2^r$ giá trị XOR khác nhau. Ánh xạ từ tập con sang XOR là tuyến tính; mỗi giá trị đạt được có cùng số tiền ảnh, bằng $2^{l-r}$. Các phần tử trùng nhau vẫn là các lựa chọn vị trí khác nhau.

Ta có thể gom truy vấn theo $l$, thêm từng phần tử vào một basis duy nhất, rồi trả lời các truy vấn của prefix hiện tại. Không cần sao chép cả basis cho mọi prefix. Trong bài gốc, tính kết quả modulo $10^9+7$.

## Codeforces 1101G: prefix XOR và tính độc lập

Đặt $p_i = a_1 \oplus \cdots \oplus a_i$. Ta muốn chia mảng thành nhiều đoạn nhất sao cho không có tập con khác rỗng nào của các XOR đoạn có XOR bằng 0.

Nếu $p_n=0$, chọn tất cả các đoạn luôn cho XOR bằng 0, nên không tồn tại cách chia hợp lệ; đáp án là $-1$.

Ngược lại, đáp án là rank của $\{p_1,\ldots,p_n\}$. Để thấy vì sao, chọn một basis từ các prefix và yêu cầu nó chứa $p_n$: một vector khác 0 luôn có thể được mở rộng thành basis của không gian chứa nó. Sắp các prefix đã chọn theo chỉ số, rồi dùng chúng làm các điểm kết thúc đoạn.

XOR của các đoạn là hiệu liên tiếp của những prefix đó — cũng chính là XOR vì đang làm việc trên $\mathbb{F}_2$. Phép đổi giữa prefix và XOR đoạn là khả nghịch, nên tính độc lập được giữ nguyên. Không thể có nhiều đoạn độc lập hơn rank của toàn bộ tập prefix.

## Tham khảo

- [Bài viết về XOR basis trên Codeforces](https://codeforces.com/blog/entry/68953), nguồn cảm hứng cho ghi chú ban đầu.
- [Codeforces 959F — Mahmoud and Ehab and yet another xor task](https://codeforces.com/problemset/problem/959/F).
- [Codeforces 1101G — (Zero XOR Subset)-less](https://codeforces.com/problemset/problem/1101/G).
- [Submission 1101G của mình](https://codeforces.com/contest/1101/submission/127440895).
