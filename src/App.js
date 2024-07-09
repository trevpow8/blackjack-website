import React, { useState } from 'react';
import './App.css';
import SettingsPanel from './SettingsPanel';

function App() {
  const [dealerCard, setDealerCard] = useState('');
  const [playerCards, setPlayerCards] = useState([]);
  const [action, setAction] = useState('');
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const addPlayerCard = () => {
    const card = document.getElementById('playerCardSelect').value;
    if (card) {
      setPlayerCards([...playerCards, card]);
    }
  };

  const removePlayerCard = (index) => {
    const newPlayerCards = [...playerCards];
    newPlayerCards.splice(index, 1);
    setPlayerCards(newPlayerCards);
  };

  const getCardImage = (card) => {
    return `/cards/${card}.png`;
  };

  const calculateAction = () => {
    const playerTotal = playerCards.reduce((total, card) => total + getCardValue(card), 0);
    const dealerValue = getCardValue(dealerCard);

    if (playerTotal <= 11) {
      setAction('Hit');
    } else if (playerTotal >= 17) {
      setAction('Stand');
    } else if (playerCards.length === 2 && playerCards[0] === playerCards[1]) {
      setAction('Split');
    } else if (playerTotal === 11 && playerCards.length === 2) {
      setAction('Double');
    } else {
      setAction('Hit');
    }
  };

  const getCardValue = (card) => {
    if (card === 'J' || card === 'Q' || card === 'K') {
      return 10;
    } else if (card === 'A') {
      return 11;
    } else {
      return parseInt(card, 10);
    }
  };

  return (
    <div className="App">
      <SettingsPanel />
      <h1>Blackjack Card Selector</h1>
      <div className="dealer-section">
        <label>Select Dealer's Card:</label>
        <select onChange={(e) => setDealerCard(e.target.value)}>
          <option value="">Select a card</option>
          {cards.map((card) => (
            <option key={card} value={card}>{card}</option>
          ))}
        </select>
        <div className="cards-display">
          {dealerCard && <img src={getCardImage(dealerCard)} alt={dealerCard} className="card-image" />}
        </div>
      </div>
      <div className="player-section">
        <label>Select Player's Card:</label>
        <select id="playerCardSelect">
          <option value="">Select a card</option>
          {cards.map((card) => (
            <option key={card} value={card}>{card}</option>
          ))}
        </select>
        <button onClick={addPlayerCard}>Add Card</button>
        <div className="cards-display">
          {playerCards.map((card, index) => (
            <img
              key={index}
              src={getCardImage(card)}
              alt={card}
              className="card-image"
              onClick={() => removePlayerCard(index)}
            />
          ))}
        </div>
      </div>
      <button className="calculate-button" onClick={calculateAction}>Calculate</button>
      {action && <h2>Recommended Action: {action}</h2>}
    </div>
  );
}

export default App;