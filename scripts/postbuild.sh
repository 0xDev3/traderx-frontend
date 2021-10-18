#!/usr/bin/env bash

echo "Running envsub on env.template.js to env.js"
envsub src/env.template.js dist/traderx/env.js

rm dist/traderx/ngsw.json
ngsw-config dist/traderx ngsw-config.json
