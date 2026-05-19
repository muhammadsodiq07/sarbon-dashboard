import { Suspense } from 'react';
import { CargoPageContent, CargoPageFallback } from '@/components/cargo/CargoPageContent';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function DispatcherCargoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
          <Suspense fallback={<CargoPageFallback />}>
            <CargoPageContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
