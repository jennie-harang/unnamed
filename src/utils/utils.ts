import { AuthStore } from '@/reducers/authSlice';
import type { AppState } from '@/reducers/store';

export const isProdLevel = (env: string): boolean => env === 'production';

export const getAuth = (key: keyof AuthStore) => (obj: AppState) => obj.authReducer[key];