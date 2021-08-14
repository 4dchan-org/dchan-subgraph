#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

for f in $SCRIPT_DIR/../fixtures/ipfs/*; do
    echo "Uploading $(basename "$f")"
    curl -X POST -F "file=@$f" "https://api.thegraph.com/ipfs/api/v0/add"
    # curl -X POST -F "file=@$f" "http://ipfs:5001/api/v0/add"
done