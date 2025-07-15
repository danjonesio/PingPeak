#!/bin/bash

for icon in amber.png default.png green.png red.png; do
    sips -z 16 16 "$icon" --out "16/$icon"
    sips -z 32 32 "$icon" --out "32/$icon"
    sips -z 48 48 "$icon" --out "48/$icon"
    sips -z 128 128 "$icon" --out "128/$icon"
done