---
title: "Multiplicative Functions in Competitive Programming"
date: 2026-05-31
tags: ["competitive-programming", "number-theory"]
description: "Learning notes on multiplicative functions, Dirichlet convolution, Möbius inversion, and the linear sieve."
---

Common form: asked to sum or count something over $1 \le i \le n$, or over pairs $(i, j)$, the quantity involves divisors, gcds, or Euler's totient, and the obvious double loop is hopelessly slow. A surprising fraction of them collapse the moment we notice that the function in play is *multiplicative*.

<!-- These notes are my working reference for that idea. The first half builds the small amount of algebra you need — multiplicative functions, Dirichlet convolution, and Möbius inversion — and the second half is the part you actually type into a contest: the linear sieve, the Möbius-inversion gcd trick, and a note on sublinear prefix sums. None of the pieces are individually hard; the value is in learning to *recognize* the pattern. -->

## Arithmetic and multiplicative functions

An *arithmetic function* is just a map $f : \mathbb{Z}^{+} \to \mathbb{C}$ — in practice, some integer we compute from $n$. It is **multiplicative** if $f(1) = 1$ and

$$ f(mn) = f(m)\,f(n) \qquad \text{whenever } \gcd(m, n) = 1, $$

and **completely multiplicative** if that identity holds for *all* $m, n$, coprime or not. The coprimality restriction is the entire personality of the definition: it ties $f$ to the prime factorization and to nothing else.

**Lemma.** *A multiplicative function is completely determined by its values on prime powers. If $n = p_1^{e_1} p_2^{e_2} \cdots p_k^{e_k}$, then $f(n) = \prod_{i=1}^{k} f\!\left(p_i^{e_i}\right)$.*

**Proof.** The factors $p_i^{e_i}$ are pairwise coprime, so apply the multiplicative rule $k - 1$ times. $\blacksquare$

This is the whole reason these functions are cheap to compute: we never need to reason about a general $n$, only about prime powers $p^e$, and then multiply. Every algorithm below is, at heart, "do something clever at prime powers, then multiply out."

<!-- ## A zoo of multiplicative functions

Here are the ones worth memorizing, with their values on a prime power $p^e$ (which, by the lemma, is all you ever need).

| function | meaning | value at $p^e$ | type |
|---|---|---|---|
| $\varepsilon(n)$ | the unit, $[\,n = 1\,]$ | $0$ for $e \ge 1$ | completely |
| $\mathbf{1}(n)$ | constant $1$ | $1$ | completely |
| $\operatorname{Id}(n)$ | $n$ | $p^e$ | completely |
| $d(n) = \sigma_0(n)$ | number of divisors | $e + 1$ | multiplicative |
| $\sigma(n) = \sigma_1(n)$ | sum of divisors | $1 + p + \cdots + p^e$ | multiplicative |
| $\varphi(n)$ | Euler totient | $p^e - p^{e-1}$ | multiplicative |
| $\mu(n)$ | Möbius function | $-1$ if $e = 1$, else $0$ | multiplicative |

The Möbius function deserves a second look. On a general $n$ it is $\mu(n) = (-1)^k$ when $n$ is a product of $k$ *distinct* primes (squarefree), and $\mu(n) = 0$ as soon as any prime divides $n$ twice. That "$0$ on non-squarefree inputs" is exactly what lets $\mu$ act like an inclusion–exclusion sign, which is the trick in the next section. -->

### Sources:

https://usaco.guide/adv/prefix-sums-nt-1?lang=cpp

https://usaco.guide/adv/prefix-sums-nt-2?lang=cpp

https://codeforces.com/blog/entry/53925

https://codeforces.com/blog/entry/54150



## Möbius inversion

Because $\mu * \mathbf{1} = \varepsilon$, convolving any identity by $\mu$ undoes a convolution by $\mathbf{1}$:

**Möbius inversion.** *For arithmetic functions $f, g$,*
$$ g(n) = \sum_{d \,\mid\, n} f(d) \quad\Longleftrightarrow\quad f(n) = \sum_{d \,\mid\, n} \mu(d)\, g\!\left(\tfrac{n}{d}\right). $$

In convolution language this is just $g = f * \mathbf{1} \iff f = g * \mu$, and the proof is one line: convolve both sides by $\mu$ and use $\mathbf{1} * \mu = \varepsilon$. This equivalence is the engine behind essentially every "sum over coprime pairs" trick below.
## Dirichlet convolution

The reason these functions form a tidy algebra is the **Dirichlet convolution**:

$$ (f * g)(n) = \sum_{d \,\mid\, n} f(d)\, g\!\left(\tfrac{n}{d}\right). $$

Its identity element is $\varepsilon$, since in $(\varepsilon * f)(n)$ only the divisor $d = 1$ survives. The single fact that makes convolution useful in a contest is this:

**Theorem.** *If $f$ and $g$ are multiplicative, so is $f * g$.*

