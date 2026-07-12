# AGENTS.md

# AI Investment Research Platform

## Purpose

This repository contains an AI-powered Investment Research Platform built with Next.js, LangGraph.js, and modern frontend tooling.

Before making any code changes, read the following documents in order:

1. PRODUCT_SPEC.md
2. ANTIGRAVITY_SPEC.md

The Product Specification defines the product behavior, UX, and design language.

The Antigravity Specification defines implementation architecture, engineering constraints, persistence, streaming, APIs, and build order.

These documents are the source of truth.

---

# Development Principles

When working in this repository:

- Extend existing functionality instead of rewriting it.
- Preserve the existing architecture.
- Do not refactor code unless explicitly instructed.
- Follow the Product Specification for all UI decisions.
- Follow the Antigravity Specification for all implementation decisions.
- Keep business logic separated from UI components.
- Keep financial data retrieval independent from the LangGraph workflow.
- Keep API routes separate from `lib/agent/`.

---

# Existing Foundation

The following components already exist and should not be replaced:

- Home page
- LangGraph workflow
- Research node
- Analysis node
- Decision node
- Research API route
- Basic investment report

Build around these components.

---

# Technology Stack

- Next.js 16 (App Router)
- JavaScript (No TypeScript)
- Tailwind CSS v4
- LangGraph.js
- LangChain
- Gemini 2.5 Flash
- SQLite (Development)
- Turso (Production)
- shadcn/ui
- Recharts

---

# Coding Standards

- Prefer reusable components.
- Keep files focused on a single responsibility.
- Avoid unnecessary abstractions.
- Do not introduce additional libraries without approval.
- Follow existing naming conventions.
- Keep components small and composable.

---

# Constraints

Do not:

- Rewrite existing LangGraph logic.
- Change the Product Specification.
- Change the design language.
- Introduce authentication.
- Introduce additional databases.
- Add features outside the specifications without approval.

If a requested task conflicts with the specifications, ask for clarification instead of making assumptions.