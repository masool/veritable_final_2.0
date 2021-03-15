cd neosoft-network/
sudo ./network.sh down
sudo ./network.sh up -ca -s couchdb
sudo ./network.sh createChannel
sudo ./network.sh deployCC -l javascript
