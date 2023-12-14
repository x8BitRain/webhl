pnpm build &&
sed -i '' 's/undefined/hl.svg/g' dist/index.html &&
cp assets/images/hl.svg dist/ &&
cp assets/images/missing.tga dist/ &&
touch 'dist/.nojekyll' &&
pnpm deploy
