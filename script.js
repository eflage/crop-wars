const TOWNS = [
  "COUNTY CO-OP",
  "RIVER GRAIN ELEVATOR",
  "STATE FAIRGROUNDS",
  "OAK RIDGE FARMERS MKT",
  "VALLEY PRODUCE HUB",
  "NORTHSIDE SILOS"
];

const CROPS = [
  { id: 0, name: "CORN",     min: 15,   max: 45 },
  { id: 1, name: "SOYBEANS", min: 55,   max: 130 },
  { id: 2, name: "PUMPKINS", min: 150,  max: 380 },
  { id: 3, name: "HONEY",    min: 400,  max: 950 },
  { id: 4, name: "TRUFFLES", min: 1000, max: 2600 }
];

const STORAGE_KEY = "cropwars_local_leaderboard_v1";
let state = {};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initGame() {
  state = {
    day: 1,
    maxDays: 30,
    cash: 2000,
    debt: 2000,
    maxSpace: 100,
    town: TOWNS[0],
    selectedCrop: 0,
    inventory:,
    prices:,
    gameOver: false,
    scoreSaved: false
  };
  closePanel();
  generateMarket("Season started! Pay off the $2,000 Ag Bank loan.");
}

function usedSpace() {
  return state.inventory.reduce((a, b) => a + b, 0);
}

function generateMarket(customMsg = null) {
  state.prices = CROPS.map(c => rand(c.min, c.max));
  let msg = customMsg || `Arrived at ${state.town}.`;

  const roll = rand(1, 20);
  if (!customMsg) {
    if (roll === 1) {
      state.prices[0] = Math.max(5, Math.floor(state.prices[0] / 3));
      msg = "EVENT: Bumper Corn harvest! Prices crashed!";
    } else if (roll === 2) {
      state.prices[4] *= 2;
      msg = "EVENT: Truffle shortage! Chefs paying 2x!";
    } else if (roll === 3) {
      state.prices[2] *= 2;
      msg = "EVENT: Autumn festival! Pumpkin prices surged!";
    } else if (roll === 4 && usedSpace() > 0) {
      const heldIndices = state.inventory
        .map((qty, idx) => (qty > 0 ? idx : -1))
        .filter(idx => idx !== -1);
      const target = heldIndices[rand(0, heldIndices.length - 1)];
      const lost = Math.max(1, Math.floor(state.inventory[target] * 0.15));
      state.inventory[target] -= lost;
      msg = `WEATHER: Rain spoiled ${lost} ${CROPS[target].name}!`;
    } else if (roll === 5) {
      const bonus = rand(100, 350);
      state.cash += bonus;
      msg = `LUCKY: Found a lost tractor part! Sold for $${bonus}.`;
    }
  }

  document.getElementById("event-log").textContent = msg;
  render();
}

function render() {
  document.getElementById("stat-day").textContent = state.day;
  document.getElementById("stat-cash").textContent = state.cash.toLocaleString();
  document.getElementById("stat-debt").textContent = state.debt.toLocaleString();
  document.getElementById("stat-space").textContent = usedSpace();
  document.getElementById("stat-max").textContent = state.maxSpace;
  document.getElementById("stat-town").textContent = state.town;

  const tbody = document.getElementById("market-body");
  tbody.innerHTML = "";

  CROPS.forEach((crop, idx) => {
    const tr = document.createElement("tr");
    tr.className = "crop-row" + (state.selectedCrop === idx ? " selected" : "");
    tr.onclick = () => {
      state.selectedCrop = idx;
      render();
    };
    tr.innerHTML = `
      <td>${crop.name}</td>
      <td>$${state.prices[idx]}</td>
      <td>${state.inventory[idx]}</td>
    `;
    tbody.appendChild(tr);
  });
}

function closePanel() {
  const panel = document.getElementById("action-panel");
  panel.classList.remove("active");
  panel.innerHTML = "";
}

