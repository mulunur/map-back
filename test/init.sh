rm -f ./test/coverage/jest_output.txt

yarn jest --config=jest.config.js --runInBand |& tee -a ./test/coverage/jest_output.txt