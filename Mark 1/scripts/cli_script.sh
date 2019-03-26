#!/bin/bash

export CHANNEL_BOTH=mychannel

peer channel create -o orderer.example.com:7050 -c $CHANNEL_BOTH -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
