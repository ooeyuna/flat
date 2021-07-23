#!/bin/bash
set -ex;

export TAG=${TAG-:latest}

export ENV=${ENV-:development}


docker build . -f deploy/Dockerfile -t agoraflat/flat-web:$TAG --build-arg build_env=$ENV --ulimit nofile=65535:65535
