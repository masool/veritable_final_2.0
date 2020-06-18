cd veritable/javascript/wallet

rm -rf *

echo "wallet keys has ben deleted"
echo
cd ../
sleep 2
echo "run enroll admin for NOTARY"
node enrollAdminNotary.js
echo
echo "Run register user for NOATRY"
node registerUserNotary.js
echo
echo "run enroll admin for CLIENT"
node enrollAdminClient.js
echo
echo "Run register user for CLIENT"
node registerUserClient.js
echo
echo "run enroll admin for PARTIES"
node enrollAdminParties.js
echo
echo "Run register user for PARTIES"
node registerUserParties.js
echo
echo "start npm"
echo
npm start