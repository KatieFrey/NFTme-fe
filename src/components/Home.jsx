import React, { useEffect, useState } from 'react'
import { useMoralis, useNFTBalances } from 'react-moralis'
import {
  Card,
  Image,
  Tooltip,
  Typography,
  Button,
  Modal,
  Skeleton,
  Carousel,
} from 'antd'
import {
  FileSearchOutlined,
  SendOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { connectors } from './Account/config'
import Text from 'antd/lib/typography/Text'
import { useVerifyMetadata } from 'hooks/useVerifyMetadata'
import axios from 'axios';
const { Title } = Typography
const { Meta } = Card

const styles = {
  welcome: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center',
    fontFamily: 'Roboto, sans-serif',
    color: '#041836',
    padding: '10px',
    maxWidth: '100vh',
  },
  content: {
    marginTop: '2em',
  },
  loginButton: {
    marginTop: '2em',
  },
  connector: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20px 5px',
    cursor: 'pointer',
  },
}

function Home() {
  const {
    authenticate,
    isAuthenticated,
    account,
    chainId,
    logout,
    Moralis
  } = useMoralis()
  const { data: NFTBalances, getNFTBalances } = useNFTBalances()
  const [isBattleModalVisible, setIsBattleModalVisible] = useState(false)
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false)
  const { verifyMetadata } = useVerifyMetadata()

  const acquireTradeData = async (data) => {
    let tradeHash = {}
    console.log("Data: ", data)
    let nftData = await data.map((nft) => {
        return [nft.token_address, nft.token_id];
    });

    for(const nftAddress of nftData) {
      console.log("NFT Address Array: ", nftAddress)
      const options = { address: nftAddress[0]};
      const response = await Moralis.Web3API.token.getNFTTrades(options);

      // const options = {method: 'GET'};
      // fetch(`https://api.opensea.io/api/v1/asset/${nftAddress[0]}/${nftAddress[1]}/`, options)
      // .then(response => response.json())
      // .then(response => console.log("data: ", response))
      // .catch(err => console.error(err));

      // const response = await axios.get(`https://fcpsgxa2ssb6.usemoralis.com:2053/server/nft/${nftAddress[0]}/trades`);


      console.log("response: ", response)
    }

  }


  useEffect(() => {

    if(NFTBalances && NFTBalances.result){
      acquireTradeData(NFTBalances.result)
    }

  }, [isAuthenticated, NFTBalances])

  return (
    <div style={styles.welcome}>
      <Title>GAME TITLE</Title>
      <Title style={styles.content} level={3}>
        Welcome Crypto Pioneer!
      </Title>
      <Title style={{ maxWidth: '50vw' }} level={4}>
        Welcome Crypto Pioneer! It’s time to put those hard earned NFT’s of
        yours to good use. Grab an NFT from your wallet and take it into battle
        to prove your superiority once and for all!
      </Title>
      <div style={styles.loginButton}>
        {isAuthenticated ? (
          <Button onClick={() => setIsBattleModalVisible(true)} type="primary">
            START A BATTLE
          </Button>
        ) : (
          <Button onClick={() => setIsAuthModalVisible(true)} type="primary">
            LOGIN WITH METAMASK
          </Button>
        )}
      </div>
      <Modal
        visible={isAuthModalVisible}
        footer={null}
        onCancel={() => setIsAuthModalVisible(false)}
        bodyStyle={{
          padding: '15px',
          fontSize: '17px',
          fontWeight: '500',
        }}
        style={{ fontSize: '16px', fontWeight: '500', width: '340px' }}

      >
        <div
          style={{
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '20px',
          }}
        >
          Connect Wallet
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {connectors.map(({ title, icon, connectorId }, key) => (
            <div
              style={styles.connector}
              key={key}
              onClick={async () => {
                try {
                  await authenticate({ provider: connectorId })
                  window.localStorage.setItem('connectorId', connectorId)
                  setIsAuthModalVisible(false)
                } catch (e) {
                  console.error(e)
                }
              }}
            >
              <img src={icon} alt={title} style={styles.icon} />
              <Text style={{ fontSize: '14px' }}>{title}</Text>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        visible={isBattleModalVisible}
        footer={null}
        onCancel={() => setIsBattleModalVisible(false)}
        bodyStyle={{
          padding: '15px',
          fontSize: '17px',
          fontWeight: '500',
        }}
        style={{ fontSize: '16px', fontWeight: '500', width: '340px'}}

      >
        <div
          style={{
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '20px',
          }}
        >
          Select an NFT to use for your battle:
        </div>
        <div>
          <Skeleton loading={!NFTBalances?.result}>
            <Carousel autoplay>
              {NFTBalances?.result &&
                NFTBalances.result.map((nft, index) => {
                  //Verify Metadata
                  nft = verifyMetadata(nft)
                  return (
                    <Card
                      hoverable
                      actions={[
                        <Tooltip title="View On Blockexplorer">
                          <FileSearchOutlined
                            onClick={() => console.log('1')}
                          />
                        </Tooltip>,
                        <Tooltip title="Transfer NFT">
                          <SendOutlined onClick={() => console.log('2')} />
                        </Tooltip>,
                        <Tooltip title="Sell On OpenSea">
                          <ShoppingCartOutlined
                            onClick={() => console.log('3')}
                          />
                        </Tooltip>,
                      ]}
                      style={{ width: 240, border: '2px solid #e7eaf3' }}
                      cover={
                        <Image
                          preview={false}
                          src={nft?.image || 'error'}
                          fallback="data:image/png;base64,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"
                          alt=""
                          style={{ height: '300px' }}
                        />
                      }
                      key={index}
                    >
                      <Meta title={nft.name} description={nft.token_address} />
                    </Card>
                  )
                })}
            </Carousel>
          </Skeleton>
        </div>
      </Modal>
    </div>
  )
}

export default Home
