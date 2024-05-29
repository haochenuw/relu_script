# take input
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <i>"
  exit 1
fi

# Get the input argument
i=$1

path_to_go="/Users/haoche/Repos/Hao/parity-challenge/lattigo/app/main.go"
fileName="/Users/haoche/pup-example/out/out_$i.bin"

cc="artefacts/context"
key_public="artefacts/public_key"
key_eval="artefacts/relinearization_key"
input="artefacts/ciphertext_0_0"
output=$fileName

# run go script
cd /Users/haoche/Repos/Hao/parity-challenge/lattigo/app/
go run "$path_to_go" --cc="$cc" --key_public="$key_public" --key_eval="$key_eval" --input="$input" --output="$output" --index="$i"


# run javascript
cd /Users/haoche/pup-example/
node pchrome.js "$fileName" "$i"
