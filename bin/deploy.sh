#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd $SCRIPT_DIR/..

./bin/ipfs_fixtures.sh
./bin/truffle_deploy.sh
./bin/subgraph_deploy.sh