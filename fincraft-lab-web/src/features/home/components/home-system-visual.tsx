import { CircleDollarSign, CreditCard, PieChart, ShieldAlert, Wallet } from "lucide-react";

export function HomeSystemVisual() {
  return (
    <div className="home-system-visual" aria-hidden="true">
      <div className="home-system-canvas">
        <svg className="home-system-lines" viewBox="0 0 500 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M110 90 L250 180" stroke="var(--brand-primary)" strokeWidth="2" strokeDasharray="4 4" className="home-flow-line" />
          <path d="M110 270 L250 180" stroke="var(--brand-accent)" strokeWidth="2" strokeDasharray="4 4" className="home-flow-line" />
          <path d="M250 180 L390 100" stroke="var(--brand-primary)" strokeWidth="2" strokeDasharray="4 4" className="home-flow-line" />
          <path d="M250 180 L390 260" stroke="var(--brand-accent)" strokeWidth="2" strokeDasharray="4 4" className="home-flow-line" />
        </svg>

        {/* Node 1: Income */}
        <div className="home-visual-node home-visual-node-income style-node-1">
          <div className="home-node-icon"><CircleDollarSign size={18} /></div>
          <div className="home-node-info">
            <span className="home-node-label">Income</span>
            <span className="home-node-type">BASE</span>
          </div>
        </div>

        {/* Node 2: Expense */}
        <div className="home-visual-node home-visual-node-expense style-node-2">
          <div className="home-node-icon"><CreditCard size={18} /></div>
          <div className="home-node-info">
            <span className="home-node-label">Expense</span>
            <span className="home-node-type">BASE</span>
          </div>
        </div>

        {/* Center Node: Cash Flow */}
        <div className="home-visual-node home-visual-node-hub style-node-center">
          <div className="home-node-icon"><Wallet size={20} /></div>
          <div className="home-node-info">
            <span className="home-node-label">Net Cash Flow</span>
            <span className="home-node-type">DISCOVERY</span>
          </div>
        </div>

        {/* Node 3: Savings */}
        <div className="home-visual-node home-visual-node-savings style-node-3">
          <div className="home-node-icon"><PieChart size={18} /></div>
          <div className="home-node-info">
            <span className="home-node-label">Emergency Fund</span>
            <span className="home-node-type">CONCEPT</span>
          </div>
        </div>

        {/* Node 4: Debt Risk */}
        <div className="home-visual-node home-visual-node-risk style-node-4">
          <div className="home-node-icon"><ShieldAlert size={18} /></div>
          <div className="home-node-info">
            <span className="home-node-label">Debt Pressure</span>
            <span className="home-node-type">RISK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
