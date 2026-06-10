import { Calculator } from 'lucide-react'
import { Card } from '../../components/dashboard/shared'

export function ROICalculator() {
  return (
    <Card title={<><Calculator size={14} />ROI Calculator</>}>
      <div className="py-6 text-center">
        <div className="flex justify-center mb-3 text-coral"><Calculator size={40} /></div>
        <p className="text-sm text-ink2 mb-4">Use the full ROI Calculator on the main site to model any listing.</p>
        <a
          href="https://ilovedrrealty.com/calculator"
          target="_blank"
          rel="noreferrer"
          className="inline-block text-[13.5px] font-bold text-white bg-coral rounded-full px-6 py-2.5 no-underline"
        >
          Open ROI Calculator →
        </a>
      </div>
    </Card>
  )
}
