# take input
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <start> <end>"
  exit 1
fi

# Get the input argument
start=$1
end=$2

goDir="/Users/haoche/Repos/Hao/parity-challenge/lattigo/app/"

path_to_go="${goDir}main.go"
dirName="/Users/haoche/pup-example/out/"

cc="artefacts/context"
key_public="artefacts/public_key"
key_eval="artefacts/relinearization_key"
input="artefacts/ciphertext_0_0"


cd $goDir
for (( i=start; i<=end; ++i ));
do
  suffix="out_$i.bin"
  output="$dirName$suffix"
  echo $i
  go run "$path_to_go" --cc="$cc" --key_public="$key_public" --key_eval="$key_eval" --input="$input" --output="$output" --index="$i"
done
# run go script


# run javascript
cd /Users/haoche/pup-example/
node pchrome.js "$dirName" "$start" "$end"
