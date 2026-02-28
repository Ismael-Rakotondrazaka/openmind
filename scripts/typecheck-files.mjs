import { execSync } from 'child_process';
import { unlinkSync, writeFileSync } from 'fs';

const files = process.argv.slice(2);

if (!files.length) {
  console.error('Usage: npm run typecheck:files -- <file1> <file2> ...');
  process.exit(1);
}

const tmpConfig = 'tsconfig.typecheck-tmp.json';

writeFileSync(
  tmpConfig,
  JSON.stringify(
    {
      extends: './.nuxt/tsconfig.json',
      include: ['.nuxt/nuxt.d.ts', ...files],
    },
    null,
    2
  )
);

try {
  execSync(`vue-tsc --noEmit --project ${tmpConfig}`, { stdio: 'inherit' });
} catch {
  process.exit(1);
} finally {
  unlinkSync(tmpConfig);
}
