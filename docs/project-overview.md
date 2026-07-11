# EstateMind

## Overview

EstateMind is an AI-powered autonomous wallet that discovers, evaluates, reserves, and pays for accommodations using USDC without requiring manual intervention. It leverages AI agents, blockchain technology (simulated for MVP), and stablecoin payments to enable autonomous commerce within the travel and accommodation industry.

## Goals

1. **Autonomous Discovery & Evaluation:** Enable users to find the best properties based on their specific preferences (budget, location, WiFi speed, etc.) without manual search.
2. **Automated Financial Gatekeeping:** Ensure all bookings strictly adhere to the user's budget and wallet constraints before execution.
3. **Frictionless Settlement (Simulated MVP):** Provide a seamless mock payment flow using USDC to demonstrate the autonomous wallet concept.

## Core User Flow

1. User defines accommodation preferences (budget, location, WiFi, beach distance, duration).
2. Recommendation Agent scores and ranks available properties, returning the top options with explanations.
3. User selects a recommended property to book.
4. Treasury Agent validates the booking against the budget and wallet balance.
5. Settlement Agent executes a simulated USDC payment and records the transaction.
6. User receives booking confirmation and updated wallet balance.

## Features

### Property Discovery & Recommendation
- Browse available properties.
- AI-driven property scoring based on a 110-point system.
- Transparent score breakdown and AI explanations for recommendations.

### Autonomous Booking & Treasury
- Automated booking creation.
- Treasury Agent strictly enforces budget constraints and wallet balances.

### Simulated Wallet & Settlement
- Mock wallet with initial USDC balance.
- Simulated transaction execution and history tracking.

## Scope

### In Scope (MVP V1)
- Property Discovery
- Property Recommendation & Agent Scoring
- Booking Creation
- Treasury Approval
- Simulated Settlement (Mock USDC wallet)

### Out of Scope (MVP V1)
- Circle Wallet Integration (real wallets)
- Real USDC Payments on blockchain
- Blockchain Receipts
- Knowledge Graph Reasoning
- Agent-to-Agent Commerce
- Real Estate Investing Features

## Success Criteria

1. A user can input preferences and receive an accurately scored and ranked list of properties.
2. The system successfully blocks any booking attempt that exceeds the defined budget or wallet balance.
3. A successful booking results in a simulated USDC deduction and a recorded transaction in the mock wallet.
