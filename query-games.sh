#!/bin/bash
~/onechain/target/release/sui client call \
  --package 0x3f4d51108c6ac9d388689521a62bd2273377b22304f262cfe57b5774eedc10ed \
  --module game_registry \
  --function get_games \
  --args 0x2e9828660d10a126323c2fa5f0b46ea8d1d75a9df28c327721bf80ea60bc7d82 \
  --gas-budget 10000000
