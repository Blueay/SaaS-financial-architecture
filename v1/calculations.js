/**
 * SaaS Financial Architecture — Calculation Engine
 * =================================================
 * Pure JavaScript. No dependencies. Works in browser and Node.js.
 *
 * Usage (browser):
 *   <script src="calculations.js"></script>
 *   const result = SaaSCalc.run(inputs);
 *
 * Usage (Node.js):
 *   const { SaaSCalc } = require('./calculations.js');
 *   const result = SaaSCalc.run(inputs);
 *
 * All monetary values are in USD (actual dollars, not thousands).
 * All rate/percentage inputs are in decimal form (e.g. 0.08 = 8%).
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();           // Node.js / CommonJS
  } else {
    root.SaaSCalc = factory();            // Browser global
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // ─────────────────────────────────────────────────────────────────────────
  // DEFAULT INPUTS  (matches Input Mask sheet in SaaS_Financial_Model.xlsx)
  // ─────────────────────────────────────────────────────────────────────────
  const DEFAULTS = {
    // ── Revenue drivers ──────────────────────────────────────────────────
    cust_start:   50,        // # customers at period start
    cust_new:    120,        // # new logos added during year
    cust_churn:   10,        // # logos churned during year
    arpa_new:  24000,        // avg ARR per new customer ($)
    arpa_exist:22000,        // avg ARR per existing customer ($)
    exp_rate:   0.05,        // expansion MRR as % of ARR
    churn_rate: 0.08,        // gross revenue churn rate

    // ── COGS ─────────────────────────────────────────────────────────────
    hosting_pct:  0.08,      // DevOps/hosting as % of revenue
    sup_headcount: 5,        // support FTE count
    sup_cost_per:75000,      // fully loaded annual cost per support FTE
    ps_rev_pct:   0.08,      // professional services revenue as % of total rev
    ps_margin:    0.22,      // gross margin on PS revenue

    // ── Sales & marketing ─────────────────────────────────────────────────
    ae_headcount:  8,        // account executive FTE count
    ae_ote:    140000,       // on-target earnings per AE (fully loaded)
    comm_rate:    0.10,      // sales commission rate (% of new bookings)
    mktg_spend:600000,       // marketing spend ($)
    conv_rate:    0.025,     // lead-to-customer conversion rate

    // ── R&D ───────────────────────────────────────────────────────────────
    eng_headcount: 12,       // engineering FTE count
    eng_cost_per:130000,     // fully loaded annual cost per engineer
    rd_other:    80000,      // other R&D costs (tools, IP, testing)

    // ── G&A ───────────────────────────────────────────────────────────────
    ga_headcount:  4,        // G&A FTE count
    ga_cost_per: 110000,     // fully loaded annual cost per G&A FTE
    legal_fees:  60000,      // external legal & accounting
    office_cost: 120000,     // rent, utilities, facilities

    // ── Below-the-line ────────────────────────────────────────────────────
    da_pct:       0.02,      // D&A as % of revenue
    interest:    50000,      // net interest expense ($)
    tax_rate:     0.21,      // effective corporate tax rate

    // ── Balance sheet / cash ──────────────────────────────────────────────
    dso:            35,      // days sales outstanding
    capex_pct:    0.02,      // capex as % of revenue
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  function safe(n)       { return isFinite(n) && !isNaN(n) ? n : 0; }
  function pct(n, d)     { return safe(d) !== 0 ? safe(n) / safe(d) : 0; }
  function round2(n)     { return Math.round(safe(n) * 100) / 100; }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  // ─────────────────────────────────────────────────────────────────────────
  // CORE CALCULATION — single period
  // ─────────────────────────────────────────────────────────────────────────
  function calcPeriod(inp) {
    const i = Object.assign({}, DEFAULTS, inp);

    // ── Customers ─────────────────────────────────────────────────────────
    const cust_end    = i.cust_start + i.cust_new - i.cust_churn;
    const cust_avg    = (i.cust_start + cust_end) / 2;

    // ── Revenue ───────────────────────────────────────────────────────────
    const rev_sub     = i.cust_start  * i.arpa_exist
                      + i.cust_new    * i.arpa_new;   // subscription ARR
    const rev_exp     = rev_sub * i.exp_rate;          // expansion MRR (annualized)
    const rev_churn   = rev_sub * i.churn_rate;        // churned revenue
    const rev_ps      = rev_sub * i.ps_rev_pct;        // professional services
    const rev_total   = rev_sub + rev_exp - rev_churn + rev_ps;
    const arr         = rev_sub + rev_exp - rev_churn; // subscription ARR net of churn

    // ── COGS ─────────────────────────────────────────────────────────────
    const cogs_host   = rev_total * i.hosting_pct;
    const cogs_sup    = i.sup_headcount * i.sup_cost_per;
    const cogs_ps     = rev_ps * (1 - i.ps_margin);
    const cogs_total  = cogs_host + cogs_sup + cogs_ps;
    const gross_profit= rev_total - cogs_total;

    // ── OpEx ─────────────────────────────────────────────────────────────
    const sm_base     = i.ae_headcount  * i.ae_ote;
    const sm_comm     = (rev_sub + rev_exp) * i.comm_rate;
    const sm_total    = sm_base + sm_comm + i.mktg_spend;
    const rd_total    = i.eng_headcount * i.eng_cost_per + i.rd_other;
    const ga_total    = i.ga_headcount  * i.ga_cost_per
                      + i.legal_fees + i.office_cost;
    const opex_total  = sm_total + rd_total + ga_total;

    // ── EBITDA → Net income ──────────────────────────────────────────────
    const ebitda      = gross_profit - opex_total;
    const da          = rev_total * i.da_pct;
    const ebit        = ebitda - da;
    const ebt         = ebit - i.interest;
    const tax         = Math.max(ebt * i.tax_rate, 0);
    const net_income  = ebt - tax;

    // ── Unit economics ────────────────────────────────────────────────────
    const cac         = safe(i.cust_new) > 0
                        ? (sm_total) / i.cust_new
                        : 0;
    const ltv         = safe(i.churn_rate) > 0
                        ? (arr / cust_end) * pct(gross_profit, rev_total) / i.churn_rate
                        : 0;
    const ltv_cac     = safe(cac) > 0 ? ltv / cac : 0;
    const payback_mo  = safe(cac) > 0 && gross_profit > 0
                        ? cac / ((arr / cust_end) * pct(gross_profit, rev_total) / 12)
                        : 0;
    const nrr         = 1 - i.churn_rate + i.exp_rate;
    const arpa        = safe(cust_end) > 0 ? arr / cust_end : 0;

    // ── Efficiency ────────────────────────────────────────────────────────
    const gross_margin = pct(gross_profit, rev_total);
    const ebitda_margin= pct(ebitda, rev_total);
    const ni_margin    = pct(net_income, rev_total);
    const magic_number = safe(i.mktg_spend + sm_total) > 0
                         ? (arr) / (i.mktg_spend + sm_total)
                         : 0;
    const rule_of_40   = 0; // needs prior period ARR for growth rate; computed in multi-period

    // ── Cash flow proxies ─────────────────────────────────────────────────
    const capex        = rev_total * i.capex_pct;
    const ar_days      = i.dso;
    const fcf          = ebitda + da - capex;         // simplified unlevered FCF

    return {
      // inputs (echoed)
      inputs: i,

      // customers
      cust_start:    round2(i.cust_start),
      cust_new:      round2(i.cust_new),
      cust_churn:    round2(i.cust_churn),
      cust_end:      round2(cust_end),
      cust_avg:      round2(cust_avg),

      // revenue
      rev_sub,
      rev_exp,
      rev_churn,
      rev_ps,
      rev_total,
      arr,

      // cogs
      cogs_host,
      cogs_sup,
      cogs_ps,
      cogs_total,
      gross_profit,

      // opex
      sm_base,
      sm_comm,
      sm_total,
      rd_total,
      ga_total,
      opex_total,

      // income
      ebitda,
      da,
      ebit,
      ebt,
      tax,
      net_income,

      // unit economics
      cac:           round2(cac),
      ltv:           round2(ltv),
      ltv_cac:       round2(ltv_cac),
      payback_mo:    round2(payback_mo),
      nrr:           round2(nrr * 100) / 100,
      arpa:          round2(arpa),

      // margins & ratios
      gross_margin:  round2(gross_margin * 100) / 100,
      ebitda_margin: round2(ebitda_margin * 100) / 100,
      ni_margin:     round2(ni_margin * 100) / 100,
      magic_number:  round2(magic_number),
      rule_of_40:    null,  // computed in multi-period

      // cash
      capex,
      fcf,
      ar_days,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MULTI-PERIOD — array of period inputs → array of period outputs
  // ─────────────────────────────────────────────────────────────────────────
  function calcMulti(periodsArr) {
    if (!Array.isArray(periodsArr) || periodsArr.length === 0) {
      throw new Error('calcMulti expects a non-empty array of period input objects.');
    }
    const results = [];
    let prevARR = null;

    periodsArr.forEach((inp, idx) => {
      const r = calcPeriod(inp);

      // ARR growth and Rule of 40
      if (prevARR !== null && prevARR > 0) {
        r.arr_growth = round2((r.arr - prevARR) / prevARR);
        r.rule_of_40 = round2(r.arr_growth * 100 + r.ebitda_margin * 100);
      } else {
        r.arr_growth = null;
        r.rule_of_40 = null;
      }

      r.period = idx + 1;
      r.period_label = inp.label || `Year ${idx + 1}`;
      prevARR = r.arr;
      results.push(r);
    });

    return results;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ARR BRIDGE  (waterfall from start to end)
  // ─────────────────────────────────────────────────────────────────────────
  function arrBridge(r) {
    return {
      beginning_arr: round2(r.rev_sub - r.rev_exp + r.rev_churn),  // approx
      new_arr:       round2(r.inputs.cust_new * r.inputs.arpa_new),
      expansion_arr: round2(r.rev_exp),
      churn_arr:    -round2(r.rev_churn),
      contraction:   0,     // add if tracking separately
      ending_arr:    round2(r.arr),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BENCHMARK COMPARISON — flag metrics vs. benchmarks
  // ─────────────────────────────────────────────────────────────────────────
  const BENCHMARKS = {
    gross_margin:  { good: 0.70, warn: 0.60, label: "Gross margin",    fmt: "pct" },
    ebitda_margin: { good: 0.10, warn: 0.00, label: "EBITDA margin",   fmt: "pct" },
    nrr:           { good: 1.10, warn: 1.00, label: "NRR",             fmt: "pct" },
    churn_rate:    { good: 0.05, warn: 0.10, label: "Gross churn",     fmt: "pct", invert: true },
    ltv_cac:       { good: 3.0,  warn: 1.5,  label: "LTV/CAC",         fmt: "x"   },
    payback_mo:    { good: 18,   warn: 24,   label: "CAC payback (mo)", fmt: "num", invert: true },
    magic_number:  { good: 0.75, warn: 0.50, label: "Magic number",    fmt: "x"   },
  };

  function benchmark(result) {
    const out = {};
    Object.entries(BENCHMARKS).forEach(([key, b]) => {
      const val = key === 'churn_rate' ? result.inputs.churn_rate
                : key === 'payback_mo' ? result.payback_mo
                : result[key];
      if (val === undefined || val === null) return;
      let status;
      if (b.invert) {
        status = val <= b.good ? 'good' : val <= b.warn ? 'warn' : 'bad';
      } else {
        status = val >= b.good ? 'good' : val >= b.warn ? 'warn' : 'bad';
      }
      out[key] = { value: val, status, label: b.label, fmt: b.fmt };
    });
    return out;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO RUNNER — run named scenarios and diff them
  // ─────────────────────────────────────────────────────────────────────────
  function scenarios(scenarioMap) {
    // scenarioMap: { base: {...inputs}, bull: {...inputs}, bear: {...inputs} }
    const results = {};
    Object.entries(scenarioMap).forEach(([name, inp]) => {
      results[name] = calcPeriod(inp);
    });
    return results;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SENSITIVITY TABLE  — vary one input across a range
  // ─────────────────────────────────────────────────────────────────────────
  function sensitivity(baseInputs, paramKey, values) {
    return values.map(v => {
      const inp = Object.assign({}, baseInputs, { [paramKey]: v });
      const r   = calcPeriod(inp);
      return { [paramKey]: v, ebitda: r.ebitda, gross_margin: r.gross_margin, nrr: r.nrr, arr: r.arr };
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FULLY BURDENED PERSONNEL COST  (for a given headcount + base salary)
  // ─────────────────────────────────────────────────────────────────────────
  function fullyBurdened(baseSalary) {
    const payrollTax   = baseSalary * 0.0765;
    const benefits     = baseSalary * 0.18;
    const travelTrain  = baseSalary * 0.04;
    const softwareSubs = baseSalary * 0.03;
    const total        = baseSalary + payrollTax + benefits + travelTrain + softwareSubs;
    return {
      base:        round2(baseSalary),
      payroll_tax: round2(payrollTax),
      benefits:    round2(benefits),
      travel:      round2(travelTrain),
      software:    round2(softwareSubs),
      total:       round2(total),
      multiplier:  round2(total / baseSalary),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN ENTRY POINT — run Y1 + Y2 from a flat input map
  // ─────────────────────────────────────────────────────────────────────────
  function run(y1Inputs, y2Inputs) {
    // If only one argument, return single-period result
    if (!y2Inputs) {
      const r = calcPeriod(y1Inputs || {});
      return {
        period:     r,
        bridge:     arrBridge(r),
        benchmarks: benchmark(r),
      };
    }

    // Two-period mode
    const periods = calcMulti([
      Object.assign({ label: 'Year 1' }, y1Inputs),
      Object.assign({ label: 'Year 2' }, y2Inputs),
    ]);
    const [y1, y2] = periods;

    return {
      year1:       y1,
      year2:       y2,
      bridge_y1:   arrBridge(y1),
      bridge_y2:   arrBridge(y2),
      benchmarks_y1: benchmark(y1),
      benchmarks_y2: benchmark(y2),
      yoy: {
        arr_growth:     y2.arr_growth,
        rule_of_40:     y2.rule_of_40,
        rev_growth:     round2((y2.rev_total - y1.rev_total) / y1.rev_total),
        gm_delta:       round2(y2.gross_margin - y1.gross_margin),
        ebitda_delta:   round2(y2.ebitda_margin - y1.ebitda_margin),
        nrr_delta:      round2(y2.nrr - y1.nrr),
        cac_delta:      round2(y2.cac - y1.cac),
        ltv_cac_delta:  round2(y2.ltv_cac - y1.ltv_cac),
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FORMAT HELPERS  (for UI rendering)
  // ─────────────────────────────────────────────────────────────────────────
  function formatUSD(n, decimals = 0) {
    if (n === null || n === undefined) return '—';
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(1) + 'M';
    if (abs >= 1e3) return sign + '$' + (abs / 1e3).toFixed(0) + 'K';
    return sign + '$' + abs.toFixed(decimals);
  }
  function formatPct(n, decimals = 1) {
    if (n === null || n === undefined) return '—';
    return (n * 100).toFixed(decimals) + '%';
  }
  function formatX(n, decimals = 1) {
    if (n === null || n === undefined) return '—';
    return n.toFixed(decimals) + 'x';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────
  return {
    DEFAULTS,
    BENCHMARKS,

    // Core calculators
    calcPeriod,
    calcMulti,
    run,

    // Analysis tools
    arrBridge,
    benchmark,
    scenarios,
    sensitivity,
    fullyBurdened,

    // Formatters
    fmt: { usd: formatUSD, pct: formatPct, x: formatX },
  };

}));

// ─────────────────────────────────────────────────────────────────────────────
// QUICK DEMO  (runs in Node.js: node calculations.js)
// ─────────────────────────────────────────────────────────────────────────────
if (typeof require !== 'undefined' && require.main === module) {
  const calc = module.exports;
  const result = calc.run(
    { label: 'Year 1' },       // Year 1 uses all defaults
    { label: 'Year 2',         // Year 2 overrides growth assumptions
      cust_start: 160,
      cust_new:   180,
      arpa_new:   28000,
      arpa_exist: 25000,
      exp_rate:   0.07,
      churn_rate: 0.07,
    }
  );

  console.log('\n── YEAR 1 ───────────────────────────────');
  console.log('  ARR:           ', calc.fmt.usd(result.year1.arr));
  console.log('  Revenue:       ', calc.fmt.usd(result.year1.rev_total));
  console.log('  Gross margin:  ', calc.fmt.pct(result.year1.gross_margin));
  console.log('  EBITDA margin: ', calc.fmt.pct(result.year1.ebitda_margin));
  console.log('  NRR:           ', calc.fmt.pct(result.year1.nrr));
  console.log('  LTV/CAC:       ', calc.fmt.x(result.year1.ltv_cac));

  console.log('\n── YEAR 2 ───────────────────────────────');
  console.log('  ARR:           ', calc.fmt.usd(result.year2.arr));
  console.log('  Revenue:       ', calc.fmt.usd(result.year2.rev_total));
  console.log('  Gross margin:  ', calc.fmt.pct(result.year2.gross_margin));
  console.log('  EBITDA margin: ', calc.fmt.pct(result.year2.ebitda_margin));
  console.log('  ARR growth:    ', calc.fmt.pct(result.yoy.arr_growth));
  console.log('  Rule of 40:    ', result.yoy.rule_of_40?.toFixed(1));

  console.log('\n── BENCHMARKS Y2 ────────────────────────');
  Object.values(result.benchmarks_y2).forEach(b => {
    const icon = b.status === 'good' ? '✅' : b.status === 'warn' ? '⚠️ ' : '❌';
    console.log(' ', icon, b.label + ':', b.value);
  });
  console.log('');
}