**Proof.** Take $\gcd(m, n) = 1$. Every divisor of $mn$ factors uniquely as $d = ab$ with $a \mid m$, $b \mid n$, and $\gcd(a, b) = 1$. Then

$$ (f * g)(mn) = \sum_{a \mid m} \sum_{b \mid n} f(ab)\, g\!\left(\tfrac{mn}{ab}\right) = \Big(\sum_{a \mid m} f(a) g\!\left(\tfrac{m}{a}\right)\Big)\Big(\sum_{b \mid n} f(b) g\!\left(\tfrac{n}{b}\right)\Big), $$

using multiplicativity of $f$ and $g$ across the coprime split $ab$. The right-hand side is $(f * g)(m)\,(f * g)(n)$. $\blacksquare$

So multiplicative functions are *closed* under $*$, and almost all the standard ones are secretly convolutions of simpler functions. The four identities to keep in memory:

$$ \mathbf{1} * \mathbf{1} = d, \qquad \operatorname{Id} * \mathbf{1} = \sigma, \qquad \varphi * \mathbf{1} = \operatorname{Id}, \qquad \mu * \mathbf{1} = \varepsilon. $$

Read aloud: "the number of divisors is $\sum_{d \mid n} 1$"; "the sum of divisors is $\sum_{d \mid n} d$"; "$\sum_{d \mid n} \varphi(d) = n$"; and the headline act, "$\sum_{d \mid n} \mu(d) = [\,n = 1\,]$". That last one says $\mu$ is the Dirichlet *inverse* of $\mathbf{1}$.


## Use case 1 — the linear sieve

Because a multiplicative $f$ is pinned down by its prime-power values, we can fill an array $f[1 \ldots N]$ in $O(N)$ with a **linear sieve**. The sieve visits every composite exactly once, through its *smallest* prime factor $p$, so for each new number $i \cdot p$ we only need a rule for two cases:

1. **$p \nmid i$.** Then $\gcd(i, p) = 1$, so $f(i \cdot p) = f(i)\, f(p)$ — pure multiplicativity.
2. **$p \mid i$.** Now $p$ is also the smallest prime of $i$, and we are bumping its exponent: $p^k \,\|\, i$ becomes $p^{k+1} \,\|\, i \cdot p$. We need a rule relating $f(p^{k+1})$ to $f(p^k)$, usually by tracking the relevant prime-power factor on the side.

Here is the canonical version that produces $\varphi$ and $\mu$ together, since they exercise both styles of recurrence:

```cpp
const int N = 1000001;
int primes[N], pc = 0;
bool composite[N];
int phi[N], mu[N];

void sieve(int n) {
    phi[1] = 1; mu[1] = 1;
    for (int i = 2; i <= n; i++) {
        if (!composite[i]) { // i is prime
            primes[pc++] = i;
            phi[i] = i - 1;            // phi(p) = p - 1
            mu[i] = -1;                // mu(p)  = -1
        }
        for (int j = 0; j < pc && (long long) i * primes[j] <= n; j++) {
            int p = primes[j], ip = i * p;
            composite[ip] = true;
            if (i % p == 0) {           // case 2: p divides i
                phi[ip] = phi[i] * p;   // phi(p^{k+1}) = p * phi(p^k)
                mu[ip] = 0;             // squared prime factor => mu = 0
                break;                  // preserve the spf invariant
            } else {                    // case 1: coprime
                phi[ip] = phi[i] * (p - 1);
                mu[ip] = -mu[i];
            }
        }
    }
}
```

Why is it linear? The `break` stops at the smallest prime factor, guaranteeing each composite is struck exactly once. Drop it and this falls back to the $O(N \log \log N)$ sieve.

The same pattern computes anything multiplicative; we only swap the two recurrences. For the **number of divisors** $d(n)$ we track the exponent of the smallest prime, since $d(p^e) = e + 1$:

```cpp
int d[N], cnt[N];   // cnt[i] = exponent of the smallest prime factor of i

void sieve_d(int n) {
    d[1] = 1;
    for (int i = 2; i <= n; i++) {
        if (!composite[i]) { primes[pc++] = i; d[i] = 2; cnt[i] = 1; }
        for (int j = 0; j < pc && (long long) i * primes[j] <= n; j++) {
            int p = primes[j], ip = i * p;
            composite[ip] = true;
            if (i % p == 0) {
                cnt[ip] = cnt[i] + 1;
                d[ip] = d[i] / (cnt[i] + 1) * (cnt[i] + 2);  // (e+1) -> (e+2)
                break;
            } else {
                cnt[ip] = 1;
                d[ip] = d[i] * 2;   // multiply by d(p) = 2
            }
        }
    }
}
```

Divisor sum $\sigma$ works identically if we instead keep the running value $1 + p + \cdots + p^k$ for the smallest prime power. The pattern never changes: *a value at primes, a step rule at prime powers, multiplicativity everywhere else.*

## Use case 2 — Möbius inversion and gcd sums

