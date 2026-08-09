#!/usr/bin/env node
/**
 * Deploy PandaOS to Vercel using a personal token:
 *   VERCEL_TOKEN=xxx node scripts/deploy-vercel.mjs
 * Or: vercel --prod --token $VERCEL_TOKEN
 */
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const token = process.env.VERCEL_TOKEN;
if (!token) {
  console.error('Set VERCEL_TOKEN (https://vercel.com/account/tokens)');
  process.exit(1);
}
console.log('Deploying with Vercel CLI…');
execSync('npx vercel@latest deploy --prod --yes --token ' + token + ' --scope josecapacho-gmailcoms-projects', {
  stdio: 'inherit',
  cwd: new URL('..', import.meta.url).pathname,
});
