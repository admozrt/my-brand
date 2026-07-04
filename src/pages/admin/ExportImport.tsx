import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { getDb, persistDb } from '@/lib/db/client';
import initSqlJs from 'sql.js';
import { toast } from '@/components/ui/use-toast';

export function ExportImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    const db = await getDb();
    const bytes = db.export();
    const blob = new Blob([bytes], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.sqlite';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Data diekspor',
      description: 'Simpan file ini sebagai public/data.sqlite di project, lalu commit & push.',
    });
  }

  async function handleImportChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = new Uint8Array(await file.arrayBuffer());
    const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
    const importedDb = new SQL.Database(buffer);
    await persistDb(importedDb);
    toast({ title: 'Data diimpor', description: 'Muat ulang halaman untuk melihat perubahan.' });
    e.target.value = '';
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-xl font-bold mb-6">Export / Import Data</h1>

      <div className="rounded-lg border border-neutral-text/10 bg-white p-5 mb-4">
        <h2 className="font-semibold mb-2">Export Data</h2>
        <p className="text-sm text-neutral-text/60 mb-4">
          Unduh seluruh data (produk, promo, testimoni, pengaturan brand) sebagai file data.sqlite. Simpan
          file ini sebagai <code className="text-xs bg-neutral-text/5 px-1 py-0.5 rounded">public/data.sqlite</code> di
          project, lalu commit &amp; push. Pengunjung baru maupun lama akan otomatis melihat data ini.
        </p>
        <Button onClick={handleExport}>Export Data</Button>
      </div>

      <div className="rounded-lg border border-neutral-text/10 bg-white p-5">
        <h2 className="font-semibold mb-2">Import Data</h2>
        <p className="text-sm text-neutral-text/60 mb-4">
          Muat ulang database dari file .sqlite hasil export sebelumnya. Data saat ini di browser ini akan
          digantikan.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".sqlite,.db"
          onChange={handleImportChange}
          className="text-sm"
        />
      </div>
    </div>
  );
}
