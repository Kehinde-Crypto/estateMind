# EstateMind

## Overview

EstateMind is an AI-powered autonomous wallet that discovers, evaluates, reserves, and pays for accommodations using USDC without requiring manual intervention.

The platform leverages AI agents, blockchain technology, and stablecoin payments to enable autonomous commerce within the travel and accommodation industry.

Users define their preferences such as budget, location, stay duration, internet requirements, and proximity to attractions. EstateMind's agents analyze available properties, recommend the best options, manage spending decisions, and execute USDC payments autonomously.

---

## Problem Statement

Finding suitable accommodations requires users to manually:

* Search multiple platforms
* Compare properties
* Evaluate prices
* Assess amenities
* Make payments
* Track bookings

This process becomes increasingly difficult when users need fast decisions for time-sensitive reservations.

EstateMind solves this by introducing autonomous agents capable of making accommodation booking decisions on behalf of users.

---

## Vision

To become the autonomous financial and decision-making layer for accommodation discovery, booking, and settlement.

Future versions will support:

* Real Estate Investment
* Tokenized Property Ownership
* Property Lending
* Agent-to-Agent Commerce
* Knowledge Graph Reasoning
* Autonomous Portfolio Management

---

## Core Features

### Recommendation Agent

Evaluates properties based on:

* Budget
* Location
* WiFi Speed
* Distance to Beach
* Rating
* Availability

Returns ranked recommendations.

---

### Treasury Agent

Manages spending rules.

Responsibilities:

* Verify sufficient funds
* Approve or reject bookings
* Enforce budget constraints

---

### Settlement Agent

Handles:

* USDC Transfers
* Booking Settlement
* Transaction Tracking
* Payment Confirmation

---

### AI Explanation Layer

Uses Grok to explain:

* Why a property was selected
* Tradeoffs between options
* Spending decisions

---

## Technology Stack

### Frontend

* Next.js
* TypeScript
* TailwindCSS

### Backend

* FastAPI
* Python

### Database

* SQLite (MVP)
* PostgreSQL (Future)

### Blockchain

* Arc
* USDC
* Circle Wallets
* Circle Contracts
* Paymaster

### AI

* Grok API

---

## MVP Scope

Version 1 will support:

1. Property Discovery
2. Property Recommendation
3. Agent Scoring
4. Booking Creation
5. Treasury Approval
6. Simulated Settlement

Version 2:

1. Circle Wallet Integration
2. USDC Payments
3. Blockchain Receipts

Version 3:

1. Knowledge Graph
2. Agent-to-Agent Commerce
3. Autonomous Real Estate Investing

---

## Recommendation Scoring

### Budget Match

+40 Points

### Location Match

+15 Points

### WiFi Match

+15 Points

### Beach Distance Match

+10 Points

### Rating

0-20 Points

### Availability

+10 Points

Maximum Score: 110

---

## Project Structure

estate-mind/

frontend/

backend/

data/

docs/

README.md

---

## Team

Founder & Lead Engineer:

Kehinde Browns


┌────────────────────┐
│      User          │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   Next.js Client   │
│                    │
│ Preferences Form   │
│ Recommendations    │
│ Booking Screen     │
│ Wallet Dashboard   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│      FastAPI       │
│     API Layer      │
└─────────┬──────────┘
          │
 ┌────────┼─────────┐
 ▼        ▼         ▼

Recommendation Treasury Settlement
Agent         Agent      Agent

 ▼        ▼         ▼

Property   Wallet     Circle
Engine     Engine     Integration

 ▼
Properties.json

 ▼
SQLite

Backend
backend/

agents/
│
├── recommendation_agent.py
├── treasury_agent.py
├── settlement_agent.py

api/
│
├── recommendation.py
├── booking.py
├── payment.py

models/
│
├── property.py
├── booking.py
├── preference.py

services/
│
├── property_service.py
├── booking_service.py
├── wallet_service.py

data/
│
└── properties.json

main.py
pip install fastapi
pip install uvicorn
pip install pydantic
pip install python-dotenv
pip install httpx
pip install sqlalchemy
pip install aiosqlite
pip install uvicorn

| Dependency    | Purpose                           |
| ------------- | --------------------------------- |
| FastAPI       | API framework                     |
| Uvicorn       | FastAPI server                    |
| Pydantic      | Request/Response validation       |
| python-dotenv | Environment variables             |
| HTTPX         | API requests (Grok, Circle later) |
| SQLAlchemy    | Database ORM                      |
| aiosqlite     | SQLite support                    |

next
pip freeze > requirements.txt