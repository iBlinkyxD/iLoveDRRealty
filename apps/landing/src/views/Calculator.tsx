'use client'
import { useNav } from '../hooks/useNav'
import { useState, useMemo } from 'react'

type Scenario = 'rent' | 'vacation' | 'flip'
type Financing = 'mortgage' | 'cash' | 'hard' | 'seller'

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return sign + '$' + (abs / 1_000_000).toFixed(1) + 'M'
  if (abs >= 1_000) return sign + '$' + Math.round(abs / 1_000) + 'K'
  return sign + '$' + abs.toLocaleString()
}
function pct(n: number) { return isFinite(n) ? n.toFixed(1) + '%' : '—' }
function mortgagePmt(P: number, annualRate: number, years: number) {
  if (annualRate === 0 || P === 0) return P / (years * 12)
  const r = annualRate / 12, n = years * 12
  return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
}

const inputCls = 'w-full py-2.5 px-3 rounded-md border border-[#E2E8F0] font-sans text-sm text-[#0D1B3E] outline-none bg-white'

function NumberInput({ value, set, min, max, step = 1, prefix, suffix }: {
  value: number; set: (v: number) => void
  min?: number; max?: number; step?: number
  prefix?: string; suffix?: string
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-[#556070] font-semibold text-sm pointer-events-none">{prefix}</span>}
      <input type="number" value={value} min={min} max={max} step={step}
        onChange={e => set(+e.target.value || 0)}
        className={inputCls}
        style={{ paddingLeft: prefix ? 26 : 12, paddingRight: suffix ? 36 : 12 }} />
      {suffix && <span className="absolute right-3 text-[#556070] font-semibold text-3.25 pointer-events-none">{suffix}</span>}
    </div>
  )
}

function SelectInput({ value, set, options }: {
  value: string | number
  set: (v: string | number) => void
  options: [string | number, string][]
}) {
  return (
    <select value={value}
      onChange={e => set(isNaN(+e.target.value) ? e.target.value : +e.target.value)}
      className={`${inputCls} cursor-pointer`}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  )
}

function Card({ icon, title, children }: { icon?: string; title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 mb-4">
      {title && (
        <div className="text-sm font-bold text-[#0D1B3E] flex items-center gap-2 mb-4">
          {icon && <span className="text-4.5">{icon}</span>}{title}
        </div>
      )}
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <div className="text-xs font-semibold text-[#556070] mb-1.5 flex justify-between">
        <span>{label}</span>
        {hint && <span className="text-[#0099CC] font-medium">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function KpiCard({ label, value, kind, sub, highlight }: {
  label: string; value: string; kind: string; sub: string; highlight?: boolean
}) {
  const valColor = highlight ? 'text-white'
    : kind === 'positive' ? 'text-[#15803d]'
    : kind === 'negative' ? 'text-[#C41230]'
    : 'text-[#0D1B3E]'
  return (
    <div className={`rounded-xl py-3.5 px-4 ${highlight ? 'border-none' : 'border border-[#E2E8F0]'}`}
      style={{ background: highlight ? 'linear-gradient(135deg, #0D1B3E 0%, #1a3a6e 100%)' : '#F8F9FC' }}>
      <div className={`text-[10.5px] font-bold tracking-[.08em] uppercase mb-1.5 ${highlight ? 'text-white/70' : 'text-[#556070]'}`}>{label}</div>
      <div className={`font-serif text-6.5 font-bold leading-none ${valColor}`}>{value}</div>
      <div className={`text-2.75 mt-1.5 ${highlight ? 'text-white/60' : 'text-[#556070]'}`}>{sub}</div>
    </div>
  )
}

export default function Calculator() {
  const go = useNav()
  const [scenario, setScenario] = useState<Scenario>('rent')
  const [price, setPrice] = useState(500_000)
  const [downPct, setDownPct] = useState(25)
  const [closingPct, setClosingPct] = useState(4)
  const [reno, setReno] = useState(25_000)
  const [rate, setRate] = useState(6.5)
  const [term, setTerm] = useState(25)
  const [financing, setFinancing] = useState<Financing>('mortgage')
  const [rent, setRent] = useState(3_500)
  const [occupancy, setOccupancy] = useState(75)
  const [rentGrowth, setRentGrowth] = useState(3)
  const [propTaxPct, setPropTaxPct] = useState(1)
  const [mgmtPct, setMgmtPct] = useState(10)
  const [maintPct, setMaintPct] = useState(1.5)
  const [insPct, setInsPct] = useState(0.5)
  const [confoturYrs, setConfoturYrs] = useState<number>(10)
  const [appRate, setAppRate] = useState(5)

  const setScenarioMode = (s: Scenario) => {
    setScenario(s)
    if (s === 'vacation') { setRent(5_500); setOccupancy(60) }
    else if (s === 'flip') { setRent(0); setReno(75_000) }
    else { setRent(3_500); setOccupancy(75); setReno(25_000) }
  }

  const calc = useMemo(() => {
    if (scenario === 'flip') {
      const downAmt = price * (downPct / 100)
      const closingAmt = price * (closingPct / 100)
      const effRate = financing === 'hard' ? rate / 100 + 0.04 : rate / 100
      const loan = financing === 'cash' ? 0 : price - downAmt
      const monthlyMort = mortgagePmt(loan, effRate, term)
      const holdingMo = 8
      const holdingCost = monthlyMort * holdingMo + price * (propTaxPct / 100) * (holdingMo / 12)
      const resale = price * 1.32
      const sellingCost = resale * 0.03
      const totalInvest = downAmt + closingAmt + reno
      const profit = resale - price - reno - holdingCost - sellingCost
      const roi = totalInvest > 0 ? (profit / totalInvest) * 100 : 0
      return {
        flip: true,
        kpis: [
          { label: 'Total Flip Profit',   value: fmt(profit),        kind: profit >= 0 ? 'positive' : 'negative', sub: 'After all costs' },
          { label: 'Return on Cash',      value: pct(roi),           kind: roi >= 0 ? 'positive' : 'negative',   sub: 'On total investment', highlight: true },
          { label: 'Hold Period',         value: holdingMo + ' mo',  kind: 'neutral',   sub: 'Typical buy → resell' },
          { label: 'Est. Resale',         value: fmt(resale),        kind: 'positive',  sub: '+32% uplift assumed' },
          { label: 'Total Investment',    value: fmt(totalInvest),   kind: 'neutral',   sub: 'Down + closing + reno' },
          { label: 'Selling Cost',        value: fmt(sellingCost),   kind: 'neutral',   sub: '3% of resale' },
          { label: 'Holding Cost',        value: fmt(holdingCost),   kind: 'neutral',   sub: `${holdingMo} months carry` },
          { label: 'Monthly Mortgage',    value: fmt(monthlyMort),   kind: 'neutral',   sub: 'Principal + interest' },
        ] as { label: string; value: string; kind: string; sub: string; highlight?: boolean }[],
        years: [] as { y: number; rent: number; exp: number; net: number }[],
        maxBar: 1,
        scenarios: null as null | { label: string; roi: number; cf: number; be: number; current?: boolean }[],
        breakeven: holdingMo / 12,
      }
    }

    const downAmt      = price * (downPct / 100)
    const closingAmt   = price * (closingPct / 100)
    const totalInvest  = downAmt + closingAmt + reno
    const loan         = financing === 'cash' ? 0 : price - downAmt
    const effRate      = financing === 'hard' ? rate / 100 + 0.04 : rate / 100
    const monthlyMort  = mortgagePmt(loan, effRate, term)
    const annualMort   = monthlyMort * 12
    const effRent      = rent * (occupancy / 100) * 12
    const propTax      = confoturYrs > 0 ? 0 : price * (propTaxPct / 100)
    const mgmt         = effRent * (mgmtPct / 100)
    const maint        = price * (maintPct / 100)
    const ins          = price * (insPct / 100)
    const annualExp    = propTax + mgmt + maint + ins
    const noi          = effRent - annualExp
    const netCF        = noi - annualMort
    const monthlyCF    = Math.round(netCF / 12)
    const capRate      = (noi / price) * 100
    const grossYield   = (effRent / price) * 100
    const cocROI       = totalInvest > 0 ? (netCF / totalInvest) * 100 : grossYield
    const breakeven    = netCF > 0 ? totalInvest / netCF : Infinity

    const years: { y: number; rent: number; exp: number; net: number }[] = []
    let maxBar = 0
    for (let y = 1; y <= 5; y++) {
      const yRent = effRent * Math.pow(1 + rentGrowth / 100, y - 1)
      const yExp  = annualExp + annualMort
      const yNet  = yRent - yExp
      years.push({ y, rent: yRent, exp: yExp, net: yNet })
      maxBar = Math.max(maxBar, yRent, yExp)
    }
    maxBar *= 1.15

    let cumRent = 0, cumExp = 0
    for (let y = 1; y <= 10; y++) {
      cumRent += effRent * Math.pow(1 + rentGrowth / 100, y - 1)
      cumExp  += annualExp + annualMort
    }
    const futureVal  = price * Math.pow(1 + appRate / 100, 10)
    const equityGain = futureVal - price
    const return10   = cumRent - cumExp + equityGain

    const allCash = {
      label: 'All Cash Purchase',
      roi: (noi / (price + closingAmt + reno)) * 100,
      cf: Math.round(noi / 12),
      be: noi > 0 ? (price + closingAmt + reno) / noi : Infinity,
    }
    const loan20  = price * 0.8
    const mort20  = mortgagePmt(loan20, effRate, term) * 12
    const invest20 = price * 0.2 + closingAmt + reno
    const ls20 = {
      label: '20% Down / Higher Leverage',
      roi: ((noi - mort20) / invest20) * 100,
      cf: Math.round((noi - mort20) / 12),
      be: noi > mort20 ? invest20 / (noi - mort20) : Infinity,
    }
    const confoturAdj = confoturYrs > 0 ? netCF : netCF + price * (propTaxPct / 100)
    const conf = {
      label: 'With CONFOTUR Exemption',
      roi: (confoturAdj / totalInvest) * 100,
      cf: Math.round(confoturAdj / 12),
      be: confoturAdj > 0 ? totalInvest / confoturAdj : Infinity,
    }

    return {
      flip: false,
      kpis: [
        { label: 'Annual Net ROI',    value: pct(cocROI),    kind: cocROI >= 0 ? 'highlight' : 'negative',  sub: 'After all expenses & financing', highlight: true },
        { label: 'Monthly Cash Flow', value: (monthlyCF >= 0 ? '+' : '') + fmt(monthlyCF), kind: monthlyCF >= 0 ? 'positive' : 'negative', sub: 'Net after mortgage' },
        { label: 'Break-even',        value: isFinite(breakeven) ? breakeven.toFixed(1) + ' yrs' : '—', kind: 'neutral', sub: 'Based on cash-on-cash' },
        { label: 'Annual Yield',      value: pct(grossYield), kind: 'positive', sub: 'Gross rental yield' },
        { label: 'Total Investment',  value: fmt(totalInvest), kind: 'neutral', sub: 'Down + closing + reno' },
        { label: 'Cap Rate',          value: pct(capRate),    kind: 'neutral',  sub: 'NOI / purchase price' },
        { label: '10-Year Return',    value: fmt(return10),   kind: return10 >= 0 ? 'positive' : 'negative', sub: 'Cash flow + appreciation' },
        { label: 'Monthly Mortgage',  value: fmt(monthlyMort), kind: 'neutral', sub: 'Principal + interest' },
      ] as { label: string; value: string; kind: string; sub: string; highlight?: boolean }[],
      years, maxBar, breakeven,
      scenarios: [
        { label: 'Buy & Rent (Current)', roi: cocROI, cf: monthlyCF, be: breakeven, current: true },
        allCash, ls20, conf,
      ] as { label: string; roi: number; cf: number; be: number; current?: boolean }[],
    }
  }, [scenario, price, downPct, closingPct, reno, rate, term, financing, rent, occupancy, rentGrowth, propTaxPct, mgmtPct, maintPct, insPct, confoturYrs, appRate])

  return (
    <div className="bg-[#F8F9FC] font-sans text-[#0D1B3E] min-h-[calc(100vh-74px)]">

      {/* HERO */}
      <div className="pt-15 px-7 pb-13 relative overflow-hidden"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(13,27,62,.95) 0%, rgba(26,58,110,.9) 50%, rgba(0,153,204,.78) 100%)' }} />
        <div className="absolute -top-15 -right-15 w-100 h-100 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,166,35,.18) 0%, transparent 70%)' }} />
        <div className="relative max-w-310 mx-auto">
          <div className="text-2.75 font-bold tracking-[.18em] uppercase text-[#F5A623] mb-3">
            DR Real Estate · ROI Calculator
          </div>
          <h1 className="font-serif text-[clamp(28px,4vw,52px)] font-extrabold text-white leading-[1.05] tracking-[-.02em] mb-3.5 max-w-175">
            Run the numbers before you <em className="not-italic text-[#F5A623]">buy</em>
          </h1>
          <p className="text-4 text-white/70 leading-[1.6] max-w-155">
            Professional-grade deal analysis for Dominican Republic properties. Model scenarios, compare financing options, and stress-test your returns.
          </p>
          <div className="flex gap-2.5 flex-wrap mt-5.5">
            {[['📊', 'Live scenario modeling'], ['📈', '10-year projections'], ['⚖️', 'Financing comparison'], ['🏖️', 'CONFOTUR tax analysis']].map(([ic, l], i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 border border-white/15 text-white py-1.5 px-3 rounded-full">{ic} {l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-335 mx-auto pt-8 px-7 pb-15 grid grid-cols-2 gap-6 items-start">

        {/* ── LEFT: INPUTS ── */}
        <div>
          {/* Scenario */}
          <Card icon="🎯" title="Scenario">
            <div className="grid grid-cols-3 gap-2">
              {([['rent', 'Buy & Rent'], ['flip', 'Fix & Flip'], ['vacation', 'Vacation Rental']] as [Scenario, string][]).map(([k, l]) => (
                <button key={k} onClick={() => setScenarioMode(k)}
                  className={`py-2.75 rounded-md cursor-pointer font-sans text-3.25 font-semibold transition-all duration-150 border ${scenario === k ? 'bg-[#0D1B3E] text-white border-[#0D1B3E]' : 'bg-white text-[#556070] border-[#E2E8F0]'}`}>
                  {l}
                </button>
              ))}
            </div>
          </Card>

          {/* Property Details */}
          <Card icon="🏠" title="Property Details">
            <Field label="Purchase Price" hint="USD">
              <NumberInput value={price} set={setPrice} min={50_000} max={5_000_000} step={10_000} prefix="$" />
              <input type="range" min={50_000} max={5_000_000} step={10_000} value={price} onChange={e => setPrice(+e.target.value)}
                className="w-full mt-2 accent-[#0099CC]" />
              <div className="flex justify-between text-[10.5px] text-[#556070] mt-0.5"><span>$50K</span><span>$5M</span></div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Down Payment"><NumberInput value={downPct} set={setDownPct} min={0} max={100} suffix="%" /></Field>
              <Field label="Closing Costs"><NumberInput value={closingPct} set={setClosingPct} min={0} max={15} suffix="%" /></Field>
            </div>
            <Field label={scenario === 'flip' ? 'Renovation Budget' : 'Renovation / Furnishing'} hint="optional">
              <NumberInput value={reno} set={setReno} min={0} step={1_000} prefix="$" />
            </Field>
          </Card>

          {/* Financing */}
          <Card icon="🏦" title="Financing">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Interest Rate"><NumberInput value={rate} set={setRate} min={0} max={20} step={0.1} suffix="%" /></Field>
              <Field label="Loan Term"><NumberInput value={term} set={setTerm} min={5} max={30} suffix="yrs" /></Field>
            </div>
            <Field label="Financing Type">
              <SelectInput value={financing} set={v => setFinancing(v as Financing)} options={[
                ['mortgage', 'Traditional Mortgage'],
                ['cash',     'All Cash (No Financing)'],
                ['hard',     'Hard Money Loan (+4% rate)'],
                ['seller',   'Seller Financing'],
              ]} />
            </Field>
          </Card>

          {/* Income (hidden for flip) */}
          {scenario !== 'flip' && (
            <Card icon="💵" title="Income Assumptions">
              <Field label="Monthly Rent / Rental Revenue">
                <NumberInput value={rent} set={setRent} min={0} step={100} prefix="$" />
                <input type="range" min={300} max={30_000} step={100} value={rent} onChange={e => setRent(+e.target.value)}
                  className="w-full mt-2 accent-[#0099CC]" />
                <div className="flex justify-between text-[10.5px] text-[#556070] mt-0.5"><span>$300</span><span>$30K</span></div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Occupancy Rate"><NumberInput value={occupancy} set={setOccupancy} min={0} max={100} suffix="%" /></Field>
                <Field label="Annual Rent Growth"><NumberInput value={rentGrowth} set={setRentGrowth} min={0} max={15} suffix="%" /></Field>
              </div>
            </Card>
          )}

          {/* Expenses */}
          <Card icon="📉" title="Annual Expenses">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Property Tax (IPI)"><NumberInput value={propTaxPct} set={setPropTaxPct} min={0} max={3} step={0.1} suffix="%" /></Field>
              <Field label="Management Fee"><NumberInput value={mgmtPct} set={setMgmtPct} min={0} max={30} suffix="%" /></Field>
              <Field label="Maintenance"><NumberInput value={maintPct} set={setMaintPct} min={0} step={0.1} suffix="%" /></Field>
              <Field label="Insurance"><NumberInput value={insPct} set={setInsPct} min={0} step={0.1} suffix="%" /></Field>
            </div>
            <Field label="CONFOTUR Tax Exemption" hint="Tourism Law 158-01">
              <SelectInput value={confoturYrs} set={v => setConfoturYrs(+v)} options={[
                [10, 'Yes — 10-year exemption (recommended)'],
                [0,  'No exemption'],
              ]} />
            </Field>
            <Field label="Annual Appreciation">
              <NumberInput value={appRate} set={setAppRate} min={0} max={20} step={0.5} suffix="%" />
            </Field>
          </Card>
        </div>

        {/* ── RIGHT: RESULTS ── */}
        <div>
          {/* KPI grid */}
          <Card icon="📊" title="Deal Summary">
            <div className="grid grid-cols-2 gap-2.5">
              {calc.kpis.map((kpi, i) => (
                <KpiCard key={i} label={kpi.label} value={kpi.value} kind={kpi.kind} sub={kpi.sub} highlight={kpi.highlight} />
              ))}
            </div>
          </Card>

          {/* 5-year bar chart */}
          {!calc.flip && calc.years.length > 0 && (
            <Card>
              <div className="flex justify-between items-center mb-3.5">
                <div className="font-serif text-4.25 font-bold text-[#0D1B3E]">5-Year Cash Flow Projection</div>
                <div className="flex gap-3.5 text-[11.5px] text-[#556070]">
                  {[['#10b981', 'Income'], ['#ef4444', 'Expenses'], ['#0099CC', 'Net']].map(([col, l], i) => (
                    <span key={i} className="inline-flex items-center gap-1.25">
                      <span className="w-2.25 h-2.25 rounded-full inline-block" style={{ background: col }} />{l}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-end justify-around h-45 gap-1 px-1.5">
                {calc.years.map((yr, i) => {
                  const incH = (yr.rent / calc.maxBar) * 140
                  const expH = (yr.exp  / calc.maxBar) * 140
                  const netH = Math.max((Math.abs(yr.net) / calc.maxBar) * 140, 4)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center h-full">
                      <div className="flex items-end gap-0.75 flex-1">
                        <div title={fmt(yr.rent)} className="w-4.5 rounded-t"
                          style={{ height: incH, background: 'linear-gradient(180deg,#10b981,#059669)' }} />
                        <div title={fmt(yr.exp)} className="w-4.5 rounded-t"
                          style={{ height: expH, background: 'linear-gradient(180deg,#ef4444,#dc2626)' }} />
                        <div title={fmt(yr.net)} className="w-4.5 rounded-t"
                          style={{ height: netH, background: yr.net >= 0 ? 'linear-gradient(180deg,#0099CC,#0077a3)' : 'linear-gradient(180deg,#f87171,#ef4444)' }} />
                      </div>
                      <div className="text-[10.5px] text-[#556070] mt-1.5">Year {yr.y}</div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Break-even timeline */}
          {!calc.flip && (
            <Card icon="⏱" title="Break-even Timeline">
              <div className="text-3.25 text-[#556070] mb-2.5">Time to recover your initial cash investment:</div>
              {(() => {
                const bePct = isFinite(calc.breakeven) ? Math.min((calc.breakeven / 20) * 100, 100) : 100
                return (
                  <>
                    <div className="relative h-3 rounded-full mb-4.5"
                      style={{ background: 'linear-gradient(90deg, #2E7D32 0%, #F5A623 50%, #C41230 100%)' }}>
                      <div className="absolute w-5 h-5 rounded-full bg-white -top-1"
                        style={{ left: `${bePct}%`, border: '3px solid #0D1B3E', transform: 'translateX(-10px)', boxShadow: '0 2px 8px rgba(13,27,62,.3)' }} />
                    </div>
                    <div className="flex justify-between text-2.75 text-[#556070]">
                      <span>Today</span>
                      <span>5 yrs</span>
                      <span className="text-[#0D1B3E] font-bold">{isFinite(calc.breakeven) ? calc.breakeven.toFixed(1) + ' yrs ✓' : 'No profit'}</span>
                      <span>20 yrs</span>
                      <span>30 yrs</span>
                    </div>
                  </>
                )
              })()}
            </Card>
          )}

          {/* Scenario comparison table */}
          {!calc.flip && calc.scenarios && (
            <Card icon="⚖️" title="Scenario Comparison">
              <table className="w-full border-collapse font-sans">
                <thead>
                  <tr>
                    {['Scenario', 'Annual ROI', 'Monthly Cash Flow', 'Break-even'].map((h, i) => (
                      <th key={i} className={`text-2.75 font-bold tracking-[.06em] uppercase text-[#556070] py-2.5 px-2 border-b border-[#E2E8F0] ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calc.scenarios.map((s, i) => (
                    <tr key={i} className={s.current ? 'bg-[rgba(13,27,62,0.04)]' : ''}>
                      <td className={`text-3.25 text-[#0D1B3E] py-3 px-2 ${s.current ? 'font-bold' : 'font-semibold'}`}
                        style={{ borderBottom: i < calc.scenarios!.length - 1 ? '1px solid #E2E8F0' : 'none' }}>{s.label}</td>
                      <td className="text-right text-3.25 font-bold py-3 px-2"
                        style={{ color: s.roi >= 0 ? '#15803d' : '#C41230', borderBottom: i < calc.scenarios!.length - 1 ? '1px solid #E2E8F0' : 'none' }}>{pct(s.roi)}</td>
                      <td className="text-right text-3.25 font-semibold py-3 px-2"
                        style={{ color: s.cf >= 0 ? '#15803d' : '#C41230', borderBottom: i < calc.scenarios!.length - 1 ? '1px solid #E2E8F0' : 'none' }}>{(s.cf >= 0 ? '+' : '') + fmt(s.cf)}</td>
                      <td className="text-right text-3.25 text-[#556070] py-3 px-2"
                        style={{ borderBottom: i < calc.scenarios!.length - 1 ? '1px solid #E2E8F0' : 'none' }}>{isFinite(s.be) ? s.be.toFixed(1) + ' yrs' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {/* Export / CTA */}
          <Card icon="📤" title="Export & Share">
            <div className="flex gap-2 flex-wrap">
              {[
                ['📄 PDF Report', '#fff', '#0D1B3E', '#E2E8F0'],
                ['🔗 Copy Link',  '#fff', '#0D1B3E', '#E2E8F0'],
                ['💬 WhatsApp',   '#25D366', '#fff', '#25D366'],
              ].map(([l, bg, fg, bd], i) => (
                <button key={i} className="flex-1 basis-32.5 py-2.75 px-3.5 rounded-md font-sans text-3.25 font-semibold cursor-pointer"
                  style={{ border: `1px solid ${bd}`, background: bg as string, color: fg as string }}>{l}</button>
              ))}
            </div>
            <div className="text-2.75 text-[#556070] mt-3 leading-normal">
              <strong className="text-[#0D1B3E]">Note:</strong> figures are illustrative based on the inputs above. Not financial advice.
            </div>
          </Card>

          {/* Talk to an agent */}
          <div className="rounded-2xl p-6 text-center"
            style={{ background: 'linear-gradient(135deg, #0D1B3E 0%, #1a3a6e 100%)' }}>
            <div className="text-4.5 mb-2">🏡</div>
            <div className="font-serif text-4.5 font-bold text-white mb-2">Ready to move forward?</div>
            <p className="text-3.25 text-white/65 mb-4 leading-normal">Our team can validate these numbers against real listings and current market data.</p>
            <div className="flex gap-2.5 justify-center flex-wrap">
              <button onClick={() => go('contact')}
                className="font-sans text-3.25 font-semibold cursor-pointer py-2.75 px-5.5 rounded-full border-none bg-[#0099CC] text-white">
                Talk to our team
              </button>
              <button onClick={() => go('search')}
                className="font-sans text-3.25 font-semibold cursor-pointer py-2.75 px-5.5 rounded-full bg-transparent text-white/80 border border-white/25">
                Browse listings
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
