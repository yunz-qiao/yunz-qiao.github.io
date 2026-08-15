---
title: GAT for Drug-Target Interaction Prediction
year: 2025
description: A dual-graph attention network that predicts binding affinity between cancer drug candidates and target proteins, benchmarked against a fingerprint baseline.
tags: [PyTorch, graph neural networks, deep learning, computational biology]
repo: https://github.com/markhywang/gat-cd4c
---

## Overview

Drug-target interaction (DTI) prediction tries to answer a question that would otherwise take a wet
lab months: given a candidate molecule and a target protein, are they likely to interact? Doing this
experimentally is slow and expensive, so it's a natural fit for learned models over molecular
structure.

This project asks a specific version of that question — **do graph attention networks actually beat
the traditional fingerprint-based approach on DTI prediction?** We implemented a GAT in PyTorch and
benchmarked it head-to-head against a Morgan fingerprint + XGBoost baseline on the same splits.

A team project with [three collaborators](https://github.com/markhywang/gat-cd4c/graphs/contributors).

## Data

We trained on **CandidateDrug4Cancer**: 29 cancer-related target proteins, 54,869 drug molecules,
and 73,770 drug-protein interaction records. Molecules are represented as graphs with atoms as
nodes and chemical bonds as edges. The DAVIS and KIBA benchmark datasets are wired up too.

Proteins get the same treatment rather than being flattened into a sequence embedding — we cache
predicted structures from ColabFold/AlphaFold and build protein graphs from them, so both sides of
the interaction are graphs.

## Model

The core is a `DualGraphAttentionNetwork` that runs separate attention stacks over the drug graph
and the protein graph, then pools both into a joint representation for affinity regression.

- **GPS-style layers** combining local message passing with attention, carrying edge features
  through their own stream rather than discarding bond information.
- **Multi-head attention** — the final configuration uses 8 layers, 6 heads, and hidden size 96.
- **LayerNorm** at the feature-prep output, after the edge-stream residual, inside the feed-forward
  sub-layer, and on the graph-level pooled embeddings.
- **Masked-language-model head** over node categories, adapted from SSM-DTA, so unpaired molecules
  and proteins can contribute a semi-supervised pretraining signal.

Training uses Huber loss (β = 0.5), lr 3e-4 with weight decay 1e-3, `ReduceLROnPlateau`, batch size
64, and early stopping after 64 stagnant epochs against a 512-epoch cap, on an 80/10/10 split.
Model sizes are swappable through config files, which made ablations (no dropout, no pooling
dropout, SGD, lighter Huber) cheap to run.

## Baseline

The comparison point is the standard cheminformatics pipeline: RDKit Morgan fingerprints for the
molecule, protein embeddings for the target, and XGBoost regression over the concatenation —
scored with the same accuracy-within-threshold metric as the GAT so the two are directly
comparable.
