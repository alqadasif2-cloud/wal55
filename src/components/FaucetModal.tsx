import React, { useState } from 'react';
import { User } from '../types/wallet';
import { Sparkles, X, AlertTriangle, Ban } from 'lucide-react';

interface FaucetModalProps {
  currentUser: User;
  isArabic: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({
  currentUser,
  isArabic,
  onClose,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(100);

  // Fully disabled: prevents any balance update or database write
  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    // Intentionally no-op to prevent deposit execution
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0d1424] border border-cyan-500/30 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              {isArabic ? 'إيداع رصيد (شراء)' : 'Instant Deposit (Buy)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clear Disabled Notice Banner */}
        <div className="p-3.5 my-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">
              {isArabic ? 'خدمة الإيداع معطلة حالياً' : 'Deposit Service Currently Unavailable'}
            </span>
            <span className="text-[11px] text-amber-200/80 leading-relaxed block">
              {isArabic
                ? 'تم تعطيل عمليات الإيداع المباشر في هذا الإصدار لأسباب تنظيمية وأمنية. لا يمكن إضافة رصيد للمحفظة عبر هذه النافذة.'
                : 'Direct deposit has been disabled in this version. No funds can be deposited via this modal.'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-2 leading-relaxed">
          {isArabic
            ? 'باقات الإيداع المرجعية (للعرض فقط):'
            : 'Reference deposit tiers (view only):'}
        </p>

        {/* Amount Selector (Disabled) */}
        <div className="grid grid-cols-3 gap-2 my-3">
          {[50, 100, 500].map(amt => (
            <button
              key={amt}
              type="button"
              disabled
              onClick={() => setSelectedAmount(amt)}
              className={`py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-not-allowed opacity-60 ${
                selectedAmount === amt
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              +${amt}
            </button>
          ))}
        </div>

        {/* Disabled Action Button */}
        <button
          type="button"
          disabled
          onClick={handleClaim}
          className="w-full py-3 rounded-2xl bg-slate-800 text-slate-400 font-bold text-xs border border-slate-700/60 shadow-none cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
        >
          <Ban className="w-3.5 h-3.5 text-rose-400" />
          <span>
            {isArabic ? 'الإيداع غير متاح حالياً' : 'Deposit Disabled'}
          </span>
        </button>
      </div>
    </div>
  );
};
