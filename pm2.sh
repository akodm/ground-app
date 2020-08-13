cd server
pm2 start ecosystem.config.js #--env production
echo "server start"
cd ..
cd client #/build
pm2 start ecosystem.config.js
echo "client start"
pm2 logs