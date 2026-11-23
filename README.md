# 🌽 Crop Wars (TI-84 Web Edition)

A retro, classroom-safe economic trading game inspired by the classic graphing calculator game *Drug Wars*. Styled after an old-school TI-83/84 monochrome LCD screen, **Crop Wars** challenges players to buy low, sell high, dodge bad weather, and pay off their seed loan across 30 days.

🔗 **[Play Live on GitHub Pages](https://eflage.github.io/crop-wars/)**

---

## 🎮 How to Play

You start **Day 1** with **\$2,000 in cash**, **\$2,000 in Ag Bank debt**, and a pickup truck that holds **100 bushels**. 

1. **Check Local Prices:** Select a crop on the LCD screen to highlight it.
2. **Buy Low & Sell High:** Use **BUY** and **SELL** to trade commodities based on local supply and demand.
3. **Travel to New Markets:** Click **TRAVEL** to visit a new town. Every trip advances the calendar by **1 day** and compounds your unpaid debt by **10%**.
4. **Pay Off Your Loan:** Visit the **AG BANK** early to pay down your seed loan before daily interest snowballs.
5. **Upgrade Your Truck:** Spend **\$1,500** to expand your truck bed capacity by **+50 bushels** so you can haul bigger harvests.
6. **Beat the Clock:** Maximize your **Net Worth** (`Cash - Debt`) by the end of **Day 30** to claim a spot on the Top 5 Local Growers leaderboard.

---

## 🌾 Commodities & Market Events

| Crop | Typical Price Range | Volatility |
| :--- | :--- | :--- |
| **Corn** | \$15 – \$45 | Low risk, high volume; prone to bumper-crop price crashes |
| **Soybeans** | \$55 – \$130 | Steady mid-tier staple |
| **Pumpkins** | \$150 – \$380 | High seasonal demand; spikes during autumn festivals |
| **Honey** | \$400 – \$950 | High value per bushel |
| **Truffles** | \$1,000 – \$2,600 | Rare luxury crop; huge payouts during chef shortages |

Watch out for random events while traveling—heavy rain can spoil stored crops, while lucky roadside finds can net extra cash!

---

## ✨ Features

* **Retro TI-84 LCD Aesthetic:** Monochrome olive-green screen, scanline overlay, and tactile calculator buttons.
* **Zero Dependencies:** Built purely with vanilla HTML, CSS, and JavaScript—no frameworks or build steps required.
* **Local High-Score Leaderboard:** Automatically saves the Top 5 scores in the browser using `localStorage`.
* **Mobile & Desktop Friendly:** Responsive calculator layout works on phones, tablets, Chromebooks, and desktops.

---

## 🚀 Running Locally or Deploying

To run the game locally:
1. Clone or download this repository.
2. Open `index.html` in any modern web browser.

To host your own copy on **GitHub Pages**:
1. Push `index.html`, `style.css`, and `script.js` to your repository's `main` branch.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment**, set the source to **Deploy from a branch**, choose `main` / `(root)`, and click **Save**.

---

## 📁 Project Structure

```text
├── index.html   # Calculator layout and LCD screen markup
├── style.css    # Retro TI-84 styling, scanlines, and responsive grid
├── script.js    # Market simulation, random events, and localStorage leaderboard
└── README.md    # Project documentation
```