Here is the payoff that makes the algebra worth it. A classic task:

**Problem.** *Given $n$ (say up to $10^7$), compute $G(n) = \sum_{i=1}^{n} \sum_{j=1}^{n} \gcd(i, j)$.*

The naive double loop is $O(n^2)$ — out of reach. But $\gcd$ is built from $\varphi$ through the identity $\varphi * \mathbf{1} = \operatorname{Id}$, i.e. $n = \sum_{d \mid n} \varphi(d)$. Apply it to $\gcd(i, j)$:

$$ \gcd(i, j) = \sum_{d \,\mid\, \gcd(i, j)} \varphi(d) = \sum_{d \ge 1} \varphi(d)\, [\,d \mid i\,]\,[\,d \mid j\,]. $$

Now push the sum over $d$ to the outside. The number of $i \le n$ divisible by $d$ is $\lfloor n/d \rfloor$, and the $i$ and $j$ choices are independent, so

$$ G(n) = \sum_{d=1}^{n} \varphi(d) \left\lfloor \frac{n}{d} \right\rfloor^{2}. $$

Sieve $\varphi$ in $O(n)$, then evaluate the sum in another $O(n)$. Done.

```cpp
// G(n) = sum_{d=1..n} phi(d) * floor(n/d)^2, assuming phi[] is already sieved.
long long gcd_sum(int n) {
    long long total = 0;
    for (int d = 1; d <= n; d++) {
        long long q = n / d;
        total += (long long) phi[d] * q * q;
    }
    return total;
}
```

The same move with $\mu$ in place of $\varphi$ counts *coprime* pairs: replace the condition $[\gcd(i,j) = 1]$ by $\sum_{d \mid \gcd(i,j)} \mu(d)$ to get

$$ \#\{(i, j) : \gcd(i, j) = 1\} = \sum_{d=1}^{n} \mu(d) \left\lfloor \frac{n}{d} \right\rfloor^{2}, $$

which is just inclusion–exclusion over "both divisible by $d$," with $\mu$ supplying the signs. Once we can spot this shape by pushing the divisor sum outward, then replace a count by a floor. <!-- We will see it in half the number-theory problems we meet. -->

## Use case 3 — sublinear prefix sums (the Du sieve)

Source: https://oi-wiki.org/math/number-theory/du/ (I still don't really understand this one)

Question: What if $n$ is $10^{10}$ and an $O(n)$ array is impossible? 

We often need only a *prefix sum* of a multiplicative function, such as $S_\varphi(n) = \sum_{i=1}^{n} \varphi(i)$ or $S_\mu(n) = \sum_{i=1}^{n} \mu(i)$. The trick (the "Du sieve") is to convolve with $\mathbf{1}$ and read the identity sideways.

Summing $\varphi * \mathbf{1} = \operatorname{Id}$ over $i \le n$ and grouping the double sum by the quotient $q = i/d$ gives

$$ \frac{n(n+1)}{2} = \sum_{i=1}^{n} \sum_{d \,\mid\, i} \varphi(d) = \sum_{q=1}^{n} S_\varphi\!\left(\left\lfloor \tfrac{n}{q} \right\rfloor\right), $$

so, peeling off the $q = 1$ term $S_\varphi(n)$,

$$ S_\varphi(n) = \frac{n(n+1)}{2} - \sum_{q=2}^{n} S_\varphi\!\left(\left\lfloor \tfrac{n}{q} \right\rfloor\right). $$

The floor $\lfloor n/q \rfloor$ takes only $O(\sqrt{n})$ distinct values, so with *divisor blocking* plus memoization  and a linear-sieve precompute up to about $n^{2/3}$, hence, the whole recursion costs $O(n^{2/3})$. The Möbius version is even cleaner, because $\mu * \mathbf{1} = \varepsilon$ collapses the left side to $1$:

$$ S_\mu(n) = 1 - \sum_{q=2}^{n} S_\mu\!\left(\left\lfloor \tfrac{n}{q} \right\rfloor\right). $$

I will leave the implementation out since I don't have a good one, neither I have seen it in a real problem. Top level idea involves a memoization map plus the standard block loop. The takeaway here is the pattern: *convolve the target with something whose prefix sum is trivial, then recurse on the quotients.*

## Takeaways

What I like about multiplicative functions is how mechanical they make a subject that looks intimidating. It comes down to three reflexes:

- **Recognize** that the function depends only on the prime factorization, so it is pinned down at prime powers.
- **Sieve** it in $O(n)$ when we need every value, using a prime rule and a prime-power step rule.
- **Invert** with $\mu$ (or convolve with $\varphi$, $\mathbf{1}$, $\operatorname{Id}$) to turn a gcd or coprimality condition into a clean sum over divisors — then push that sum outward and replace counts by floors.

Almost every "sum over $1 \le i, j \le n$ of some gcd thing" problem is one of these reflexes in disguise. Once we start seeing the divisor sum waiting to be pushed outside, we see it everywhere.
