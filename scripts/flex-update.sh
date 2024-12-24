cd ./flex-components/$1 && tar -cjf ../$1.tar.bz2 ./ && cd ../../
node --no-warnings ./js/scripts/flex-add.js $1