# AI Investment Research Agent

## Product Overview

The AI Investment Research Agent is a modern AI-powered web application that enables users to generate comprehensive investment research reports for publicly traded companies using Large Language Models.

Unlike traditional investment platforms, the application does not require user accounts or server-side authentication. Instead, users securely provide their own OpenAI API key, allowing the application to remain lightweight, privacy-focused, and completely serverless.

The objective is to deliver a polished, professional research workflow that feels similar to Bloomberg Terminal or institutional research software while remaining simple enough for recruiters and reviewers to use immediately.

---

# Product Goals

The application should prioritize:

- A premium and modern user experience.
- Minimal friction from landing page to report generation.
- Secure handling of API keys without backend storage.
- Interactive AI workflow visualization.
- Easily scannable investment reports.
- Responsive design across desktop and mobile.
- Fast perceived performance through thoughtful loading states.

---

# User Journey

The intended product flow is:

Landing/Login
↓

API Key Validation
↓

Research Dashboard
↓

Company Search
↓

Agent Workspace
↓

Investment Thesis Report
↓

Re-run Analysis or Export Report

The entire experience should feel seamless, requiring only one input before the user begins researching companies.

---

# Functional Requirements

## 1. Login Page — API Key Gateway

### Purpose

Rather than implementing traditional username/password authentication, this page serves as a secure client-side gateway where users provide their personal OpenAI API key.

The key is used only during the active browser session and is never transmitted to or stored in an external database.

This design intentionally keeps the architecture lightweight while demonstrating security-conscious product thinking.

---

## UI Layout

### Main Container

Display a centered geometric card with generous spacing.

The design should follow a premium dark theme using subtle gradients, glassmorphism, soft shadows, and rounded corners.

---

### Branding Header

Display:

# Investment Research Portal

Below the title include:

> Powered by LangChain & Next.js

The subtitle should appear smaller with muted typography to establish a modern technical identity.

---

### API Key Input

Provide a password-type input field.

Placeholder:

Enter your OpenAI API Key (sk-...)

The key should remain visually hidden while typing.

Include a small icon indicating secure entry.

---

### Remember Me

Provide a checkbox or toggle labelled:

Remember my API Key

When enabled, store the key in localStorage.

Otherwise, keep the key only for the current browser session.

---

### Primary Call-To-Action

Large high-contrast button:

Initialize Agent Workspace

Hover animations should provide immediate feedback.

---

### Security Notice

Display a subtle informational caption beneath the input.

Example:

"Your API key is stored only inside your browser and is sent directly to the AI orchestration layer. It is never stored in an external database."

This should reassure users without drawing excessive attention.

---

### Validation

Before navigation:

Validate the API key using a regex.

Example:

Must begin with:

sk-

If validation fails:

- Shake the input slightly.
- Highlight the border in red.
- Display an inline error message.
- Prevent navigation.

---

# 2. Research Dashboard

## Purpose

This page acts as the central workspace where users launch new investment research.

It should immediately communicate simplicity and speed while surfacing previous research conducted during the current browser history.

---

## Hero Search

Place a large centered search bar as the primary focus.

Supported inputs:

- Company Name
- Stock Ticker

Examples:

Apple

Microsoft

Tesla

AAPL

TSLA

NVDA

---

## Quick Search Chips

Directly below the search bar display clickable badges for popular companies.

Suggested examples:

- TSLA
- NVDA
- META
- AAPL
- INFY
- GOOGL

Selecting one should instantly populate the search input.

---

## Recent Research

Display a responsive table showing previous searches.

The data should be sourced entirely from localStorage.

Columns:

- Company
- Ticker
- Research Date
- Final Verdict

This demonstrates thoughtful client-side state management without requiring database infrastructure.

Clicking an existing row should reopen the associated report if available.

---

# 3. Agent Workspace

## Purpose

While the backend LangGraph workflow executes, the interface should simulate an intelligent AI reasoning process rather than displaying a generic loading spinner.

This increases perceived responsiveness while educating users about the agent's internal workflow.

