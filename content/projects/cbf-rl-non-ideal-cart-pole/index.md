---
title: "CBF-RL with Non-Ideal Cart-Pole Dynamics"
slug: "cbf-rl-non-ideal-cart-pole"
category: "Control, Simulation & AI"
tags: ["Isaac Lab", "Reinforcement Learning", "Dynamics", "Course Project"]
startDate: "2026-04"
endDate: "2026-05"
role: "[TODO: Add role]"
context: "Deep Reinforcement Learning course"
featured: false
summary: "Control Barrier Functions and PPO under modeled actuator and track non-idealities."
results: []
spec: "Isaac Lab · PPO · Post-CBF vs Reward-CBF"
tools: ["Isaac Lab", "PPO", "Control Barrier Functions"]
cover: "cover.jpg"
coverAlt: "Learning-performance plots comparing real and ideal actuators for the baseline, Post-CBF, Reward-CBF and Reward+Jerk methods."
photos:
  - src: "photo-1.jpg"
    alt: "Slide on safety challenges in reinforcement learning: exploration risk, actuator limits and formal safety."
  - src: "photo-2.jpg"
    alt: "Slide on training performance and convergence, with learning curves and notes for each method."
videos: []
overview: >-
  A Deep Reinforcement Learning course project combining Control Barrier Functions and PPO in Isaac Lab while modeling non-ideal cart-pole dynamics for sim-to-real fidelity.
whatIDid:
  - "Modeled motor saturation, voltage sag, gear backlash and track constraints."
  - "Compared Post-CBF and Reward-CBF approaches."
  - "Used jerk-regularized reward shaping, which gave the best safety–performance trade-off in the comparison."
  - "Evaluated episode length, safety violation rate, hardware stress and task performance."
process:
  - "Added actuator and track non-idealities to the simulated cart-pole."
  - "Compared safety and performance across the CBF-RL approaches and evaluation measures."
learning: "[TODO: Add what I learned.]"
---