function openTrade(mode) {
  if (state.gameOver) return;
  const crop = CROPS[state.selectedCrop];
  const price = state.prices[state.selectedCrop];
  const freeSpace = state.maxSpace - usedSpace();
  const maxAfford = Math.floor(state.cash / price);
  const maxQty =
    mode === "buy"
      ? Math.min(freeSpace, maxAfford)
      : state.inventory[state.selectedCrop];

  const panel = document.getElementById("action-panel");
  panel.classList.add("active");
  panel.innerHTML = `
    <div><strong>${mode.toUpperCase()} ${crop.name}</strong> ($${price} ea | Max: ${maxQty})</div>
    <div class="action-row">
      <input type="number" id="trade-qty" min="1" max="${maxQty}" value="${maxQty}">
      <button class="primary" onclick="executeTrade('${mode}')">CONFIRM</button>
      <button onclick="closePanel()">CANCEL</button>
    </div>
  `;
}

function executeTrade(mode) {
  const qty = parseInt(document.getElementById("trade-qty").value, 10);
  const idx = state.selectedCrop;
  const price = state.prices[idx];

  if (isNaN(qty) || qty <= 0) return;

  if (mode === "buy") {
    const cost = qty * price;
    const freeSpace = state.maxSpace - usedSpace();
    if (cost <= state.cash && qty <= freeSpace) {
      state.cash -= cost;
      state.inventory[idx] += qty;
      document.getElementById("event-log").textContent = `Bought ${qty} ${CROPS[idx].name}.`;
    }
  } else {
    if (qty <= state.inventory[idx]) {
      state.cash += qty * price;
      state.inventory[idx] -= qty;
      document.getElementById("event-log").textContent = `Sold ${qty} ${CROPS[idx].name} for $${(qty * price).toLocaleString()}.`;
    }
  }
  closePanel();
  render();
}

function openBank() {
  if (state.gameOver) return;
  const maxPay = Math.min(state.cash, state.debt);
  const panel = document.getElementById("action-panel");
  panel.classList.add("active");
  panel.innerHTML = `
    <div><strong>AG BANK</strong> (Debt grows 10%/day)</div>
    <div class="action-row">
      <input type="number" id="debt-qty" min="1" max="${maxPay}" value="${maxPay}">
      <button class="primary" onclick="payDebt()">PAY</button>
      <button onclick="closePanel()">CANCEL</button>
    </div>
  `;
}

function payDebt() {
  const amt = parseInt(document.getElementById("debt-qty").value, 10);
  if (!isNaN(amt) && amt > 0 && amt <= state.cash && amt <= state.debt) {
    state.cash -= amt;
    state.debt -= amt;
    document.getElementById("event-log").textContent = `Paid $${amt.toLocaleString()} toward Ag Bank debt.`;
  }
  closePanel();
  render();
}

function buyUpgrade() {
  if (state.gameOver) return;
  if (state.cash >= 1500) {
    state.cash -= 1500;
    state.maxSpace += 50;
    document.getElementById("event-log").textContent = "Upgraded truck bed! +50 capacity.";
    render();
  } else {
    document.getElementById("event-log").textContent = "Need $1,500 for a bigger truck bed!";
  }
}

function openTravel() {
  if (state.gameOver) return;
  const panel = document.getElementById("action-panel");
  panel.classList.add("active");
  const buttons = TOWNS.map(
    t => `<button ${t === state.town ? "disabled style='opacity:0.4'" : ""} onclick="travelTo('${t}')">${t}</button>`
  ).join("");

  panel.innerHTML = `
    <div><strong>SELECT DESTINATION (+1 Day)</strong></div>
    <div class="town-grid">${buttons}</div>
    <button style="width:100%; margin-top:6px;" onclick="closePanel()">STAY HERE</button>
  `;
}

function travelTo(town) {
  state.town = town;
  state.day += 1;
  state.debt = Math.round(state.debt * 1.1);
  closePanel();

  if (state.day > state.maxDays) {
    endGame();
  } else {
    generateMarket();
  }
}

