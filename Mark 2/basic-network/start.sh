bash generate.sh
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d

sleep 1

echo
echo "##################################################"
echo "####### Createing channel 'channeluidai' ########"
echo "##################################################"
echo
docker exec -e "CORE_PEER_LOCALMSPID=OrguidaiMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orguidai.example.com/msp" peer0.orguidai.example.com peer channel create -o orderer.example.com:7050 -c channeluidai -f /etc/hyperledger/configtx/channeluidai.tx --outputBlock /etc/hyperledger/configtx/channeluidai.block
echo
sleep 2

echo
echo "##################################################"
echo "#######  Createing channel 'channelboth' ########"
echo "##################################################"
echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgdl.example.com/msp" peer0.orgdl.example.com peer channel create -o orderer.example.com:7050 -c channelboth -f /etc/hyperledger/configtx/channelboth.tx --outputBlock /etc/hyperledger/configtx/channelboth.block
echo
sleep 2

echo
echo "##############################################################################"
echo "#######  Joining Peer of Orguidai to channel 'channeluidai' ########"
echo "##############################################################################"
echo

docker exec -e "CORE_PEER_LOCALMSPID=OrguidaiMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orguidai.example.com/msp" peer0.orguidai.example.com peer channel join -b /etc/hyperledger/configtx/channeluidai.block
sleep 2

echo
echo "##############################################################################"
echo "#######  Joining Peers of Orgdl and Orguidai to channel 'channelboth' ########"
echo "##############################################################################"
echo

docker exec -e "CORE_PEER_LOCALMSPID=OrguidaiMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orguidai.example.com/msp" peer0.orguidai.example.com peer channel join -b /etc/hyperledger/configtx/channelboth.block
sleep 5

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e  "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@orgdl.example.com/msp" peer0.orgdl.example.com peer channel join -b /etc/hyperledger/configtx/channelboth.block
echo