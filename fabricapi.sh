cd neosoft/javascript/wallet

rm -rf *

echo "wallet keys has ben deleted"
echo
cd ../
sleep 2
echo "run enroll admin for NOTARY"
node enrollAdminNeo.js
echo
echo "Run register user for NOATRY"
node registerUserNeo.js
echo
echo "start npm"
npm install
echo
npm start
