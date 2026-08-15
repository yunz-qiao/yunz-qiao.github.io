---
title: CNN.c — Multi-Process Pipe-Based Training
year: 2026
description: A convolutional neural network written from scratch in C, trained data-parallel across processes over pipes.
tags: [C, neural networks, systems]
---

## Overview

A convolutional neural network implemented from scratch in C, with no machine learning frameworks —
forward pass, backprop, and optimizer all hand-written. Training is data-parallel across multiple
processes coordinated over pipes.

## Details

- Implemented the CNN from scratch in C with no ML framework dependencies.
- Implemented multi-process data-parallel training with a binary parent/worker protocol for weight
  broadcasts and gradient collection.
