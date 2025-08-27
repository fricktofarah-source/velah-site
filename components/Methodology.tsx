// components/Methodology.tsx
"use client";

export default function Methodology() {
  return (
    <details className="mt-10 rounded-2xl border bg-white/70 backdrop-blur p-4 sm:p-5">
      <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
        <span>Methodology & assumptions</span>
        <span aria-hidden className="ml-3">+</span>
      </summary>

      <div className="mt-3 text-sm text-slate-600 space-y-2">
        <p>
          These targets reflect initial service modeling and will evolve as routes, volumes, and return rates improve.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Reuse rate</strong>: Share of liters delivered in bottles that are collected and re-deployed.</li>
          <li><strong>Plastic reduction</strong>: Compared with typical single-use case purchases for similar households.</li>
          <li><strong>CO₂ per liter</strong>: Based on optimized routing and pooled returns; excludes customer travel to stores.</li>
        </ul>
        <p className="text-xs text-slate-500">Figures are indicative; final reporting will use measured return cycles and route telemetry.</p>
      </div>
    </details>
  );
}
