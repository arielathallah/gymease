'use client';

import { useEffect } from 'react';
import { initLocalStorageDb } from '@/services/db';

export default function Initializer() {
  useEffect(() => {
    initLocalStorageDb();
  }, []);
  
  return null;
}
