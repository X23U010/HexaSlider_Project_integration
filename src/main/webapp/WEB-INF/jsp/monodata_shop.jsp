<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MONO DATA SHOP - HexaNexas.web</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <header>
        <div class="logo">HexaNexas.web</div>
        <nav>
            <button class="nav-btn" onclick="location.href='Execute_Servlet'">Home</button>
            <button class="nav-btn active">Shop</button>
        </nav>
        <div class="cart-status-bar" onclick="openCartModal()">
            🛒 Cart (<span id="cart-count">0</span>) - ¥<span id="cart-total-nav">0</span>
        </div>
    </header>

    <main class="container">
        
        <section id="shop" class="page active">
            <h2 class="page-title">MONO DATA SHOP</h2>
            <p class="shop-desc">Web限定！お得なゲーム内通貨（MDP）の購入ページです。複数をまとめてカートに入れられます。</p>
            
            <div class="shop-grid">
                <div class="shop-card">
                    <h3>100 MDP</h3>
                    <div class="price">¥120</div>
                    <button class="btn-buy" onclick="addToCart('100 CP', 120, 100)">カートに入れる</button>
                </div>
                <div class="shop-card featured">
                    <div class="hot-tag">RECOMMEND</div>
                    <h3>500 MDP</h3>
                    <div class="price">¥600</div>
                    <button class="btn-buy" onclick="addToCart('500 CP', 600, 500)">カートに入れる</button>
                </div>
                <div class="shop-card">
                    <h3>1,200 MDP</h3>
                    <div class="price">¥1,200</div>
                    <button class="btn-buy" onclick="addToCart('1,200 CP', 1200, 1200)">カートに入れる</button>
                </div>
                <div class="shop-card featured">
                    <div class="hot-tag">RECOMMEND</div>
                    <h3>9,9999 MDP</h3>
                    <div class="price">¥99,999</div>
                    <button class="btn-buy" onclick="addToCart('9,9999 CP', 99999, 99999)">カートに入れる</button>
                </div>
            </div>
        </section>

        <section id="purchase-history-section" class="page active" style="margin-top: 40px;">
            <h2 class="page-title">PURCHASE HISTORY (購入履歴)</h2>
            <div class="news-list" id="history-list-container">
                </div>
        </section>

    </main>

    <div id="cart-modal" class="modal-overlay">
        <div class="modal-content">
            <h3 class="modal-title">🛒 Shopping Cart</h3>
            <div id="cart-items-list"></div>
            <div class="cart-total-area">
                Total Amount: <span class="total-price">¥<span id="cart-total-modal">0</span></span>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeCartModal()">買い物を続ける</button>
                <button class="btn-checkout" onclick="checkout()">テスト決済に進む</button>
            </div>
        </div>
    </div>

    <script src="js/script.js"></script>
</body>
</html>