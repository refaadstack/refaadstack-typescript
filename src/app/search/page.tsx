import type { Metadata } from 'next';
import { SearchForm } from './search-form';

export const metadata: Metadata = {
  title: 'Pencarian',
  description: 'Cari artikel, project, portfolio, dan produk RefaadStack.',
};

export default function SearchPage() {
  return (
    <div className="min-h-[60dvh]">
      <SearchForm />
    </div>
  );
}