/* --- LOCAL LEADERBOARD LOGIC --- */

function getScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveScoreEntry(name, netWorth) {
  const cleanName = (name || "AAA").trim().toUpperCase().slice(0, 10) || "AAA";
  const scores = getScores();
  scores.push({
    name: cleanName,
    score: netWorth,
    date: new Date().toLocaleDateString()
  });
  scores.sort((a, b) => b.score - a.score);
  const topFive = scores.slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topFive));
}

function clearLeaderboard() {
  localStorage.removeItem(STORAGE_KEY);
  openLeaderboard();
}

function openLeaderboard() {
  const scores = getScores();
  const panel = document.getElementById("action-panel");
  panel.classList.add("active");
  panel.innerHTML = "";

  const header = document.createElement("div");
  header.innerHTML = "<strong>TOP 5 LOCAL GROWERS</strong>";
  panel.appendChild(header);

  if (scores.length === 0) {
    const empty = document.createElement("p");
    empty.style.margin = "8px 0";
    empty.textContent = "No harvests recorded yet. Finish a 30-day season!";
    panel.appendChild(empty);
  } else {
    const ul = document.createElement("ul");
    ul.className = "leaderboard-list";
    scores.forEach((entry, i) => {
      const li = document.createElement("li");
      const leftSpan = document.createElement("span");
      leftSpan.textContent = `#${i + 1} ${entry.name}`;

      const rightSpan = document.createElement("span");
      rightSpan.textContent = `$${entry.score.toLocaleString()}`;

      li.appendChild(leftSpan);
      li.appendChild(rightSpan);
      ul.appendChild(li);
    });
    panel.appendChild(ul);
  }

  const btnRow = document.createElement("div");
  btnRow.className = "action-row";

  const closeBtn = document.createElement("button");
  closeBtn.style.flex = "1";
  closeBtn.textContent = "CLOSE";
  closeBtn.onclick = closePanel;
  btnRow.appendChild(closeBtn);

  if (scores.length > 0) {
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "RESET";
    clearBtn.onclick = clearLeaderboard;
    btnRow.appendChild(clearBtn);
  }

  panel.appendChild(btnRow);
}

function endGame() {
  state.gameOver = true;
  state.day = state.maxDays;
  render();

  const netWorth = state.cash - state.debt;
  const rank =
    netWorth >= 50000
      ? "AGRICULTURAL TYCOON"
      : netWorth >= 15000
      ? "MASTER GROWER"
      : netWorth >= 0
      ? "FAMILY FARMER"
      : "REPO'D TRACTOR";

  document.getElementById("event-log").textContent =
    `SEASON OVER! Net Worth: $${netWorth.toLocaleString()} (${rank})`;

  const panel = document.getElementById("action-panel");
  panel.classList.add("active");
  panel.innerHTML = "";

  const title = document.createElement("div");
  title.innerHTML = "<strong>RECORD HARVEST SCORE</strong>";

  const summary = document.createElement("div");
  summary.style.margin = "4px 0";
  summary.innerHTML = `Final Net Worth: <strong>$${netWorth.toLocaleString()}</strong>`;

  const row = document.createElement("div");
  row.className = "action-row";

  const input = document.createElement("input");
  input.type = "text";
  input.id = "player-initials";
  input.maxLength = 10;
  input.placeholder = "INITIALS (E.G. BOB)";

  const saveBtn = document.createElement("button");
  saveBtn.className = "primary";
  saveBtn.textContent = "SAVE";
  saveBtn.onclick = () => submitEndScore(netWorth);

  row.appendChild(input);
  row.appendChild(saveBtn);

  panel.appendChild(title);
  panel.appendChild(summary);
  panel.appendChild(row);
}

function submitEndScore(netWorth) {
  if (state.scoreSaved) return;
  const input = document.getElementById("player-initials");
  saveScoreEntry(input.value, netWorth);
  state.scoreSaved = true;
  openLeaderboard();
}

// Start on load
initGame();
