import { InjectionToken } from '@angular/core';
import { MetaConfig } from './meta-config';

export const META_CONFIG_TOKEN = new InjectionToken<MetaConfig>('meta config');
export const META_GUARD_IDENTIFIER = 'MetaGuard';
