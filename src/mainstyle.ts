import styled from "styled-components";

export const mainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px, 20px 20px 20px;
`;

export const walletConnector = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 10vh;
  padding-left: 1rem;
  padding-right: 1.5rem;
  width: 100%;
  background: #0f2027;
  color: white;
  background: -webkit-linear-gradient(to right, #2c5364, #203a43, #0f2027);
  background: linear-gradient(to right, #2c5364, #203a43, #0f2027);
  margin-bottom: 1em;
  word-break: break-all;
`;

export const walletConnectButton = styled.div`
  background: #0f2027;
  background: -webkit-linear-gradient(to right, #2c5364, #203a43, #0f2027);
  background: linear-gradient(to right, #2c5364, #203a43, #0f2027);
  padding: 0.5rem 3rem;
  font-size: 1em;
  border: 1px solid #2c5364;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  overflow: hidden;
`;
