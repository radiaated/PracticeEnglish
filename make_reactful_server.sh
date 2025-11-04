cd client/
npm run build
rm ../server/dist/ -f
mv dist/ ../server/dist/
cd ..