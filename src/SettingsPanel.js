import React from 'react';
import './SettingsPanel.css';

function SettingsPanel() {
  return (
    <div className="settings-panel">
      <div className="rules">


        <div>
          <label>Shoe Composition:</label>
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="multiple">Multiple</option>
          </select>
        </div>

        <div>
          <label>Blackjack pays:</label>
          <select>
            <option value="3:2">3 to 2</option>
            <option value="6:5">6 to 5</option>
            <option value="7:5">7 to 5</option>
          </select>
        </div>

        <div>
          <label>Hole card:</label>
          <select>
            <option value="dealer-peeks">dealer peeks for blackjack (US)</option>
            <option value="no-peek">no peek</option>
          </select>
        </div>

        <div>
          <label>Soft 17:</label>
          <select>
            <option value="dealer-hits">dealer hits</option>
            <option value="dealer-stands">dealer stands</option>
          </select>
        </div>

        <div>
          <label>Double down:</label>
          <select>
            <option value="any-two">any two cards</option>
            <option value="9-10-11">only on 9, 10, or 11</option>
            <option value="10-11">only on 10, or 11</option>
          </select>
        </div>

        <div>
          <label>Split 2s through 10s:</label>
          <select>
            <option value="3-times">a maximum of 3 times to make 4 hands</option>
            <option value="2-times">a maximum of 2 times to make 3 hands</option>
            <option value="1-time">a maximum of 1 times to make 2 hands</option>
            <option value="never">not allowed</option>
          </select>
        </div>

        <div>
          <label>Split aces:</label>
          <select>
            <option value="3-times">a maximum of 3 times to make 4 hands</option>
            <option value="2-times">a maximum of 2 times to make 3 hands</option>
            <option value="1-time">a maximum of 1 times to make 2 hands</option>
            <option value="never">not allowed</option>
          </select>
        </div>

        <div>
          <label>Draw to split aces:</label>
          <select>
            <option value="not-allowed">not allowed</option>
            <option value="allowed">allowed</option>
          </select>
        </div>

        <div>
          <label>Double after split:</label>
          <select>
            <option value="allowed">allowed</option>
            <option value="not-allowed">not allowed</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;