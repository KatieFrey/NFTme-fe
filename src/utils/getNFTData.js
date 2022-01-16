export const getNFTData = ({
  NFTContract = '0xe4605d46fd0b3f8329d936a8b258d69276cba264',
  NFT_id = '149',
  ChainID = '1',
} = {}) => {
  var url =
    'https://api.covalenthq.com/v1/' +
    ChainID +
    '/tokens/' +
    NFTContract +
    '/nft_transactions/' +
    NFT_id +
    '/?key=ckey_0f181376d3c04f15b9901b44de1'
  var lastSalePrice = 0
  var numberOfSales = 0
  var daysInWallet = 0
  var daysInExistence = 0

  fetch(url)
    .then(function (response) {
      //console.log(response.json());
      return response.text()
    })
    .then(function (data) {
      var data_obj = JSON.parse(data)
      console.log('Error from Covalent: ' + data_obj.error)
      //var data_details = data.json();
      //console.log(data);
      var lastTransactionDate = new Date(
        data_obj.data.items[0].nft_transactions[0].block_signed_at,
      )
      var now = new Date()
      daysInWallet = Math.round(
        (now.getTime() - lastTransactionDate.getTime()) / (1000 * 3600 * 24),
      )
      numberOfSales = data_obj.data.items[0].nft_transactions.length
      for (var i in data_obj.data.items[0].nft_transactions) {
        lastSalePrice = data_obj.data.items[0].nft_transactions[i].value
        if (lastSalePrice > 0) {
          break
        }
      }
      //lastSalePrice = Math.round(lastSalePrice%100);
      var mintDate = new Date(
        data_obj.data.items[0].nft_transactions[
          numberOfSales - 1
        ].block_signed_at,
      )
      daysInExistence = Math.round(
        (now.getTime() - mintDate.getTime()) / (1000 * 3600 * 24),
      )
      console.log(data_obj.error)
      console.log(
        'lastSalePrice = ' +
          lastSalePrice +
          ', numberOfSales = ' +
          numberOfSales +
          ', daysInWallet ' +
          daysInWallet +
          ', daysInExistence ' +
          daysInExistence,
      )

      //Cap NFT stats
      if (lastSalePrice > 100) {
        lastSalePrice = 100
      }
      if (numberOfSales > 20) {
        numberOfSales = 20
      }
      if (daysInWallet > 365) {
        daysInWallet = 365
      }
      if (daysInExistence > 365) {
        daysInExistence = 365
      }

      //Convert to be within 1-10.
      lastSalePrice = Math.round(lastSalePrice / 10 / 2)
      numberOfSales = Math.round((numberOfSales * 5) / 10 / 2)
      daysInWallet = Math.round(daysInWallet / 36.5 / 2)
      daysInExistence = Math.round(daysInExistence / 36.5 / 2)

      //Apply weightings to base NFT data
      lastSalePrice = lastSalePrice / 2
      daysInExistence = daysInExistence / 2

      var attribute1 = Math.round(lastSalePrice + numberOfSales)
      var attribute2 = Math.round(daysInWallet + daysInExistence)
      var attribute3 = Math.round(Math.random() * 10)
      console.log(
        'Attribute 1: ' +
          attribute1 +
          ' Attribute 2: ' +
          attribute2 +
          ' Attribute 3: ' +
          attribute3,
      )

      //Update based on backend
      //BattleCryptography.methods.save(NFTContract, NFT_id, attribute1, attribute2, attribute3).call()

      return data_obj
    })
    .catch((error) => console.error('caught from Covalent API: ' + error))
}
