// ==========================================================================
// 【HexaSlider Portal】ポータル・カートシステム 制御スクリプト
// ==========================================================================

// 【保持条件設定】購入履歴の設定（定数）
const MAX_HISTORY_COUNT = 50;    // 最大保持件数
const HISTORY_EXPIRY_DAYS = 30;  // 保持期間（日数）

// グローバル変数
let cart = [];
let currentCoin = 0;
let currentRank = 99;

// 購入履歴配列（localStorageから取得し、古いデータを自動除外して初期化）
let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

// ページ読み込み時に初期化処理を実行
window.addEventListener('DOMContentLoaded', () => {
    // 期限切れ履歴のフィルタリング
    purchaseHistory = filterOldHistory(purchaseHistory);
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));

    // 購入履歴UIの初期描画
    updateHistoryUI();
});

// 画面切り替え機能
function switchPage(pageId) {
    // 一旦すべてのページとナビボタンのactiveを外す
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // 対象のページを表示
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // ナビゲーションボタンのactiveを正しく付与
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const onClickAttr = btn.getAttribute('onclick') || '';
        if (onClickAttr.includes(`'${pageId}'`)) {
            btn.classList.add('active');
        }
    });
}

// カートに商品を追加
function addToCart(name, price, coinAmount) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, coinAmount: coinAmount, quantity: 1 });
    }
    updateCartUI();
    alert(`${name} をカートに追加しました！`);
}

// カートのUI表示を更新
function updateCartUI() {
    let totalCount = 0;
    let totalPrice = 0;
    let totalCoinInCart = 0;

    const listContainer = document.getElementById('cart-items-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (cart.length === 0) {
        listContainer.innerHTML = '<p class="empty-msg">カートは空です。</p>';
    }

    cart.forEach((item, index) => {
        totalCount += item.quantity;
        totalPrice += (item.price * item.quantity);
        totalCoinInCart += (item.coinAmount * item.quantity);

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item-row';
        itemDiv.innerHTML = `
            <div>
                <span class="item-name">${item.name}</span>
                <span class="item-qty">x ${item.quantity}</span>
            </div>
            <div>
                <span class="item-price">¥${item.price * item.quantity}</span>
                <button class="btn-delete" onclick="removeFromCart(${index})">削除</button>
            </div>
        `;
        listContainer.appendChild(itemDiv);
    });

    document.getElementById('cart-count').innerText = totalCount;
    document.getElementById('cart-total-nav').innerText = totalPrice;
    document.getElementById('cart-total-modal').innerText = totalPrice;

    // カートモーダル内の通貨比較の表示更新
    const currentCoinEl = document.getElementById('cart-current-coin');
    const afterCoinEl = document.getElementById('cart-after-coin');
    if (currentCoinEl && afterCoinEl) {
        currentCoinEl.innerText = currentCoin.toLocaleString();
        afterCoinEl.innerText = (currentCoin + totalCoinInCart).toLocaleString();
    }
}

// カート内商品の削除
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// モーダル開閉
function openCartModal() {
    document.getElementById('cart-modal').classList.add('open');
    updateCartUI();
}

function closeCartModal() {
    document.getElementById('cart-modal').classList.remove('open');
}

// 決済処理
function checkout() {
    if (cart.length === 0) {
        alert('カートが空です。商品を選んでください。');
        return;
    }

    let totalCoinToGive = 0;
    let totalPrice = 0;
    let itemsSummary = [];

    cart.forEach(item => {
        totalCoinToGive += (item.coinAmount * item.quantity);
        totalPrice += (item.price * item.quantity);
        itemsSummary.push(`${item.name} x${item.quantity}`);
    });

    const confirmMsg = `【テスト一括決済】\n合計金額 ¥${totalPrice} の決済を行います。\n購入した ${totalCoinToGive} CP をマイページに反映しますか？`;

    if (confirm(confirmMsg)) {
        currentCoin += totalCoinToGive;
        document.getElementById('user-coin').innerText = currentCoin;

        // 管理者画面側のインプット値の同期
        document.getElementById('admin-user-coin').value = currentCoin;

        // 購入履歴の保存処理
        const now = new Date();
        const newHistoryItem = {
            timestamp: now.getTime(),
            dateStr: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
            detail: itemsSummary.join(', '),
            price: totalPrice,
            coin: totalCoinToGive
        };

        purchaseHistory.unshift(newHistoryItem);

        if (purchaseHistory.length > MAX_HISTORY_COUNT) {
            purchaseHistory = purchaseHistory.slice(0, MAX_HISTORY_COUNT);
        }

        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
        updateHistoryUI();

        cart = [];
        updateCartUI();
        closeCartModal();

        alert(`決済が成功しました！\n加算された通貨: +${totalCoinToGive} CP\nマイページへ移動します。`);

        switchPage('mypage');
    }
}

