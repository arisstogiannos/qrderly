'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TablesSetup({ initialTables }: { initialTables?: string[] }) {
  const [noTables, setNoTables] = useState(initialTables?.length ?? 3);
  const [tables, setTables] = useState<string[]>(initialTables ?? ['1', '2', '3']);
  const t = useTranslations('tablesSetup');

  function handleTableNumberChange(value: number) {
    if (value > tables.length) {
      const newElements: string[] = [];
      for (let index = tables.length + 1; index <= value; index++) {
        newElements.push(index.toString());
      }
      setTables((prev) => [...prev, ...newElements]);
    } else {
      setTables((prev) => prev.slice(0, value));
    }
    setNoTables(value);
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-1 max-w-lg">
        <Label htmlFor="noTables">{t('numberOfTables')}</Label>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
        <Input
          id="noTables"
          name="noTables"
          value={noTables}
          onChange={(e) => handleTableNumberChange(Number(e.target.value))}
          type="number"
          required
          className="w-20 my-1"
        />
      </div>
      <p className="text-sm">{t('tableRange', { noTables })}</p>
      <div className="flex flex-row flex-wrap gap-2">
        {tables.map((table, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              id={`table-${i + 1}`}
              name={`table-${i + 1}`}
              type="text"
              pattern="[^,]*"
              title={`${t('validation')}`}
              defaultValue={table}
              onChange={(e) =>
                setTables((prev) => prev.map((p, index) => (i === index ? e.target.value : p)))
              }
              placeholder={t('placeholder', { tableNumber: i + 1 })}
              className="max-w-20"
              required
            />
          </div>
        ))}
      </div>
      <input hidden defaultValue={tables.join(',')} name="tables" />
    </div>
  );
}
