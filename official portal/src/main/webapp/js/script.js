// ==========================================================================
// 【HexaSlider Portal】ポータル・カートシステム 制御スクリプト
// ==========================================================================

// グローバル変数
let cart = [];
let currentCoin = 500;
let currentRank = 99;

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
    const listContainer = document.getElementById('cart-items-list');
    listContainer.innerHTML = '';

    if (cart.length === 0) {
        listContainer.innerHTML = '<p class="empty-msg">カートは空です。</p>';
    }

    cart.forEach((item, index) => {
        totalCount += item.quantity;
        totalPrice += (item.price * item.quantity);

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
}

// カート内商品の削除
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// モーダル開閉
function openCartModal() { document.getElementById('cart-modal').classList.add('open'); }
// モーダル閉じる
function closeCartModal() { document.getElementById('cart-modal').classList.remove('open'); }

// 決済処理
function checkout() {
    if (cart.length === 0) {
        alert('カートが空です。商品を選んでください。');
        return;
    }

    let totalCoinToGive = 0;
    let totalPrice = 0;
    cart.forEach(item => {
        totalCoinToGive += (item.coinAmount * item.quantity);
        totalPrice += (item.price * item.quantity);
    });

    const confirmMsg = `【テスト一括決済】\n合計金額 ¥${totalPrice} の決済を行います。\n購入した ${totalCoinToGive} CP をマイページに反映しますか？`;
    
    if (confirm(confirmMsg)) {
        currentCoin += totalCoinToGive;
        document.getElementById('user-coin').innerText = currentCoin;
        
        // 管理者画面側のインプット値の同期
        document.getElementById('admin-user-coin').value = currentCoin;

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
    if(pickupBadge) {
        pickupBadge.className = `badge ${tag}`;
        pickupBadge.innerText = tag.toUpperCase();
    }

    document.getElementById('admin-news-title').value = '';
    document.getElementById('admin-news-content').value = '';

    alert('新しいニュースを公開しました！\n（HomeおよびNewsページに反映されました）');
}