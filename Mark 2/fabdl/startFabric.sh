
sleep 3

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabdl -c '{"function":"AddVehicle","Args":["865219083334","asd","asd","asd","asd","asd","asd"]}'
echo

sleep 3

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabdl -c '{"function":"AddAddressData","Args":["865219083334","mumbai","delhi","aligarh","110095","delhi"]}'
echo



sleep 3

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabdl -c '{"function":"AddRTO","Args":["100000","Add line 1","Add line 2","cityyy","stateeee","2155112"]}'
echo
sleep 3


echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabdl -c '{"function":"AddOfficer","Args":["Cop","Singh","652910866634","Female","05/99/2016","45","8108162250","abcd@asjd.com","100000"]}'
echo
sleep 3


echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabdl -c '{"function":"AddTicket","Args":["215512","865219083334","8108162250","drinking","05/11/1975","4AM","India","false"]}'
echo
sleep 3

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabdl -c '{"function":"LicenseApply","Args":["865219083334","Learning","0xagsjdfsd"]}'
echo
sleep 3

echo
docker exec -e "CORE_PEER_LOCALMSPID=OrgdlMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabdl -c '{"function":"AddTestResult","Args":["865219083334","Written","78","100","40","8108162250","L865219083334"]}'
echo
sleep 3
