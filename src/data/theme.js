
export const DARK_THEME = {
    // Very dark green/black (#02100B) gradient with subtle pattern
    bgClasses: "bg-black",
    bgGradientFrom: "from-black/10",
    bgGradientVia: "via-transparent",
    bgGradientTo: "to-black/30",

    text: "text-white",
    textSub: "text-gray-400",
    textAccent: "text-emerald-400",
    card: "bg-[#0a1410]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl",
    cardHover: "hover:bg-[#0f1f18]/80 transition-all duration-300 cursor-pointer border-white/20",
    btnPrimary: "bg-emerald-500 text-black font-medium py-3 px-6 rounded-full hover:bg-emerald-400 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(16,18,129,0.3)]",
    btnSecondary: "bg-white/10 text-white font-medium py-3 px-6 rounded-full hover:bg-white/20 backdrop-blur-md transition-all duration-200",
    btnGhost: "bg-transparent text-gray-400 hover:text-white transition-all",
    input: "w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all",
    navPill: "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/10 text-gray-400 hover:text-white",
    navPillActive: "bg-white/15 text-white shadow-inner border border-white/5",
    iconBtn: "p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all",
    glassNav: "relative z-50 mx-4 md:mx-auto max-w-7xl bg-transparent backdrop-blur-md border border-transparent rounded-full px-8 py-4 mt-6 mb-8",
    footer: "border-t border-white/5 mt-12 bg-black/60 backdrop-blur-lg py-12",
    tableHeader: "text-gray-500 font-medium border-b border-white/5",
    tableRow: "hover:bg-white/5 transition divide-y divide-white/5",
    divider: "border-white/10"
};

export const LIGHT_THEME = {
    // Soft beige/cream (#E3EED4) gradient with subtle pattern
    bgClasses: "bg-[#E3EED4] bg-[url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\\' fill=\\'%2394a3b8\\' fill-opacity=\\'0.05\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')]",
    bgGradientFrom: "from-[#E3EED4]/95 via-[#d4e5c0]/80",
    bgGradientVia: "via-[#E3EED4]",
    bgGradientTo: "to-[#c9dbb5]",

    text: "text-slate-900",
    textSub: "text-slate-500",
    textAccent: "text-emerald-600",
    card: "bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
    cardHover: "hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1 hover:bg-white/90 transition-all duration-300 cursor-pointer",
    btnPrimary: "bg-emerald-600 text-white font-medium py-3 px-6 rounded-full hover:bg-emerald-700 active:scale-95 transition-all duration-200 shadow-lg shadow-emerald-600/20",
    btnSecondary: "bg-white/80 text-slate-700 font-medium py-3 px-6 rounded-full hover:bg-white border border-slate-200 transition-all duration-200 shadow-sm",
    btnGhost: "bg-transparent text-slate-400 hover:text-slate-900 transition-all",
    input: "w-full bg-white/50 border border-slate-200 rounded-2xl p-4 outline-none text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner",
    navPill: "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-slate-200/50 text-slate-500 hover:text-slate-900",
    navPillActive: "bg-white text-slate-900 shadow-sm border border-slate-100",
    iconBtn: "p-3 rounded-full bg-white/60 border border-white/50 hover:bg-white text-slate-600 transition-all shadow-sm",
    glassNav: "relative z-50 mx-4 md:mx-auto max-w-7xl bg-transparent backdrop-blur-md border border-transparent rounded-full px-8 py-4 mt-6 mb-8",
    footer: "border-t border-slate-200 mt-12 bg-white/60 backdrop-blur-lg py-12",
    tableHeader: "text-slate-400 font-medium border-b border-slate-100",
    tableRow: "hover:bg-slate-50/50 transition divide-y divide-slate-100",
    divider: "border-slate-100"
};
