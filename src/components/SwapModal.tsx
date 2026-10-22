import React, { useState, useMemo } from 'react';
import { User, Wallet, CryptoAsset } from '../types/wallet';
import { marketPriceService } from '../services/marketPriceService';
import { formatCurrency, formatCryptoAmount } from '../utils/formatters';
import { 
  X, 
  ArrowUpDown, 
  RefreshCw, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  Ban
} from 'lucide-react';

interface SwapModalProps {
  currentUser: User;
  wallet: Wallet | null;
  isArabic: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  currentUser,
  wallet,
  isArabic,
  onClose,
}) => {
  const assets: CryptoAsset[] = useMemo(() => {
    if (wallet?.assets && wallet.assets.length > 0) {
      return wallet.assets;
    }
    return [
      { symbol: 'USDT', name: 'Tether USD', nameAr: 'تيثر دولار', balance: 1000, usdPrice: 1, usdValue: 1000, change24h: 0.01, icon: '₮', network: 'BEP20' },
      { symbol: 'BTC', name: 'Bitcoin', nameAr: 'بيتكوين', balance: 0.05, usdPrice: 96000, usdValue: 4800, change24h: 2.5, icon: '₿', network: 'BTC' },
      { symbol: 'ETH', name: 'Ethereum', nameAr: 'إيثيريوم', balance: 0.8, usdPrice: 3500, usdValue: 2800, change24h: 1.8, icon: 'Ξ', network: 'ERC20' },
      { symbol: 'BNB', name: 'BNB Smart Chain', nameAr: 'بي إن بي', balance: 2.5, usdPrice: 640, usdValue: 1600, change24h: 3.2, icon: '◈', network: 'BEP20' },
      { symbol: 'SOL', name: 'Solana', nameAr: 'سولانا', balance: 5, usdPrice: 185, usdValue: 925, change24h: -0.8, icon: '◎', network: 'SOL' },
    ];
  }, [wallet]);

  const [fromSymbol, setFromSymbol] = useState<string>('USDT');
  const [toSymbol, setToSymbol] = useState<string>('BNB');
  const [fromAmountStr, setFromAmountStr] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const livePrices = marketPriceService.getPrices();

  const fromAsset = assets.find(a => a.symbol === fromSymbol) || assets[0];
  const toAsset = assets.find(a => a.symbol === toSymbol) || assets[1];

  // Get current USD rate for tokens
  const getPrice = (sym: string): number => {
    if (sym === 'USDT') return 1.0;
    return livePrices[sym]?.price || assets.find(a => a.symbol === sym)?.usdPrice || 1.0;
  };

  const fromPrice = getPrice(fromSymbol);
  const toPrice = getPrice(toSymbol);

  // Rate: how many "toAsset" per 1 "fromAsset"
  const exchangeRate = toPrice > 0 ? fromPrice / toPrice : 0;

  const fromAmount = parseFloat(fromAmountStr) || 0;
  const toAmount = fromAmount * exchangeRate;
  const toAmountFormatted = toAmount > 0 ? (toAmount < 0.0001 ? toAmount.toFixed(6) : toAmount.toFixed(4)) : '0.00';

  const handleFlip = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setFromAmountStr('');
    setErrorMsg('');
  };

  const handleMax = () => {
    if (fromAsset) {
      setFromAmountStr(fromAsset.balance.toString());
      setErrorMsg('');
    }
  };

  // Completely disabled: no balance modifications, no transactions, no notifications
  const handleSwap = () => {
    setErrorMsg(
      isArabic 
        ? 'ميزة التبادل الفوري معطلة حالياً لأعمال الصيانة والتحديث. لا يمكن تعديل الأرصدة.' 
        : 'Instant Swap is currently disabled. Balances cannot be modified.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {isArabic ? 'مبادلة العملات (عرض الأسعار)' : 'Instant Crypto Swap (Rates)'}
              </h2>
              <span className="text-[11px] text-slate-400">
                {isArabic ? 'استعراض أسعار الصرف الحية ومسارات السيولة' : 'Live exchange rates & liquidity routing'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clear Disabled Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">
              {isArabic ? 'خدمة التبادل الفوري معطلة حالياً' : 'Swap Service Currently Disabled'}
            </span>
            <span className="text-[11px] text-amber-200/80 leading-relaxed block">
              {isArabic
                ? 'تم تعطيل عمليات التبادل التي تغير الأرصدة في هذا الإصدار. يمكنك استعراض أسعار العملات ومعدل الصرف اللحظي فقط.'
                : 'Swaps that modify account balances are currently disabled. You can view live market prices and rates.'}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Swap Form */}
        <div className="space-y-3 relative">
          {/* FROM Asset Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex justify-between items-center mb-1.5 text-xs text-slate-400">
              <span>{isArabic ? 'أنت تدفع' : 'You Pay'}</span>
              <span>
                {isArabic ? 'المتاح: ' : 'Balance: '}
                <span className="text-slate-200 font-mono">
                  {formatCryptoAmount(fromAsset?.balance || 0)} {fromSymbol}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                value={fromAmountStr}
                onChange={e => {
                  setFromAmountStr(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="0.0"
                className="w-full bg-transparent text-2xl font-extrabold text-white font-mono placeholder-slate-600 focus:outline-none"
              />

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleMax}
                  className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] transition-colors"
                >
                  MAX
                </button>

                <select
                  value={fromSymbol}
                  onChange={e => setFromSymbol(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl py-1.5 px-3 text-xs font-bold focus:outline-none cursor-pointer"
                >
                  {assets.map(a => (
                    <option key={a.symbol} value={a.symbol} className="bg-slate-900">
                      {a.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              ≈ {formatCurrency(fromAmount * fromPrice)}
            </div>
          </div>

          {/* Flip / Invert Button in Center */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              type="button"
              onClick={handleFlip}
              className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-emerald-500 border border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all shadow-lg shadow-black/40"
              title={isArabic ? 'عكس العملات' : 'Switch tokens'}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* TO Asset Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex justify-between items-center mb-1.5 text-xs text-slate-400">
              <span>{isArabic ? 'أنت تستلم (تقديري)' : 'You Receive (Est.)'}</span>
              <span>
                {isArabic ? 'الرصيد: ' : 'Balance: '}
                <span className="text-slate-200 font-mono">
                  {formatCryptoAmount(toAsset?.balance || 0)} {toSymbol}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {toAmountFormatted}
              </span>

              <select
                value={toSymbol}
                onChange={e => setToSymbol(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl py-1.5 px-3 text-xs font-bold focus:outline-none cursor-pointer"
              >
                {assets.map(a => (
                  <option key={a.symbol} value={a.symbol} className="bg-slate-900">
                    {a.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              ≈ {formatCurrency(toAmount * toPrice)}
            </div>
          </div>
        </div>

        {/* Exchange Rate & Fee Info */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60 space-y-1.5 text-[11px]">
          <div className="flex justify-between text-slate-400">
            <span>{isArabic ? 'سعر الصرف' : 'Rate'}</span>
            <span className="font-mono text-slate-200">
              1 {fromSymbol} ≈ {exchangeRate < 0.0001 ? exchangeRate.toFixed(8) : exchangeRate.toFixed(4)} {toSymbol}
            </span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>{isArabic ? 'رسوم الشبكة المقدرة' : 'Est. Network Fee'}</span>
            <span className="font-mono text-emerald-400 font-bold">
              $0.00 (Zero Gas Promo)
            </span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>{isArabic ? 'مسار السيولة' : 'Routing'}</span>
            <span className="text-slate-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Trust Smart DEX Router v2
            </span>
          </div>
        </div>

        {/* Disabled Action Button */}
        <button
          type="button"
          onClick={handleSwap}
          disabled
          className="w-full py-4 rounded-2xl bg-slate-800 text-slate-400 font-extrabold text-sm border border-slate-700/60 shadow-none cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
        >
          <Ban className="w-4 h-4 text-rose-400" />
          <span>
            {isArabic ? 'التبادل غير متاح حالياً' : 'Swap Currently Unavailable'}
          </span>
        </button>
      </div>
    </div>
  );
};