// 管理者画面：プレイヤーデータの書き換え反映
function updatePlayerData() {
    const newRank = parseInt(document.getElementById('admin-user-rank').value) || 0;
    const newCoin = parseInt(document.getElementById('admin-user-coin').value) || 0;

    currentRank = newRank;
    currentCoin = newCoin;

    document.getElementById('user-rank').innerText = currentRank;
    document.getElementById('user-coin').innerText = currentCoin;

    alert('プレイヤーデータを更新しました！\n（マイページで確認してください）');
}

// 管理者画面：購入履歴の一括削除
function clearPurchaseHistory() {
    if (confirm('すべての購入履歴を削除しますか？\nこの操作は取り消せません。')) {
        purchaseHistory = [];
        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
        updateHistoryUI();
        alert('すべての購入履歴を削除しました。');
    }
}

// 購入履歴：期限切れデータ（30日経過）を除外するフィルタ関数
function filterOldHistory(historyArray) {
    const nowTime = new Date().getTime();
    const expiryMs = HISTORY_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return historyArray.filter(item => {
        if (!item.timestamp) return true;
        return (nowTime - item.timestamp) < expiryMs;
    });
}

// 購入履歴：UI表示の更新処理（MyPage画面の表示エリアに対応）
function updateHistoryUI() {
    // 【変更】取得先を mypage のコンテナに変更
    const mypageContainer = document.getElementById('mypage-history-list-container');
    if (!mypageContainer) return;

    mypageContainer.innerHTML = '';

    if (purchaseHistory.length === 0) {
        mypageContainer.innerHTML = '<p class="empty-msg" style="color: #bbb; padding: 10px;">購入履歴はありません。</p>';
        return;
    }

    purchaseHistory.forEach(item => {
        const row = document.createElement('div');
        row.className = 'news-item';
        row.style.padding = '12px';
        row.style.marginBottom = '10px';
        row.style.background = 'rgba(255, 255, 255, 0.05)';

        const safePrice = item.price !== undefined ? item.price : 0;
        const safeCoin = item.coin !== undefined ? item.coin : 0;
        const safeDate = item.dateStr || '日時不明';
        const safeDetail = item.detail || '商品詳細なし';

        row.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #888; margin-bottom: 5px;">
                <span>📅 決済日時: ${safeDate}</span>
                <span style="color: #2ecc71; font-weight: bold;">決済完了</span>
            </div>
            <h4 style="margin: 5px 0; color: #fff; font-size: 15px;">${safeDetail}</h4>
            <div style="font-size: 14px; color: #aaa; margin-top: 5px;">
                支払金額: <strong style="color: #f1c40f;">¥${safePrice.toLocaleString()}</strong> / 
                獲得: <strong style="color: #3498db;">+${safeCoin.toLocaleString()} CP</strong>
            </div>
        `;
        mypageContainer.appendChild(row);
    });
}

// 管理者画面：新規ニュースの動的投稿・反映
function publishNews() {
    const title = document.getElementById('admin-news-title').value;
    const tag = document.getElementById('admin-news-tag').value;
    const content = document.getElementById('admin-news-content').value;

    if (!title || !content) {
        alert('タイトルと本文を入力してください。');
        return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}.${month}.${day}`;

    const newsListContainer = document.getElementById('news-list-container');
    if (!newsListContainer) return;
    const newNewsItem = document.createElement('div');
    newNewsItem.className = 'news-item';
    newNewsItem.innerHTML = `
        <span class="badge ${tag}">${tag.toUpperCase()}</span>
        <span class="date">${dateString}</span>
        <h3>${title}</h3>
        <p>${content}</p>
    `;
    newsListContainer.insertBefore(newNewsItem, newsListContainer.firstChild);

    document.getElementById('pickup-date').innerText = dateString;
    document.getElementById('pickup-title').innerText = title;
    const pickupBadge = document.querySelector('.news-summary .badge');
    if (pickupBadge) {
        pickupBadge.className = `badge ${tag}`;
        pickupBadge.innerText = tag.toUpperCase();
    }

    document.getElementById('admin-news-title').value = '';
    document.getElementById('admin-news-content').value = '';

    alert('新しいニュースを公開しました！\n（HomeおよびNewsページに反映されました）');
}

// 管理者画面：プレイヤーデータの入力値を0にクリアする関数
function clearAdminInput(type) {
    if (type === 'rank') {
        const rankInput = document.getElementById('admin-user-rank');
        if (rankInput) {
            rankInput.value = 0;
        }
    } else if (type === 'coin') {
        const coinInput = document.getElementById('admin-user-coin');
        if (coinInput) {
            coinInput.value = 0;
        }
    }
}