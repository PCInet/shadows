cd ./flex-components/$1 && tar -cjf ../$1.tar.bz2 ./ && cd ../../
node --no-warnings ./scripts/js/flex-add.js $1