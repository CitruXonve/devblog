---
title: 'Universal Code Competition Template in Python3 (editing) [2022]'
tags:
  - Template
  - Python
abbrlink: 59fdfde7
date: 2022-04-24 00:11:12
---

*  [Legacy Version](/posts/41b311d1/)

# Number Theory

### Quick power and modulo
To calculate $ n^m \% mod $:

### Division and modulo
**DO NOT dividing an integer by another integer with respect to the modulus $mod$.**  
To calculate $ n/m\%mod $ correctly ($ mod$ is a prime number thus $ φ(mod)=mod-1 $).
Use Eular function or modular multiplicative inversion.

### Euler function $ φ(n) $

### Quick greatest common divisor

```py
def kgcd(a, b):
        if a == 0:
            return b
        if b == 0:
            return a
        if (a & 1) == 0 and (b & 1) == 0:
            return kgcd(a >> 1, b >> 1) << 1
        elif (b & 1) == 0:
            return kgcd(a, b >> 1)
        elif (a & 1) == 0:
            return kgcd(a >> 1, b)
        else:
            return kgcd(abs(a - b), min(a, b))
```

<!--more-->

### Extended Euclid Theorem

Solve $ ax+by=gcd(a,b) $, of which the value of $ a $ and of $ b $ are known.
Either $x$ or $y$ can be negative.

```py
def extgcd(a, b):
    if b == 0:
        return (1, 0)
    x, y = extgcd(b, a % b)
    return (y, x - a // b * y)
```

### Modular multiplicative inverse

[Wiki](https://en.wikipedia.org/wiki/Modular_multiplicative_inverse): A modular multiplicative inverse of an integer $a$ is an integer $x$ such that the product $ax$ is congruent to 1 with respect to the modulus $m$.
In the standard notation of modular arithmetic this congruence is written as
$
ax \equiv 1 \pmod{m}
$
If using Extended Euclid Theorem:
```py
def cal_inv(n, mod):
    x, _ = extgcd(n, mod)
    return (x + mod) % mod if x < 0 else x % mod
```

According to Euler's theorem, if $ a$ is coprime to $ m$, that is, $ gcd(a, m) = 1$, then $ a^φ(m)≡1\pmod{m}$,where $ φ(m)$ is Euler's totient function.    
 $ a^{φ(m)-1}≡a^{-1}\pmod{m}$.  
In the special case when $ m$ is a prime, the modular inverse is given by the below equation as: $ a^{-1}≡a^{m-2}\pmod{m}$. 

If using Euler function:
```py
def cal_inv(n, mod):
    return pow_mod(n, phi[mod] - 1, mod)
```

If generating multiple inversions:
```py
def cal_inv(int maxn, long mod):
    inv[1] = 1
    for i in range(2, maxn):
        inv[i] = (mod - mod // i) * inv[mod % i] % mod
```