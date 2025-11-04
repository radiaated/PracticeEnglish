cd client/
npm run build
rm ../server/dist/ -rf
mv dist/ ../server/dist/
cd ..