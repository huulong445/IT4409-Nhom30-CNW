import React from 'react';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>© {new Date().getFullYear()} <strong>Bệnh viện Bách Khoa</strong> (Đại học Bách Khoa Hà Nội). Cổng giải pháp số Y tế thông minh.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Phát triển theo tiêu chuẩn khám chữa bệnh Bộ Y Tế</span>
          <span>•</span>
          <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            Nền tảng iSOFHcare <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
