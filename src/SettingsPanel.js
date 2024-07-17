import React, { useState } from 'react';
import './SettingsPanel.css';

function SettingsPanel({ settings, setSettings }) {
  const [isMinimized, setIsMinimized] = useState(false);

  const togglePanel = () => {
    setIsMinimized(!isMinimized);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  return (
    <div className={`settings-panel ${isMinimized ? 'minimized' : ''}`}>
      <div className="panel-header" onClick={togglePanel}>
        <h3>Blackjack Rules</h3>
        <button className="toggle-button">{isMinimized ? '🔽' : '🔼'}</button>
      </div>
      {!isMinimized && (
        <div className="panel-content">
          <div className="rules">
            <div>
              <label>Shoe Composition:</label>
              <select name="shoeComposition" value={settings.shoeComposition} onChange={handleChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="multiple">Multiple</option>
              </select>
            </div>

            <div>
              <label>Blackjack pays:</label>
              <select name="blackjackPays" value={settings.blackjackPays} onChange={handleChange}>
                <option value="3:2">3 to 2</option>
                <option value="6:5">6 to 5</option>
                <option value="7:5">7 to 5</option>
              </select>
            </div>

            <div>
              <label>Hole card:</label>
              <select name="holeCard" value={settings.holeCard} onChange={handleChange}>
                <option value="dealer-peeks">dealer peeks for blackjack (US)</option>
                <option value="no-peek">no peek</option>
              </select>
            </div>

            <div>
              <label>Soft 17:</label>
              <select name="soft17" value={settings.soft17} onChange={handleChange}>
                <option value="dealer-hits">dealer hits</option>
                <option value="dealer-stands">dealer stands</option>
              </select>
            </div>

            <div>
              <label>Double down:</label>
              <select name="doubleDown" value={settings.doubleDown} onChange={handleChange}>
                <option value="any-two">any two cards</option>
                <option value="9-11">only on 9, 10, or 11</option>
                <option value="10-11">only on 10, or 11</option>
              </select>
            </div>

            <div>
              <label>Split 2s through 10s:</label>
              <select name="split2s10s" value={settings.split2s10s} onChange={handleChange}>
                <option value="3">a maximum of 3 times to make 4 hands</option>
                <option value="2">a maximum of 2 times to make 3 hands</option>
                <option value="1">a maximum of 1 times to make 2 hands</option>
                <option value="never">not allowed</option>
              </select>
            </div>

            <div>
              <label>Split aces:</label>
              <select name="splitAces" value={settings.splitAces} onChange={handleChange}>
                <option value="3">a maximum of 3 times to make 4 hands</option>
                <option value="2">a maximum of 2 times to make 3 hands</option>
                <option value="1">a maximum of 1 times to make 2 hands</option>
                <option value="never">not allowed</option>
              </select>
            </div>

            <div>
              <label>Draw to split aces:</label>
              <select name="drawToSplitAces" value={settings.drawToSplitAces} onChange={handleChange}>
                <option value="not-allowed">not allowed</option>
                <option value="allowed">allowed</option>
              </select>
            </div>

            <div>
              <label>Double after split:</label>
              <select name="doubleAfterSplit" value={settings.doubleAfterSplit} onChange={handleChange}>
                <option value="allowed">allowed</option>
                <option value="not-allowed">not allowed</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPanel;