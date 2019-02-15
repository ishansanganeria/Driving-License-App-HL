#!/bin/bash

export CHANNEL_NAME=mychannel

peer channel create -o orderer.seva.gov.in:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/seva.gov.in/orderers/orderer.seva.gov.in/msp/tlscacerts/tlsca.seva.gov.in-cert.pem
