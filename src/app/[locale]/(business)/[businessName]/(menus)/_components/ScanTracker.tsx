'use client';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { decryptTable } from '@/lib/table-crypt';
import { deactivateMenu, incrementMenuScans } from '../../_actions/menu';
export default function ScanTracker({
  menuId,
  businessId,
  businessName,
}: {
  menuId: string;
  businessId: string;
  businessName: string;
}) {
  const searchParams = useSearchParams();
  const table = searchParams.get('table');
  const inrementScans = useMutation({
    mutationFn: () => incrementMenuScans(menuId, businessId),
    retry: 3, // Retry up to 3 times if it fails
  });
  const deactivateMenuMutation = useMutation({
    mutationFn: () => deactivateMenu(businessName),
    retry: 3, // Retry up to 3 times if it fails
  });

  useEffect(() => {
    const scanKey = `scanned-${menuId}`;
    async function incrementScan() {
      if (table) {
        const tableId = await decryptTable(table, businessName);
        if (tableId === 'admin') {
          return;
        }
      }
      // Check if scan was already recorded in this session
      if (!sessionStorage.getItem(scanKey)) {
        inrementScans.mutate(); // Increment scan count
        sessionStorage.setItem(scanKey, 'true'); // Mark scan as recorded
      }

      if (inrementScans.data && inrementScans.data >= 200) {
        deactivateMenuMutation.mutate();
      }
    }

    incrementScan();
  }, [
    menuId,
    inrementScans.data,
    businessName,
    table,
    deactivateMenuMutation.mutate,
    inrementScans.mutate,
  ]);

  return null;
}
