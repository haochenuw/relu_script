#!/bin/bash
# Loop through numbers 1 to 10
for i in {0..100}
do
    # Call another program with i as an argument
    ./main.sh "$i"
done
