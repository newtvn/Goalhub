
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { REPORTS } from '../../../data/constants';

export default function ReportsView({ handleDownloadPdf }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <div className={theme.card + " p-6 md:p-8"}>
            <div className="flex justify-between items-center mb-8"><div><h3 className="font-bold text-xl">System Reports</h3><p className={`text-sm ${theme.textSub}`}>Generate and download activity summaries.</p></div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {REPORTS.map(report => (
                    <div key={report.id} className={`border p-6 rounded-2xl flex justify-between items-center transition ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md'}`}>
                        <div className="flex items-center"><div className="bg-emerald-500/20 p-3 rounded-xl mr-4"><FileText className="h-6 w-6 text-emerald-500" /></div><div><div className="font-bold">{report.title}</div><div className={`text-xs uppercase font-bold mt-1 ${theme.textSub}`}>{report.type} • {report.date}</div></div></div>
                        <button onClick={() => handleDownloadPdf(report.title)} className={`p-3 rounded-full transition ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'}`}><Download className="h-5 w-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}
