
# SaaS Financial Architecture Model

> A complete, open-source SaaS financial architecture — interactive dashboard, P&L model, KPI framework, and driver taxonomy — ready to fork and adapt.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## What this is

This repository provides a **structured financial architecture for SaaS companies** — from early-stage startups to growth-stage businesses. It covers:

- A **revenue and cost driver taxonomy** derived from real SaaS P&L structures
- An **interactive HTML dashboard** with mind map, P&L waterfall, KPI scorecard, and input mask
- A **pre-built Excel financial model** (`SaaS_Financial_Model.xlsx`) with Year 1 / Year 2 projections
- **Customer-level input tables** for per-logo ARR, expansion, and churn tracking
- Industry-standard **benchmark ranges** for every major SaaS metric

This is not a consulting template or a locked-down tool — it is a living reference that developers, founders, CFOs, and analysts can fork, extend, and adapt.

---

## Repository structure

```
saas-finance-architecture/
│
├── README.md                        ← You are here
├── INSTRUCTIONS.md                  ← Setup and usage guide
│
├── dashboard/
│   └── index.html                   ← Interactive dashboard (zero dependencies)
│
├── model/
│   └── SaaS_Financial_Model.xlsx    ← Excel model (Input Mask, P&L, Customer Inputs, KPIs)
│
├── data/
│   └── benchmarks.json              ← KPI benchmarks and driver ranges (machine-readable)
│
└── docs/
    ├── architecture-overview.png    ← Mind map export
    └── kpi-definitions.md           ← Definitions for every metric
```

---

## Quick start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/saas-finance-architecture.git
cd saas-finance-architecture

# 2. Open the dashboard (no build step needed)
open dashboard/index.html

# 3. Or serve it locally
npx serve dashboard/
# → http://localhost:3000
```

The dashboard is a **single self-contained HTML file** — no npm, no bundler, no framework. Open it in any modern browser.

---

## Dashboard views

| View | Description |
|---|---|
| **Overview** | Collapsible tree of the full driver taxonomy (Revenue → COGS → OpEx → HR) |
| **Mind map** | Visual hierarchy of all financial architecture nodes |
| **P&L waterfall** | Benchmark P&L from Revenue → Gross Profit → EBITDA → Net Income |
| **KPI scorecard** | 12 core SaaS KPIs with benchmark ranges and status indicators |
| **Input mask** | Editable assumption panel — change inputs and watch KPIs update live |

---

## Architecture taxonomy

The model is organized around three pillars:

### 1. Revenue and operational drivers
| Sub-category | Key metrics |
|---|---|
| Customer and revenue base | MRR/ARR, pricing tiers, new/expansion MRR, churn rate, ARPA, ACV |
| Sales and marketing pipeline | Pipeline velocity, win rates, conversion rates, lead generation |
| Sales capacity | Headcount, quotas, ramp-up schedules, quota attainment |
| External and seasonal | Seasonality multipliers, macroeconomic factors |

### 2. Cost types and categories
| Sub-category | Key line items |
|---|---|
| COGS | Technical support, professional services, customer success, DevOps/hosting, hardware, software licenses, R&D amortization |
| Operating expenses | R&D, sales & commissions, marketing, G&A, office & tools |
| Non-operating | Interest expense, corporate taxes |

### 3. Fully burdened personnel costs
Base salaries · Payroll taxes · Employee benefits · Travel & training · Internal software subscriptions

---

## Excel model highlights

The Excel workbook (`model/SaaS_Financial_Model.xlsx`) contains four sheets:

| Sheet | Contents |
|---|---|
| **Input Mask** | 32 assumption drivers for Year 1 & Year 2 with YoY change column |
| **Customer Inputs** | 20 sample customers with per-logo ARR, expansion, churn, NRR |
| **P&L** | Full income statement from Revenue → Net Income with % of revenue |
| **KPI Dashboard** | 8 KPI cards + P&L summary + ARR bridge waterfall |

Color coding follows the investment banking standard:
- 🔵 **Blue text** — hardcoded inputs (you change these)
- ⚫ **Black text** — formulas (calculated automatically)
- 🟢 **Green text** — cross-sheet links
- 🟡 **Yellow background** — key assumptions requiring review

---

## KPI benchmarks

| Metric | Early-stage | Growth | Scale |
|---|---|---|---|
| ARR growth YoY | >80% | >40% | >20% |
| Gross margin | >65% | >72% | >78% |
| Net Revenue Retention | >100% | >110% | >120% |
| Gross churn (annual) | <10% | <7% | <3% |
| CAC payback period | <24 mo | <18 mo | <12 mo |
| LTV / CAC | >3x | >4x | >5x |
| Rule of 40 | >20 | >35 | >40 |
| EBITDA margin | Negative | 0–10% | >15% |

---

## Customization

**Changing assumptions**: Edit the yellow-highlighted cells in the Input Mask sheet or use the dashboard's input panel. All P&L lines and KPIs update automatically via Excel formulas.

**Adding customers**: Add rows to the Customer Inputs sheet — the TOTAL row formula adjusts automatically.

**Extending the taxonomy**: Edit `data/benchmarks.json` and update `dashboard/index.html` to add new driver categories or leaf nodes.

**Embedding the dashboard**: The `index.html` file can be served as a GitHub Pages site with zero configuration:
1. Go to **Settings → Pages** in your fork
2. Set source to **main branch / root** or **/docs**
3. Your dashboard is live at `https://YOUR_USERNAME.github.io/saas-finance-architecture/`

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

Areas especially welcomed:
- Additional industry benchmark data (vertical SaaS, PLG, enterprise)
- Monthly/quarterly view in the Excel model
- Additional KPI definitions in `docs/kpi-definitions.md`
- Translations of the dashboard UI

---

## License

MIT — free to use, fork, and modify for commercial and non-commercial purposes.

---

## Acknowledgements

Architecture taxonomy based on: *SaaS Financial Architecture: Drivers and Cost Structures*. KPI benchmarks sourced from public SaaS company filings, OpenView Partners SaaS Benchmarks, and KeyBanc Capital Markets SaaS Survey.

---

*Built with care for founders, operators, and finance teams who want clarity over complexity.*
