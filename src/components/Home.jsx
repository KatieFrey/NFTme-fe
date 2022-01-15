import React from 'react';
import { Typography, Button } from 'antd';
const { Title } = Typography;

const styles = {
  welcome: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    alignContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    padding: "10px",
    maxWidth: "100vh"
  },
  content: {
    marginTop: "2em",
  },
  loginButton: {
    marginTop: "2em"
  }

}

function Home () {
  return(
    <div style={styles.welcome}>
      <Title>GAME TITLE</Title>
      <Title style={styles.content} level={3}>Welcome Crypto Pioneer!</Title>
      <Title style={{maxWidth: "50vw"}} level={4}>Welcome Crypto Pioneer!
It’s time to put those hard earned NFT’s of yours to good use. Grab an NFT from your wallet and take it into battle to prove your superiority once and for all!</Title>
      <div style={styles.loginButton}>
        <Button type="primary">LOGIN WITH METAMASK</Button>
      </div>
    </div>
  )
}

export default Home;
