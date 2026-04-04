# Instructions — SaaS Financial Architecture Model

This document covers everything you need to set up, use, customize, and extend the SaaS Financial Architecture Model.

---

## Table of contents

1. [Prerequisites](#1-prerequisites)
2. [Installation](#2-installation)
3. [Using the dashboard](#3-using-the-dashboard)
4. [Using the Excel model](#4-using-the-excel-model)
5. [Input mask reference](#5-input-mask-reference)
6. [KPI definitions](#6-kpi-definitions)
7. [Customization guide](#7-customization-guide)
8. [Publishing to GitHub Pages](#8-publishing-to-github-pages)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

**For the dashboard (HTML file)**
- Any modern browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- No Node.js, no npm, no build tools required

**For the Excel model**
- Microsoft Excel 2016 or later (recommended)
- LibreOffice Calc 7.0+ (compatible, minor formatting differences)
- Google Sheets (import works; some advanced formatting may differ)

**For GitHub Pages hosting**
- A GitHub account (free)
- Git installed locally (optional — you can use GitHub's web UI)

---

## 2. Installation

### Option A — Clone via Git

```bash
git clone https://github.com/YOUR_USERNAME/saas-finance-architecture.git
cd saas-finance-architecture
```

### Option B — Download ZIP

1. Click **Code → Download ZIP** on the GitHub repository page
2. Unzip to a local folder
3. Open `dashboard/index.html` in your browser

### Option C — Fork on GitHub

1. Click **Fork** in the top-right of the repository
2. The forked copy appears in your GitHub account
3. Enable GitHub Pages (see [Section 8](#8-publishing-to-github-pages)) for an instant live URL

---

## 3. Using the dashboard

Open `dashboard/index.html` in any browser. No internet connection required — all assets are self-contained.

### Navigation

The dashboard has five tabs accessible from the top navigation bar:

| Tab | What you will find |
|---|---|
| **Overview** | Collapsible three-branch driver taxonomy. Click a branch to expand sub-categories. Click any leaf node to see its definition. |
| **Mind map** | Full visual hierarchy rendered as an SVG diagram. Nodes are color-coded by category. |
| **P&L waterfall** | Benchmark income statement for a $10M ARR SaaS company. Bars show each line as a percentage of revenue. |
| **KPI scorecard** | Twelve core SaaS metrics with benchmark ranges. Green = healthy, amber = watch, red = concern. |
| **Input mask** | Editable assumption fields. Change any value and press **Recalculate** to update the P&L and KPIs live. |

### Input mask — how it works

The input mask contains editable fields grouped by category:

- **Revenue drivers** — enter your ARR, customer count, churn rate, and expansion rate
- **COGS assumptions** — hosting %, support headcount, PS margin
- **Sales & marketing** — AE headcount, OTE, commission rate, marketing spend
- **R&D** — engineering headcount and average fully-loaded cost
- **G&A** — headcount, legal/accounting fees, office costs

After editing any field, the P&L waterfall and KPI scorecard update automatically. No save step is needed — state is held in the browser session.

> **Tip**: Use the input mask to model scenarios. Set conservative values, note the KPIs, then set aggressive values to see the range of outcomes.

---

## 4. Using the Excel model

Open `model/SaaS_Financial_Model.xlsx` in Excel or LibreOffice.

### Sheet overview

```
Tab 1: Input Mask          ← Start here. Edit yellow cells.
Tab 2: Customer Inputs     ← Add/edit customer rows.
Tab 3: P&L                 ← Read-only output. Do not edit formulas.
Tab 4: KPI Dashboard       ← Read-only output. Do not edit formulas.
```

### Editing workflow

1. Open the **Input Mask** sheet
2. Edit only the cells with **blue text** (hardcoded inputs)
3. Yellow-highlighted cells are key assumptions — review these first
4. The **P&L** and **KPI Dashboard** sheets update automatically via cross-sheet formulas

### Adding customers

1. Go to the **Customer Inputs** sheet
2. Copy the last data row (right-click → Insert row above the TOTAL row)
3. Fill in: Customer name, Industry, Year 1 ARR, Expansion, Churn, NRR, and Year 2 equivalents
4. The TOTAL row auto-expands — verify the SUM range includes your new row
5. The P&L sheet pulls from the TOTAL row automatically

### Formula color coding

| Color | Meaning | Action |
|---|---|---|
| 🔵 Blue text | Hardcoded input | Edit freely |
| ⚫ Black text | Calculated formula | Do not edit |
| 🟢 Green text | Cross-sheet link | Do not edit |
| 🟡 Yellow background | Key driver | Review and confirm |

### Protected cells

Cells with black or green text contain formulas. If you accidentally overwrite one:
1. Press `Ctrl+Z` (Undo) immediately
2. If already saved: the formula is documented in the `INSTRUCTIONS.md` — re-enter it manually

---

## 5. Input mask reference

### Revenue drivers

| Driver | Unit | Typical range | Notes |
|---|---|---|---|
| Starting customers | # | 10–500 | Customers at period start |
| New customers added | # | 10–200/yr | Net new logos signed |
| Churned customers | # | 1–50/yr | Logos lost during period |
| Avg ARR per customer (new) | $ | $5K–$100K | Annual contract value |
| Avg ARR per customer (existing) | $ | $5K–$100K | Blended book |
| Expansion MRR % of ARR | % | 3–15% | Upsell and cross-sell rate |
| Gross churn rate (revenue) | % | 2–15% | % ARR lost from churn |

### COGS assumptions

| Driver | Unit | Typical range | Notes |
|---|---|---|---|
| Hosting / DevOps | % of revenue | 5–12% | AWS/Azure/GCP + CDN |
| Technical support headcount | # FTEs | 1 per 50–100 customers | Fully loaded |
| Avg support staff cost | $ | $60K–$90K | Annual, fully burdened |
| Professional services margin | % | 15–35% | Gross margin on PS revenue |

### Sales and marketing

| Driver | Unit | Typical range | Notes |
|---|---|---|---|
| Sales headcount (AEs) | # | 1 per $300K–$700K ARR | Quota-carrying reps |
| Avg AE OTE | $ | $120K–$200K | On-target earnings |
| Sales commission rate | % | 8–12% | % of new bookings |
| Marketing spend | $ | 10–20% of revenue | Demand gen + brand |
| Lead-to-customer conv. rate | % | 1–5% | MQL → Closed-won |

### R&D

| Driver | Unit | Typical range | Notes |
|---|---|---|---|
| Engineering headcount | # FTEs | Scales with product complexity | |
| Avg engineer cost | $ | $110K–$160K | Fully burdened |
| R&D other costs | $ | $50K–$200K | Tools, IP, testing |

### G&A

| Driver | Unit | Typical range | Notes |
|---|---|---|---|
| G&A headcount | # FTEs | 1 per 8–15 employees | Finance, HR, Legal |
| Avg G&A staff cost | $ | $90K–$130K | Fully burdened |
| Legal and accounting | $ | $40K–$150K | External advisors |
| Office and facilities | $ | $80K–$200K | Rent + utilities |

---

## 6. KPI definitions

### Revenue and growth

**ARR (Annual Recurring Revenue)**
Sum of all active subscription contracts annualized. ARR = MRR × 12. Excludes one-time fees and professional services.

**MRR (Monthly Recurring Revenue)**
ARR ÷ 12. The month-by-month heartbeat of a subscription business.

**ARR Growth Rate**
`(Ending ARR - Beginning ARR) / Beginning ARR`. Target: >30% for growth stage; >20% at scale.

**ARPA (Average Revenue Per Account)**
`ARR / Total customers`. Tracks whether you are moving up-market or down-market over time.

**ACV (Annual Contract Value)**
Value of a single customer contract per year. Higher ACV = enterprise motion; lower = SMB or PLG.

### Retention and churn

**Gross Revenue Churn**
`Revenue lost from churned and contracted customers / Beginning ARR`. Excludes expansion. Best-in-class: <3% annual.

**Net Revenue Retention (NRR)**
`(Beginning ARR + Expansion - Contraction - Churn) / Beginning ARR`. If NRR >100%, you grow from existing customers alone. Target: >110%.

**Logo Churn Rate**
`Churned customers / Beginning customer count`. Counts logos, not revenue. A proxy for product-market fit.

### Unit economics

**CAC (Customer Acquisition Cost)**
`Total Sales & Marketing spend / New customers acquired`. Includes fully burdened S&M headcount.

**LTV (Customer Lifetime Value)**
`ARPA × Gross Margin % / Gross Churn Rate`. The expected revenue contribution of one customer over their lifetime.

**LTV / CAC Ratio**
`LTV / CAC`. Measures return on sales and marketing investment. Target: >3x. Excellent: >5x.

**CAC Payback Period**
`CAC / (ARPA × Gross Margin %)`. Months to recover acquisition cost. Target: <18 months.

### Efficiency

**Rule of 40**
`ARR Growth Rate % + EBITDA Margin %`. A composite health score. >40 is healthy at any stage.

**Magic Number**
`Net new ARR / Prior quarter S&M spend`. >0.75 means S&M spend is efficient. <0.5 means slow down and fix retention first.

**Sales Efficiency Ratio**
`New ARR added / S&M spend`. Variant of magic number on an annual basis.

**Pipeline Coverage Ratio**
`Total qualified pipeline / Quarterly ARR target`. Should be 3–4x to reliably make quota.

### Margins

**Gross Margin**
`(Revenue - COGS) / Revenue`. SaaS benchmark: 70–80%+. Below 60% often signals excessive hosting or support costs.

**EBITDA Margin**
`EBITDA / Revenue`. Measures operating leverage. Early SaaS is often -20% to -40%; scale target is >15%.

---

## 7. Customization guide

### Adding new driver categories

1. Open `dashboard/index.html` in a text editor
2. Locate the `arch` JavaScript object near the bottom of the `<script>` block
3. Add a new top-level key with a `color` and `children` object following the existing pattern:

```javascript
"My new category": {
  color: "c-teal",
  children: {
    "Sub-category name": ["Metric A", "Metric B", "Metric C"]
  }
}
```

4. Add entries to the `detailData` object for any new leaf nodes you want to have popup definitions

### Changing benchmark values

Edit the `kpis1` and `kpis2` arrays in the dashboard script:

```javascript
{ label: "Net Revenue Retention", value: "115%", status: "good", bench: "Best-in-class >120%" },
```

- `status` accepts `"good"`, `"warn"`, or `"bad"` — controls the color indicator

### Changing the P&L waterfall

Edit the `items` array in the `buildWaterfall()` function. Each item has:
- `label` — line item name
- `val` — value in thousands (positive = inflow, negative = outflow)
- `pct` — percentage of revenue (used for bar width)
- `type` — `"total"`, `"sub"`, or `"neg"`

### Styling

The dashboard uses CSS custom properties. Override any variable at the top of the `<style>` block:

```css
:root {
  --primary: #1A2B4A;
  --accent: #2E5FA3;
  --font-display: 'Your Font', sans-serif;
}
```

---

## 8. Publishing to GitHub Pages

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "Initial commit — SaaS financial architecture"
git push origin main
```

### Step 2 — Enable Pages

1. Go to your repository on GitHub
2. Click **Settings** → scroll to **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Select **main** branch and **/ (root)** folder
5. Click **Save**

### Step 3 — Access your live dashboard

After 1–2 minutes, your dashboard will be live at:

```
https://YOUR_USERNAME.github.io/saas-finance-architecture/dashboard/
```

### Custom domain (optional)

1. Add a `CNAME` file to the repo root containing your domain (e.g. `finance.yourcompany.com`)
2. In your DNS provider, add a CNAME record pointing to `YOUR_USERNAME.github.io`
3. In GitHub Pages settings, enter your custom domain and enable HTTPS

---

## 9. Troubleshooting

**Dashboard shows blank page**
- Open the browser console (`F12`) and check for errors
- Ensure you are opening the file with `file://` or a local server — some browsers restrict local JS
- Try: `npx serve dashboard/` then open `http://localhost:3000`

**Excel formulas show #REF! errors**
- Do not delete any row in the Input Mask or Customer Inputs sheets
- If rows were accidentally deleted, restore from the original file and re-enter your data

**Customer Inputs TOTAL row does not include my new row**
- Click the TOTAL row formula cells (columns C through K) and extend the SUM range to include your new rows

**GitHub Pages not updating after a push**
- Pages can take 1–5 minutes to rebuild after a push
- Check the **Actions** tab in your repository for build status
- Try a hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

**KPIs not updating in the dashboard after input changes**
- Click the **Recalculate** button in the Input Mask view
- If still not updating, check the browser console for JavaScript errors

---

*For questions, open an issue on GitHub or submit a pull request with improvements.*
