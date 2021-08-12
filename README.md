# dchan-subgraph

Official [dchan](https://dchan.network) subgraph.

## Development

* `./bin/docker_start_node.sh`
* Once started open a new terminal and `./bin/docker_bash.sh`
  * `cp subgraph.ganache.yaml subgraph.yaml`
  * `./bin/deploy.sh`
    * Change `address` in `subgraph.yaml` everytime you deploy a new contract
  * `./bin/subgraph_deploy.sh` to update the subgraph

In case of problems refer to [this guide](https://thegraph.com/docs/developer/quick-start) or to the google of internet

## Credits

Based on [@DennisonBertram](https://twitter.com/DennisonBertram/)'s [`poster-token`](https://github.com/crazyrabbitLTC/poster-token).