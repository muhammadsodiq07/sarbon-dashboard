'use client';
import Image from 'next/image';
import { useT } from '@/hooks/useT';

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center">
              <Image
                src="/srb.png"
                alt="Sarbon"
                width={120}
                height={32}
                className="h-7 w-auto"
              />
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Foydali */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">
              {t('footer.useful')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#" className="hover:text-emerald-700">{t('footer.distance_calc')}</a></li>
              <li><a href="#" className="hover:text-emerald-700">{t('footer.releases')}</a></li>
              <li><a href="#" className="hover:text-emerald-700">{t('footer.help_center')}</a></li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">
              {t('footer.contacts')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#" className="hover:text-emerald-700">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-emerald-700">{t('footer.contact_info')}</a></li>
              <li><a href="#" className="hover:text-emerald-700">{t('footer.tariffs')}</a></li>
            </ul>
          </div>

          {/* Ma'lumot */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">
              {t('footer.info')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#" className="hover:text-emerald-700">{t('footer.privacy')}</a></li>
              <li><a href="#" className="hover:text-emerald-700">{t('footer.sitemap')}</a></li>
              <li><a href="#" className="hover:text-emerald-700">{t('footer.terms')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom row: app badges + copyright */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 text-xs font-medium text-slate-700">
              {t('footer.mobile_app')}
            </div>
            <div className="flex gap-2">
              <a
                href="#"
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-slate-800"
                aria-label="App Store"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                App Store
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-slate-800"
                aria-label="Google Play"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5V3.5a1 1 0 0 1 1.5-.866L20 11.5a1 1 0 0 1 0 1.732L4.5 21.366A1 1 0 0 1 3 20.5z"/>
                </svg>
                Google Play
              </a>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Sarbon. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}