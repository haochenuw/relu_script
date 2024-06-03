#!/bin/bash

# Define an array of 6 strings
strings=("taked55011@adrais.com" "kodof81456@jzexport.com" "jopol63573@hutov.com")

# Loop from 0 to 5 (since array indices start at 0 in bash)
for i in {0..2}
do
  # Calculate the two input values
  input1=$(((i + 1) * 1500))
  input2=$(((i + 2) * 1500))

  # Get the string corresponding to the current index
  current_string="${strings[i]}"

  # Run the subscript foo.sh with the calculated inputs and the current string
  ./main.sh "$input1" "$input2" "$current_string"
done