---

## Status Progress Card

Display a centered progress checklist.

Each step should transition from loading to completed with animated checkmarks.

Suggested sequence:

✓ Extracting corporate ticker...

✓ Gathering latest financial news...

✓ Collecting market sentiment...

✓ Evaluating bull vs bear arguments...

✓ Generating investment thesis...

✓ Preparing final report...

Only one step should animate at a time.

---

## Skeleton Layout

Render placeholder components matching the final report layout.

Use pulse animations for:

- Verdict banner
- Executive summary
- Metadata cards
- Bull Case
- Bear Case
- Action buttons

This minimizes cumulative layout shift and creates a smoother experience.

---

# 4. Investment Thesis Report

## Purpose

Present the AI-generated investment research in a highly structured, professional format that is easy to scan.

The report should resemble institutional equity research rather than raw AI output.

---

## Verdict Banner

A full-width header displaying the final recommendation.

Possible states:

INVEST

PASS

Use strong semantic colors.

INVEST:

Emerald Green

PASS:

Muted Crimson

Include a confidence score if available.

---

## Executive Summary

Generate a concise TL;DR consisting of two or three sentences.

This should summarize the primary investment rationale before users explore detailed analysis.

---

## Metadata

Display quick-access tags containing:

- Company Name
- Stock Ticker
- Industry Sector
- Research Timestamp

These should appear immediately beneath the summary.

---

## Bull vs Bear Analysis

Present a balanced two-column layout.

### Bull Case

Highlight positive investment catalysts including:

- Competitive advantages
- Revenue growth
- Market expansion
- Strong fundamentals
- Product innovation
- Industry tailwinds

Use green accent icons.

---

### Bear Case

Highlight investment risks including:

- Competition
- Regulatory pressure
- High valuation
- Economic uncertainty
- Execution risk
- Market volatility

Use red accent icons.

---

## Action Toolbar

Position utility buttons in the upper-right corner.

Actions:

### Re-run Analysis

Starts a completely new research cycle.

### Print Report

Uses browser print styles so the report exports cleanly to PDF.

---

# UI & UX Guidelines

## Theme

Modern Dark Mode

Professional financial dashboard aesthetic.

Inspired by institutional trading platforms while maintaining simplicity.

---

## Color Palette

Background:

Near Black

Surface:

Dark Gray

Primary:

Emerald Green

Secondary:

Electric Blue

Warning:

Amber

Danger:

Muted Crimson

---

## Typography

Headings:

Bold

Body:

Medium weight

Metadata:

Muted small text

Numbers:

Monospaced where appropriate

---

## Components

- Glassmorphism cards
- Rounded corners
- Soft shadows
- Thin borders
- Consistent spacing
- Responsive grids

---

## Animations

Use subtle micro-interactions throughout the application.

Examples:

- Button hover elevation
- Smooth page transitions
- Input focus glow
- Card fade-ins
- Skeleton loading
- Animated checklists
- Progress transitions

Animations should enhance usability rather than distract.

---

# Technical Stack

Framework:
Next.js

Styling:
Tailwind CSS

UI Components:
shadcn/ui

State Management:
React Context + localStorage

AI Orchestration:
LangChain + LangGraph

Model Provider:
OpenAI

Deployment:
Vercel

---

# Non-Functional Requirements

- Responsive across desktop, tablet, and mobile.
- Accessible color contrast.
- Fast initial load.
- Graceful error handling.
- No backend database.
- No user authentication.
- API keys never leave the client except for AI requests.
- Clean print-friendly PDF styling.

---

# Acceptance Criteria

- User can securely enter an API key.
- Invalid keys display inline validation errors.
- Dashboard loads after successful validation.
- Users can search by company name or ticker.
- Loading workspace visualizes the AI workflow.
- Final investment report displays structured research.
- Bull and Bear analysis appear separately.
- Previous searches persist using localStorage.
- Reports can be regenerated.
- Reports can be exported using browser print.
- Application functions without requiring user accounts or a database.