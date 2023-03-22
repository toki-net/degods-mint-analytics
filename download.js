const axios = require('axios');
const fs = require('fs');
const Papa = require('papaparse');

const blockHeight = 781282; // Replace with the desired block height

(async () => {
  try {
    // Fetch the block hash from the block height
    const blockHashResponse = await axios.get(`https://blockchain.info/block-height/${blockHeight}?format=json`);
    const blockHash = blockHashResponse.data.blocks[0].hash;

    // Fetch block data
    const blockResponse = await axios.get(`https://blockchain.info/rawblock/${blockHash}`);
    const block = blockResponse.data;

    // Prepare CSV data
    const csvData = block.tx.map(tx => {
      return tx.out.map(output => ({
        tx_hash: tx.hash,
        output_index: output.n,
        value: output.value,
        address: output.addr,
        timestamp: block.time,
      }));
    }).flat();

    // Write CSV data to file
    const csv = Papa.unparse(csvData);
    fs.writeFile(`block_${blockHeight}.csv`, csv, (err) => {
      if (err) {
        console.error('Error writing CSV file:', err);
      } else {
        console.log('CSV file written successfully.');
      }
    });

  } catch (error) {
    console.error('Error fetching block data:', error);
  }
})();
