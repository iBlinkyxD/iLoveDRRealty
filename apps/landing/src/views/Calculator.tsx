'use client'
import { useNav } from '../hooks/useNav'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

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
      <div className={`font-sans text-6.5 font-bold leading-none ${valColor}`}>{value}</div>
      <div className={`text-2.75 mt-1.5 ${highlight ? 'text-white/60' : 'text-[#556070]'}`}>{sub}</div>
    </div>
  )
}

export default function Calculator() {
  const go = useNav()
  const { t } = useTranslation('calculator')
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
          { label: t('kpis.flip_profit_label'),   value: fmt(profit),        kind: profit >= 0 ? 'positive' : 'negative', sub: t('kpis.flip_profit_sub') },
          { label: t('kpis.roc_label'),            value: pct(roi),           kind: roi >= 0 ? 'positive' : 'negative',   sub: t('kpis.roc_sub'), highlight: true },
          { label: t('kpis.hold_label'),           value: holdingMo + ' mo',  kind: 'neutral',   sub: t('kpis.hold_sub') },
          { label: t('kpis.resale_label'),         value: fmt(resale),        kind: 'positive',  sub: t('kpis.resale_sub') },
          { label: t('kpis.invest_label'),         value: fmt(totalInvest),   kind: 'neutral',   sub: t('kpis.invest_sub') },
          { label: t('kpis.sell_cost_label'),      value: fmt(sellingCost),   kind: 'neutral',   sub: t('kpis.sell_cost_sub') },
          { label: t('kpis.hold_cost_label'),      value: fmt(holdingCost),   kind: 'neutral',   sub: t('kpis.hold_cost_sub', { mo: holdingMo }) },
          { label: t('kpis.mort_label'),           value: fmt(monthlyMort),   kind: 'neutral',   sub: t('kpis.mort_sub') },
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
      label: t('comparison.all_cash_label'),
      roi: (noi / (price + closingAmt + reno)) * 100,
      cf: Math.round(noi / 12),
      be: noi > 0 ? (price + closingAmt + reno) / noi : Infinity,
    }
    const loan20  = price * 0.8
    const mort20  = mortgagePmt(loan20, effRate, term) * 12
    const invest20 = price * 0.2 + closingAmt + reno
    const ls20 = {
      label: t('comparison.leverage_label'),
      roi: ((noi - mort20) / invest20) * 100,
      cf: Math.round((noi - mort20) / 12),
      be: noi > mort20 ? invest20 / (noi - mort20) : Infinity,
    }
    const confoturAdj = confoturYrs > 0 ? netCF : netCF + price * (propTaxPct / 100)
    const conf = {
      label: t('comparison.confotur_label'),
      roi: (confoturAdj / totalInvest) * 100,
      cf: Math.round(confoturAdj / 12),
      be: confoturAdj > 0 ? totalInvest / confoturAdj : Infinity,
    }

    return {
      flip: false,
      kpis: [
        { label: t('kpis.roi_label'),      value: pct(cocROI),    kind: cocROI >= 0 ? 'highlight' : 'negative',  sub: t('kpis.roi_sub'), highlight: true },
        { label: t('kpis.cf_label'),       value: (monthlyCF >= 0 ? '+' : '') + fmt(monthlyCF), kind: monthlyCF >= 0 ? 'positive' : 'negative', sub: t('kpis.cf_sub') },
        { label: t('kpis.be_label'),       value: isFinite(breakeven) ? breakeven.toFixed(1) + ' yrs' : '—', kind: 'neutral', sub: t('kpis.be_sub') },
        { label: t('kpis.yield_label'),    value: pct(grossYield), kind: 'positive', sub: t('kpis.yield_sub') },
        { label: t('kpis.invest_label'),   value: fmt(totalInvest), kind: 'neutral', sub: t('kpis.invest_sub') },
        { label: t('kpis.cap_label'),      value: pct(capRate),    kind: 'neutral',  sub: t('kpis.cap_sub') },
        { label: t('kpis.return10_label'), value: fmt(return10),   kind: return10 >= 0 ? 'positive' : 'negative', sub: t('kpis.return10_sub') },
        { label: t('kpis.mort_label'),     value: fmt(monthlyMort), kind: 'neutral', sub: t('kpis.mort_sub') },
      ] as { label: string; value: string; kind: string; sub: string; highlight?: boolean }[],
      years, maxBar, breakeven,
      scenarios: [
        { label: t('comparison.current_label'), roi: cocROI, cf: monthlyCF, be: breakeven, current: true },
        allCash, ls20, conf,
      ] as { label: string; roi: number; cf: number; be: number; current?: boolean }[],
    }
  }, [scenario, price, downPct, closingPct, reno, rate, term, financing, rent, occupancy, rentGrowth, propTaxPct, mgmtPct, maintPct, insPct, confoturYrs, appRate, t])

  const heroIcons = ['📊', '📈', '⚖️', '🏖️']
  const heroBadges = t('hero.badges', { returnObjects: true }) as string[]

  return (
    <div className="bg-[#F8F9FC] font-sans text-[#0D1B3E] min-h-[calc(100vh-74px)]">

      {/* HERO */}
      <div className="pt-12 sm:pt-15 px-4 sm:px-7 pb-10 sm:pb-13 relative overflow-hidden"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(13,27,62,.95) 0%, rgba(26,58,110,.9) 50%, rgba(0,153,204,.78) 100%)' }} />
        <div className="absolute -top-15 -right-15 w-100 h-100 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,166,35,.18) 0%, transparent 70%)' }} />
        <div className="relative max-w-310 mx-auto">
          <div className="text-2.75 font-bold tracking-[.18em] uppercase text-[#F5A623] mb-3">
            {t('hero.eyebrow')}
          </div>
          <h1 className="font-sans text-[clamp(28px,4vw,52px)] font-extrabold text-white leading-[1.05] tracking-[-.02em] mb-3.5 max-w-175">
            {t('hero.h1_pre')} <em className="not-italic text-[#F5A623]">{t('hero.h1_em')}</em>
          </h1>
          <p className="text-4 text-white/70 leading-[1.6] max-w-155">
            {t('hero.sub')}
          </p>
          <div className="flex gap-2.5 flex-wrap mt-5.5">
            {heroIcons.map((ic, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 border border-white/15 text-white py-1.5 px-3 rounded-full">{ic} {heroBadges[i]}</span>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-335 mx-auto pt-8 px-4 sm:px-7 pb-15 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── LEFT: INPUTS ── */}
        <div>
          {/* Scenario */}
          <Card icon="🎯" title={t('scenario.title')}>
            <div className="grid grid-cols-3 gap-2">
              {([['rent', t('scenario.rent')], ['flip', t('scenario.flip')], ['vacation', t('scenario.vacation')]] as [Scenario, string][]).map(([k, l]) => (
                <button key={k} onClick={() => setScenarioMode(k)}
                  className={`py-2.75 rounded-md cursor-pointer font-sans text-3.25 font-semibold transition-all duration-150 border ${scenario === k ? 'bg-[#0D1B3E] text-white border-[#0D1B3E]' : 'bg-white text-[#556070] border-[#E2E8F0]'}`}>
                  {l}
                </button>
              ))}
            </div>
          </Card>

          {/* Property Details */}
          <Card icon="🏠" title={t('property.title')}>
            <Field label={t('property.purchase_price')} hint={t('property.usd')}>
              <NumberInput value={price} set={setPrice} min={50_000} max={5_000_000} step={10_000} prefix="$" />
              <input type="range" min={50_000} max={5_000_000} step={10_000} value={price} onChange={e => setPrice(+e.target.value)}
                className="w-full mt-2 accent-[#0099CC]" />
              <div className="flex justify-between text-[10.5px] text-[#556070] mt-0.5"><span>{t('property.price_min')}</span><span>{t('property.price_max')}</span></div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('property.down_payment')}><NumberInput value={downPct} set={setDownPct} min={0} max={100} suffix="%" /></Field>
              <Field label={t('property.closing_costs')}><NumberInput value={closingPct} set={setClosingPct} min={0} max={15} suffix="%" /></Field>
            </div>
            <Field label={scenario === 'flip' ? t('property.reno_flip') : t('property.reno_rent')} hint={t('property.optional')}>
              <NumberInput value={reno} set={setReno} min={0} step={1_000} prefix="$" />
            </Field>
          </Card>

          {/* Financing */}
          <Card icon="🏦" title={t('financing.title')}>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('financing.interest_rate')}><NumberInput value={rate} set={setRate} min={0} max={20} step={0.1} suffix="%" /></Field>
              <Field label={t('financing.loan_term')}><NumberInput value={term} set={setTerm} min={5} max={30} suffix="yrs" /></Field>
            </div>
            <Field label={t('financing.type_label')}>
              <SelectInput value={financing} set={v => setFinancing(v as Financing)} options={[
                ['mortgage', t('financing.mortgage')],
                ['cash',     t('financing.cash')],
                ['hard',     t('financing.hard')],
                ['seller',   t('financing.seller')],
              ]} />
            </Field>
          </Card>

          {/* Income (hidden for flip) */}
          {scenario !== 'flip' && (
            <Card icon="💵" title={t('income.title')}>
              <Field label={t('income.monthly_rent')}>
                <NumberInput value={rent} set={setRent} min={0} step={100} prefix="$" />
                <input type="range" min={300} max={30_000} step={100} value={rent} onChange={e => setRent(+e.target.value)}
                  className="w-full mt-2 accent-[#0099CC]" />
                <div className="flex justify-between text-[10.5px] text-[#556070] mt-0.5"><span>{t('income.rent_min')}</span><span>{t('income.rent_max')}</span></div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t('income.occupancy')}><NumberInput value={occupancy} set={setOccupancy} min={0} max={100} suffix="%" /></Field>
                <Field label={t('income.rent_growth')}><NumberInput value={rentGrowth} set={setRentGrowth} min={0} max={15} suffix="%" /></Field>
              </div>
            </Card>
          )}

          {/* Expenses */}
          <Card icon="📉" title={t('expenses.title')}>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('expenses.prop_tax')}><NumberInput value={propTaxPct} set={setPropTaxPct} min={0} max={3} step={0.1} suffix="%" /></Field>
              <Field label={t('expenses.mgmt')}><NumberInput value={mgmtPct} set={setMgmtPct} min={0} max={30} suffix="%" /></Field>
              <Field label={t('expenses.maint')}><NumberInput value={maintPct} set={setMaintPct} min={0} step={0.1} suffix="%" /></Field>
              <Field label={t('expenses.insurance')}><NumberInput value={insPct} set={setInsPct} min={0} step={0.1} suffix="%" /></Field>
            </div>
            <Field label={t('expenses.confotur_label')} hint={t('expenses.confotur_hint')}>
              <SelectInput value={confoturYrs} set={v => setConfoturYrs(+v)} options={[
                [10, t('expenses.confotur_yes')],
                [0,  t('expenses.confotur_no')],
              ]} />
            </Field>
            <Field label={t('expenses.appreciation')}>
              <NumberInput value={appRate} set={setAppRate} min={0} max={20} step={0.5} suffix="%" />
            </Field>
          </Card>
        </div>

        {/* ── RIGHT: RESULTS ── */}
        <div>
          {/* KPI grid */}
          <Card icon="📊" title={t('kpis.title')}>
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
                <div className="font-sans text-4.25 font-bold text-[#0D1B3E]">{t('chart.title')}</div>
                <div className="flex gap-3.5 text-[11.5px] text-[#556070]">
                  {[['#10b981', t('chart.income')], ['#ef4444', t('chart.expenses')], ['#0099CC', t('chart.net')]].map(([col, l], i) => (
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
                      <div className="text-[10.5px] text-[#556070] mt-1.5">{t('chart.year', { n: yr.y })}</div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Break-even timeline */}
          {!calc.flip && (
            <Card icon="⏱" title={t('breakeven.title')}>
              <div className="text-3.25 text-[#556070] mb-2.5">{t('breakeven.sub')}</div>
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
                      <span>{t('breakeven.today')}</span>
                      <span className="hidden sm:inline">{t('breakeven.yr5')}</span>
                      <span className="text-[#0D1B3E] font-bold">{isFinite(calc.breakeven) ? calc.breakeven.toFixed(1) + ' ' + t('breakeven.yrs_done') : t('breakeven.no_profit')}</span>
                      <span className="hidden sm:inline">{t('breakeven.yr20')}</span>
                      <span>{t('breakeven.yr30')}</span>
                    </div>
                  </>
                )
              })()}
            </Card>
          )}

          {/* Scenario comparison table */}
          {!calc.flip && calc.scenarios && (
            <Card icon="⚖️" title={t('comparison.title')}>
              <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full border-collapse font-sans min-w-105">
                <thead>
                  <tr>
                    {[t('comparison.col_scenario'), t('comparison.col_roi'), t('comparison.col_cf'), t('comparison.col_be')].map((h, i) => (
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
              </div>
            </Card>
          )}

          {/* Export / CTA */}
          <Card icon="📤" title={t('export.title')}>
            <div className="flex gap-2 flex-wrap">
              {[
                [t('export.pdf'),      '#fff', '#0D1B3E', '#E2E8F0'],
                [t('export.link'),     '#fff', '#0D1B3E', '#E2E8F0'],
                [t('export.whatsapp'), '#25D366', '#fff', '#25D366'],
              ].map(([l, bg, fg, bd], i) => (
                <button key={i} className="flex-1 basis-32.5 py-2.75 px-3.5 rounded-md font-sans text-3.25 font-semibold cursor-pointer"
                  style={{ border: `1px solid ${bd}`, background: bg as string, color: fg as string }}>{l}</button>
              ))}
            </div>
            <div className="text-2.75 text-[#556070] mt-3 leading-normal">
              <strong className="text-[#0D1B3E]">{t('export.note')}</strong> {t('export.disclaimer')}
            </div>
          </Card>

          {/* Talk to an agent */}
          <div className="rounded-2xl p-6 text-center"
            style={{ background: 'linear-gradient(135deg, #0D1B3E 0%, #1a3a6e 100%)' }}>
            <div className="text-4.5 mb-2">🏡</div>
            <div className="font-sans text-4.5 font-bold text-white mb-2">{t('cta.heading')}</div>
            <p className="text-3.25 text-white/65 mb-4 leading-normal">{t('cta.sub')}</p>
            <div className="flex gap-2.5 justify-center flex-wrap">
              <button onClick={() => go('contact')}
                className="font-sans text-3.25 font-semibold cursor-pointer py-2.75 px-5.5 rounded-full border-none bg-[#0099CC] text-white">
                {t('cta.talk')}
              </button>
              <button onClick={() => go('search')}
                className="font-sans text-3.25 font-semibold cursor-pointer py-2.75 px-5.5 rounded-full bg-transparent text-white/80 border border-white/25">
                {t('cta.browse')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
