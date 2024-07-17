import React, { useState, useEffect } from 'react';
import './App.css';
import SettingsPanel from './SettingsPanel';
import { oneDeckBS, twoDeckBS, multiDeckBS } from './basicStrategy';

function App() {
  const [dealerCard, setDealerCard] = useState('');
  const [playerHands, setPlayerHands] = useState([[]]);
  const [handSplits, setHandSplits] = useState([false]);
  const [actions, setActions] = useState(['']);
  const [message, setMessage] = useState('');
  const [handTotals, setHandTotals] = useState([0]);
  const [settings, setSettings] = useState({
    shoeComposition: '1',
    blackjackPays: '3:2',
    holeCard: 'dealer-peeks',
    soft17: 'dealer-hits',
    doubleDown: 'any-two',
    split2s10s: '3-times',
    splitAces: '1-time',
    drawToSplitAces: 'not-allowed',
    doubleAfterSplit: 'allowed',
  });
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const addPlayerCard = (handIndex, card) => {
    if (handTotals[handIndex] >= 21) {
      return;
    }
    else if (!dealerCard && playerHands[handIndex].length === 2){
      setMessage('Need a Dealer Card')
      return
    }

    const newHands = [...playerHands];
    newHands[handIndex].push(card);
    setPlayerHands(newHands);

    const newTotal = calculateHandTotal(newHands[handIndex]);

    if (newTotal > 21) {
      setMessage('Busted');
    } 
    else if (newTotal === 21){
      setMessage('BLACKJACK!')
    }
    else {
      setMessage('');
    }
  };

  const removePlayerCard = (handIndex, cardIndex) => {
    if (handSplits[handIndex] && cardIndex === 0) return; // Prevent removal of the first card if the hand has been split
    const newHands = [...playerHands];
    newHands[handIndex].splice(cardIndex, 1);
    setPlayerHands(newHands);
    setMessage('');
  };

  const clearPlayerCards = () => {
    setPlayerHands([[]]);
    setHandSplits([false]);
    setActions(['']);
    setMessage('');
  };

  const splitHand = (handIndex) => {
    const newHands = [...playerHands];
    const newSplits = [...handSplits];
    const cardToSplit = newHands[handIndex][0];
    newHands[handIndex] = [cardToSplit];
    newHands.push([cardToSplit]);
    newSplits[handIndex] = true;
    newSplits.push(true);
    setPlayerHands(newHands);
    setHandSplits(newSplits);
    setActions([...actions, '']);
    setMessage('')
  };

  const getCardImage = (card) => {
    return `/cards/${card}.png`;
  };

  const calculateAction = (handIndex) => {
    if (playerHands[handIndex].length < 2) {
      setMessage('Need two cards for player.');
      return;
    }
    const playerTotal = handTotals[handIndex];
    if (playerTotal > 21) {
      setMessage('Busted');
      return;
    }
    if(playerTotal === 21){
      return
    }
    if (!dealerCard) {
      setMessage('Need dealer card.');
      return;
    }
  
    setMessage(''); // Clear any existing messages
  
    const dealerValue = getCardValue(dealerCard); // Convert to string
  
    // Determine if the hand is hard, soft, or a pair
    let handType;
    if(playerTotal === 20){
      handType = 'hard'
    }
    else if (playerHands[handIndex].length === 2 && playerHands[handIndex][0] === playerHands[handIndex][1]) {
      handType = 'pair';
    } else if (playerHands[handIndex].length === 2 && playerHands[handIndex].some(card => card === 'A')) {
      handType = 'soft';
    } else {
      handType = 'hard';
    }
  
    // Choose the appropriate strategy table based on shoeComposition
    let strategyTable;
    if (settings.shoeComposition === '1') {
      strategyTable = oneDeckBS;
    } else if (settings.shoeComposition === '2') {
      strategyTable = twoDeckBS;
    } else {
      strategyTable = multiDeckBS;
    }
  
    // Debug logs
    console.log('Player Hand:', playerHands[handIndex]);
    console.log('Dealer Value:', dealerValue);
    console.log('Hand Type:', handType);
    console.log('Strategy Table:', strategyTable);
  
    // Get the recommended action from the strategy table
    let action;
    try {
      if (handType === 'pair') {
        const pairKey = playerHands[handIndex][0] + playerHands[handIndex][1];
        console.log('Pair Key:', pairKey);
        if (strategyTable.pair && strategyTable.pair[pairKey] && strategyTable.pair[pairKey][dealerValue]) {
          action = strategyTable.pair[pairKey][dealerValue];
        } else {
          throw new Error('Pair strategy not found');
        }
      } else if (handType === 'soft') {
        console.log('Soft Total:', playerTotal);
        if (strategyTable.soft && strategyTable.soft[playerTotal.toString()] && strategyTable.soft[playerTotal.toString()][dealerValue]) {
          action = strategyTable.soft[playerTotal.toString()][dealerValue];
        } else {
          throw new Error('Soft strategy not found');
        }
      } else {
        console.log('Hard Total:', playerTotal);
        if (strategyTable.hard && strategyTable.hard[playerTotal.toString()] && strategyTable.hard[playerTotal.toString()][dealerValue]) {
          action = strategyTable.hard[playerTotal.toString()][dealerValue];
        } else {
          throw new Error('Hard strategy not found');
        }
      }
    } catch (error) {
      console.error('Error fetching strategy:', error);
      setMessage('Strategy not found for this combination.');
      return;
    }
    // Check if the action is 'Double' and if doubling is allowed
    if (action === 'Double' && !canDouble(handIndex)) {
      action = strategyTable.hard[playerTotal.toString()][dealerValue];
    }
    if (action === 'Split' && !canSplit(handIndex)) {
      action = strategyTable.hard[playerTotal.toString()][dealerValue];
    }

    updateAction(handIndex, action);
  };

  const canDouble = (handIndex) => {
    // Check settings and hand conditions to determine if doubling is allowed
    if(playerHands[handIndex].length != 2){
      return false;
    }
    if (settings.doubleDown === 'any-two') {
      return true;
    } else if (settings.doubleDown === '9-11') {
      const playerTotal = handTotals[handIndex];
      return playerTotal >= 9 && playerTotal <= 11;
    }
    else if (settings.doubleDown === '10-11'){
      const playerTotal = handTotals[handIndex];
      return playerTotal >= 10 && playerTotal <= 11;
    }
    return false;
  };

  const canSplit = (handIndex) => {
    if(playerHands[handIndex].length != 2){
      return false;
    }
    if(playerHands[handIndex][0] != playerHands[handIndex][1]){
      return false
    }
    // Check settings and hand conditions to determine if splitting is allowed
    const card = playerHands[handIndex][0];
    if (card === 'A') {
      if(settings.splitAces === 'never'){
        return false;
      }
      else{
        return playerHands.length-1 < parseInt(settings.splitAces)
      }
      
    }
    else {
      if (settings.split2s10s === 'never') {
        return false;
      }
      return playerHands.length-1 < parseInt(settings.split2s10s)
    }
  };

  const updateAction = (handIndex, action) => {
    const newActions = [...actions];
    newActions[handIndex] = action;
    setActions(newActions);
  };

  const getCardValue = (card) => {
    if (card === 'J' || card === 'Q' || card === 'K') {
      return 10;
    } else if (card === 'A') {
      return 11; // Simplified; Aces will be handled in calculateHandTotal
    } else {
      return parseInt(card);
    }
  };

  const calculateHandTotal = (hand) => {
    let total = hand.reduce((acc, card) => acc + getCardValue(card), 0);
    let numAces = hand.filter(card => card === 'A').length;

    while (total > 21 && numAces > 0) {
      total -= 10;
      numAces -= 1;
    }

    return total;
  };

  useEffect(() => {
    const newHandTotals = playerHands.map(hand => calculateHandTotal(hand));
    setHandTotals(newHandTotals);
  }, [playerHands]);

  return (
    <div className="App">
      <SettingsPanel settings={settings} setSettings={setSettings} />
      <h1>Blackjack Card Selector</h1>
      <button className="clear-button" onClick={clearPlayerCards}>Clear</button>
      <div className="card-selection">
        <h2>Select Dealer Card</h2>
        <div className="card-options">
          {cards.map((card) => (
            <img
              key={card}
              src={getCardImage(card)}
              alt={card}
              className="card-image"
              onClick={() => setDealerCard(card)}
            />
          ))}
        </div>
        <div className="cards-display">
          {dealerCard && <img src={getCardImage(dealerCard)} alt={dealerCard} className="card-image" />}
        </div>
      </div>
      <div className="player-hands">
        {playerHands.map((hand, handIndex) => (
          <div key={handIndex} className="hand-section">
            <h2>Select Player Cards for Hand {handIndex + 1}</h2>
            <div className="card-options">
              {cards.map((card) => (
                <img
                  key={card}
                  src={getCardImage(card)}
                  alt={card}
                  className="card-image"
                  onClick={() => addPlayerCard(handIndex, card)}
                />
              ))}
            </div>
            <div className="cards-display">
              {hand.map((card, cardIndex) => (
                <img
                  key={cardIndex}
                  src={getCardImage(card)}
                  alt={card}
                  className="card-image"
                  onClick={() => removePlayerCard(handIndex, cardIndex)}
                />
              ))}
              {canSplit(handIndex) && (
                <button className="split-button" onClick={() => splitHand(handIndex)}>Split</button>
              )}
            </div>
            {/* Display the total for this hand */}
            <h3>Total: {handTotals[handIndex]}</h3>
            <button
              className="calculate-button"
              onClick={() => calculateAction(handIndex)}
            >
              Calculate
            </button>
            {actions[handIndex] && <h2>Recommended Action for Hand {handIndex + 1}: {actions[handIndex]}</h2>}
          </div>
        ))}
      </div>
      {message && <h2>{message}</h2>}
    </div>
  );
}

export default App;