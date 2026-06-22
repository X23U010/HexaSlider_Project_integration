<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HexaSlider ver.α ポータルサイト(カート機能版)</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <header>
        <div class="logo">HexaSlider ver.α</div>
        <nav>
            <button class="nav-btn active" onclick="switchPage('home')">Home</button>
            <button class="nav-btn" onclick="switchPage('news')">News</button>
            <button class="nav-btn" onclick="switchPage('mypage')">MyPage</button>
            <button class="nav-btn" onclick="switchPage('shop')">Shop</button>
            <button class="nav-btn btn-admin-nav" onclick="switchPage('admin')">Admin</button>
        </nav>
        <div class="cart-status-bar" onclick="openCartModal()">
            🛒 Cart (<span id="cart-count">0</span>) - ¥<span id="cart-total-nav">0</span>
        </div>
    </header>

    <main class="container">
        
        <section id="home" class="page active">
            <div class="hero">
                <h1>WELCOME TO THE BEAT</h1>
                <p>新作リズムゲーム『HexaSlider』開発中！最新情報をチェックしよう。</p>
                <button class="btn-primary" onclick="switchPage('mypage')">マイページを見る</button>
            </div>
            
            <div class="section-title">PICK UP</div>
            <div class="news-summary" onclick="switchPage('news')">
                <span class="badge update">UPDATE</span>
                <span class="date" id="pickup-date">2026.06.18</span>
                <p class="title" id="pickup-title">【開発ブログ】αテスト版の譜面システムと楽曲制作の裏側を公開！</p>
            </div>
        </section>

        <section id="news" class="page">
            <h2 class="page-title">NEWS & INFO</h2>
            <div class="news-list" id="news-list-container">
                <div class="news-item">
                    <span class="badge update">UPDATE</span>
                    <span class="date">2026.06.18</span>
                    <h3>【開発ブログ】αテスト版の譜面システムと楽曲制作の裏側を公開！</h3>
                    <p>現在開発中の音ゲー『HexaSlider』の譜面プレビューと、第一弾収録予定の書き下ろし楽曲の情報を公開しました...</p>
                </div>
                <div class="news-item">
                    <span class="badge event">EVENT</span>
                    <span class="date">2026.06.10</span>
                    <h3>公式ポータルサイト（暫定版）をオープンしました！</h3>
                    <p>ゲーム本編の完成に先駆け、プレイヤーの皆様が交流・データ確認できるポータルサイトのモックアップを公開しました。</p>
                </div>
            </div>
        </section>

        <section id="mypage" class="page">
            <h2 class="page-title">MY PROFILE</h2>
            <div class="user-card">
                <div class="user-avatar">🎧</div>
                <div class="user-info">
                    <div class="user-name">音ゲー太郎 <span class="user-id">ID: <span id="display-user-id">12345678</span></span></div>
                    <div class="user-stats">
                        <span>RANK: <strong id="user-rank">99</strong></span>
                        <span>所持通貨: <strong id="user-coin">500</strong> CP</span>
                    </div>
                </div>
            </div>

            <div class="section-title">RECENT SCORES (仮データ)</div>
            <table class="score-table">
                <thead>
                    <tr>
                        <th>楽曲名</th>
                        <th>難易度</th>
                        <th>スコア</th>
                        <th>ランク</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Neon Drive</td>
                        <td class="diff-expert">EXPERT</td>
                        <td>995,200</td>
                        <td class="rank-aaa">AAA</td>
                    </tr>
                    <tr>
                        <td>Cyber Resonance</td>
                        <td class="diff-master">MASTER</td>
                        <td>981,000</td>
                        <td class="rank-aa">AA</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section id="shop" class="page">
            <h2 class="page-title">Hexa COIN SHOP</h2>
            <p class="shop-desc">Web限定！お得なゲーム内通貨（CP）の購入ページです。複数をまとめてカートに入れられます。</p>
            
            <div class="shop-grid">
                <div class="shop-card">
                    <h3>100 CP</h3>
                    <div class="price">¥120</div>
                    <button class="btn-buy" onclick="addToCart('100 CP', 120, 100)">カートに入れる</button>
                </div>
                <div class="shop-card featured">
                    <div class="hot-tag">RECOMMEND</div>
                    <h3>500 CP</h3>
                    <div class="price">¥600</div>
                    <button class="btn-buy" onclick="addToCart('500 CP', 600, 500)">カートに入れる</button>
                </div>
                <div class="shop-card">
                    <h3>1,200 CP</h3>
                    <div class="price">¥1,200</div>
                    <button class="btn-buy" onclick="addToCart('1,200 CP', 1200, 1200)">カートに入れる</button>
                </div>
                <div class="shop-card featured">
                    <div class="hot-tag">RECOMMEND</div>
                    <h3>9,9999 CP</h3>
                    <div class="price">¥99,999</div>
                    <button class="btn-buy" onclick="addToCart('9,9999 CP', 99999, 99999)">カートに入れる</button>
                </div>
                
            </div>
        </section>

        <section id="admin" class="page">
            <h2 class="page-title admin-title">ADMIN MANAGEMENT (管理者画面)</h2>
            <p class="shop-desc">デバッグ・運営用ポータル設定画面です。ゲームデータの書き換えやニュースの即時反映が可能です。</p>
            
            <div class="admin-grid">
                <div class="admin-card">
                    <h3>👤 プレイヤーデータ編集</h3>
                    <div class="form-group">
                        <label>対象ユーザーID</label>
                        <input type="text" id="admin-user-id" value="12345678" disabled>
                    </div>
                    <div class="form-group">
                        <label>変更後の RANK</label>
                        <input type="number" id="admin-user-rank" value="99">
                    </div>
                    <div class="form-group">
                        <label>変更後の 所持通貨 (CP)</label>
                        <input type="number" id="admin-user-coin" value="500">
                    </div>
                    <button class="btn-admin-submit" onclick="updatePlayerData()">データを保存・反映</button>
                </div>

                <div class="admin-card">
                    <h3>📢 新規ニュース投稿</h3>
                    <div class="form-group">
                        <label>ニュースタイトル</label>
                        <input type="text" id="admin-news-title" placeholder="【重要】サーバーメンテナンスのお知らせ">
                    </div>
                    <div class="form-group">
                        <label>タグの種類</label>
                        <select id="admin-news-tag">
                            <option value="update">UPDATE</option>
                            <option value="event">EVENT</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>本文</label>
                        <textarea id="admin-news-content" rows="4" placeholder="ここにニュースの詳細な本文を入力してください..."></textarea>
                    </div>
                    <button class="btn-admin-submit" onclick="publishNews()">ニュースを公開</button>
                </div>
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