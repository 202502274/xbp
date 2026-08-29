let appData = { events: [], currentEventId: null };
let currentViewMode = 'register'; // register, events, goods

window.onload = function() {
    const saved = localStorage.getItem('eventGoodsSimpleAppData');
    if (saved) appData = JSON.parse(saved);
    refreshAllViews();
};

// ① タブの表示切り替えロジック
function switchView(mode) {
    currentViewMode = mode;
    document.querySelectorAll('.nav-menu a').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${mode === 'register' ? 'register' : (mode === 'events' ? 'events' : 'goods')}`).classList.add('active');

    const regSection = document.getElementById('view-register');
    const dispSection = document.getElementById('view-display-container');
    const sidebar = document.getElementById('event-sidebar');

    if (mode === 'register') {
        regSection.style.display = 'block';
        dispSection.style.display = 'none';
    } else if (mode === 'events') {
        regSection.style.display = 'none';
        dispSection.style.display = 'block';
        sidebar.style.display = 'block';
        renderMainContent();
    } else if (mode === 'goods') {
        regSection.style.display = 'none';
        dispSection.style.display = 'block';
        sidebar.style.display = 'none'; // グッズ一覧の時は左メニューを隠して広く使う
        renderAllGoodsContent();
    }
}

function createNewEvent() {
    const nameInput = document.getElementById('event-name');
    const dateInput = document.getElementById('event-date');
    if (!nameInput.value) return alert('イベント名を入力してください');

    const newEvent = {
        id: 'ev_' + Date.now(),
        name: nameInput.value,
        date: dateInput.value || '日付未設定',
        items: []
    };
    appData.events.push(newEvent);
    appData.currentEventId = newEvent.id;
    nameInput.value = ''; dateInput.value = '';
    saveAndRefresh();
    switchView('events'); // 作成したらイベント一覧へ自動ジャンプ
}

function addGoods() {
    const targetEventId = document.getElementById('select-target-event').value;
    if (!targetEventId) return alert('追加先のイベントを作成・選択してください');
    
    const nameInput = document.getElementById('goods-name');
    const priceInput = document.getElementById('goods-price');
    const imgInput = document.getElementById('goods-image');
    if (!nameInput.value) return alert('グッズ名を入力してください');

    const currentEvent = appData.events.find(e => e.id === targetEventId);
    const unitPrice = Number(priceInput.value) || 0;
    
    if (imgInput.files && imgInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) { insertItem(currentEvent, nameInput.value, unitPrice, e.target.result); };
        reader.readAsDataURL(imgInput.files[0]);
    } else {
        insertItem(currentEvent, nameInput.value, unitPrice, 'https://placeholder.com');
    }
    nameInput.value = ''; priceInput.value = '0'; imgInput.value = '';
}

function insertItem(eventObj, name, price, imgSrc) {
    const defaultVariantId = 'v_' + Date.now();
    eventObj.items.push({
        id: 'item_' + Date.now(),
        name: name,
        price: price,
        variants: [{ id: defaultVariantId, name: '通常分/全体', image: imgSrc, quantity: 0 }],
        selectedVariantId: defaultVariantId
    });
    saveAndRefresh();
    alert('グッズを登録しました！');
}

function stepQty(itemId, variantId, amount) {
    appData.events.forEach(ev => {
        const item = ev.items.find(i => i.id === itemId);
        if (item) {
            const variant = item.variants.find(v => v.id === variantId);
            if (variant) variant.quantity = Math.max(0, variant.quantity + amount);
        }
    });
    saveAndRefresh();
}

function inputQty(itemId, variantId, value) {
    appData.events.forEach(ev => {
        const item = ev.items.find(i => i.id === itemId);
        if (item) {
            const variant = item.variants.find(v => v.id === variantId);
            if (variant) { const num = parseInt(value, 10); variant.quantity = isNaN(num) || num < 0 ? 0 : num; }
        }
    });
    saveAndRefresh();
}

function changeVariantSelect(itemId, variantId) {
    appData.events.forEach(ev => {
        const item = ev.items.find(i => i.id === itemId);
        if (item) item.selectedVariantId = variantId;
    });
    saveAndRefresh();
}

function openEditModal(itemId) {
    let foundItem = null;
    appData.events.forEach(ev => {
        const item = ev.items.find(i => i.id === itemId);
        if (item) foundItem = item;
    });
    if (!foundItem) return;
    document.getElementById('edit-item-id').value = itemId;
    document.getElementById('edit-goods-name').value = foundItem.name;
    document.getElementById('edit-goods-price').value = foundItem.price;
    renderVariantManageList(foundItem);
    document.getElementById('edit-modal').classList.add('show');
}

function closeEditModal() { document.getElementById('edit-modal').classList.remove('show'); }

// 【②の要望】編集モーダルの中に完全に統合された、グッズ全削除の実行関数
function deleteItemDirect() {
    const itemId = document.getElementById('edit-item-id').value;
    if (!confirm('このグッズを完全に削除しますか？')) return;
    appData.events.forEach(ev => { ev.items = ev.items.filter(i => i.id !== itemId); });
    closeEditModal(); saveAndRefresh();
}

function saveGoodsEdit() {
    const itemId = document.getElementById('edit-item-id').value;
    appData.events.forEach(ev => {
        const item = ev.items.find(i => i.id === itemId);
        if (item) {
            item.name = document.getElementById('edit-goods-name').value;
            item.price = Number(document.getElementById('edit-goods-price').value) || 0;
        }
    });
    saveAndRefresh(); alert('情報を変更しました');
}

function addVariant() {
    const itemId = document.getElementById('edit-item-id').value;
    let foundItem = null;
    appData.events.forEach(ev => { const item = ev.items.find(i => i.id === itemId); if (item) foundItem = item; });
    const varNameInput = document.getElementById('new-variant-name');
    const varImgInput = document.getElementById('new-variant-image');
    if (!varNameInput.value) return alert('種類名を入力してください');

    if (varImgInput.files && varImgInput.files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            foundItem.variants.push({ id: 'v_' + Date.now(), name: varNameInput.value, image: e.target.result, quantity: 0 });
            varNameInput.value = ''; varImgInput.value = ''; renderVariantManageList(foundItem); saveAndRefresh();
        };
        reader.readAsDataURL(varImgInput.files);
    } else {
        const fallbackImg = foundItem.variants.length > 0 ? foundItem.variants[0].image : 'https://placeholder.com';
        foundItem.variants.push({ id: 'v_' + Date.now(), name: varNameInput.value, image: fallbackImg, quantity: 0 });
        varNameInput.value = ''; renderVariantManageList(foundItem); saveAndRefresh();
    }
}

function deleteVariant(itemId, variantId) {
    appData.events.forEach(ev => {
        const item = ev.items.find(i => i.id === itemId);
        if (item) {
            if (item.variants.length <= 1) return alert('最低1つの種類が必要です');
            if (!confirm('この種類を削除しますか？')) return;
            item.variants = item.variants.filter(v => v.id !== variantId);
            if (item.selectedVariantId === variantId) item.selectedVariantId = item.variants[0].id;
            renderVariantManageList(item);
        }
    });
    saveAndRefresh();
}

function renderVariantManageList(item) {
    const list = document.getElementById('variant-manage-list'); list.innerHTML = '';
    item.variants.forEach(v => {
        const li = document.createElement('li'); li.className = 'modal-item-row';
        li.innerHTML = `<span>🔹 ${v.name} (${v.quantity}個)</span><button onclick="deleteVariant('${item.id}', '${v.id}')" style="width:auto; padding:2px 6px; background:#cc6666; font-size:0.75rem;">削除</button>`;
        list.appendChild(li);
    });
}

function saveAndRefresh() {
    localStorage.setItem('eventGoodsSimpleAppData', JSON.stringify(appData));
    refreshAllViews();
}

function refreshAllViews() {
    renderEventList();
    renderDropdownSelect();
    if (currentViewMode === 'events') renderMainContent();
    if (currentViewMode === 'goods') renderAllGoodsContent();
}

function renderDropdownSelect() {
    const select = document.getElementById('select-target-event'); if (!select) return;
    select.innerHTML = '';
    appData.events.forEach(ev => {
        const opt = document.createElement('option'); opt.value = ev.id; opt.textContent = ev.name;
        if (ev.id === appData.currentEventId) opt.selected = true;
        select.appendChild(opt);
    });
}

function renderEventList() {
    const listEl = document.getElementById('event-list-display'); if (!listEl) return;
    listEl.innerHTML = '';
    appData.events.forEach(ev => {
        const li = document.createElement('li'); li.className = ev.id === appData.currentEventId ? 'active' : '';
        li.setAttribute('onclick', `selectEvent('${ev.id}')`);
        li.innerHTML = `<strong>${ev.name}</strong><span class="desc">📅 ${ev.date}</span>`;
        listEl.appendChild(li);
    });
}

function selectEvent(id) {
    appData.currentEventId = id;
    saveAndRefresh();
}

// 【③の機能】グッズ一覧タブ：全グッズを横断してバッと並べるカードHTML生成
function renderAllGoodsContent() {
    const mainEl = document.getElementById('main-display'); html = `<div class="goods-grid">`;
    let count = 0;
    appData.events.forEach(ev => {
        ev.items.forEach(item => {
            count++; let currentVariant = item.variants.find(v => v.id === item.selectedVariantId) || item.variants;
            let totalQty = 0; item.variants.forEach(v => totalQty += v.quantity);
            let selectOptions = ''; item.variants.forEach(v => { selectOptions += `<option value="${v.id}" ${v.id === currentVariant.id ? 'selected' : ''}>${v.name} (${v.quantity}個)</option>`; });
            html += `
                <div class="goods-card ${totalQty > 0 ? 'owned' : ''}">
                    <div class="card-actions"><button class="action-link edit-link" onclick="openEditModal('${item.id}')">✏️ 編集</button></div>
                    <img src="${currentVariant.image}" class="goods-img">
                    <div class="goods-info">
                        <p class="goods-name">${item.name}</p><small style="color:#759076;">📍 ${ev.name}</small>
                        <p class="goods-price">単価: ${item.price.toLocaleString()} 円</p><p class="goods-total">グッズ総計: ${(item.price * totalQty).toLocaleString()} 円</p>
                        <div style="margin:4px 0;"><select onchange="changeVariantSelect('${item.id}', this.value)" style="padding:4px; font-size:0.8rem; width:100%; border-radius:4px;">${selectOptions}</select></div>
                        <div class="count-wrapper">
                            <button class="qty-btn" onclick="stepQty('${item.id}', '${currentVariant.id}', -1)">-</button>
                            <input type="number" class="count-input" value="${currentVariant.quantity}" onchange="inputQty('${item.id}', '${currentVariant.id}', this.value)">
                            <button class="qty-btn" onclick="stepQty('${item.id}', '${currentVariant.id}', 1)">+</button>
                        </div>
                    </div>
                </div>`;
        });
    });
    if (count === 0) html += `<p style="color:#759076; text-align:center; padding:30px 0; grid-column:1/-1;">登録されたグッズがありません。</p>`;
    mainEl.innerHTML = html + `</div>`;
}

// 【①の機能】イベント別表示エリア（収集率の項目を完全カット）
function renderMainContent() {
    const mainEl = document.getElementById('main-display');
    const currentEvent = appData.events.find(e => e.id === appData.currentEventId);
    if (!currentEvent) { mainEl.innerHTML = `<p style="color:#759076;text-align:center;">イベントを選択してください。</p>`; return; }

    let totalEventMoney = 0; currentEvent.items.forEach(item => { item.variants.forEach(v => { totalEventMoney += item.price * v.quantity; }); });
    let html = `<div class="event-header"><div><h3>🎉 ${currentEvent.name}</h3><small>📅 開催日: ${currentEvent.date}</small></div><div class="total-money">総合計: ${totalEventMoney.toLocaleString()} 円</div></div><div class="goods-grid">`;
    
    currentEvent.items.forEach(item => {
        let currentVariant = item.variants.find(v => v.id === item.selectedVariantId) || item.variants;
        let totalQty = 0; item.variants.forEach(v => totalQty += v.quantity);
        let selectOptions = ''; item.variants.forEach(v => { selectOptions += `<option value="${v.id}" ${v.id === currentVariant.id ? 'selected' : ''}>${v.name} (${v.quantity}個)</option>`; });
        html += `
            <div class="goods-card ${totalQty > 0 ? 'owned' : ''}">
                <div class="card-actions"><button class="action-link edit-link" onclick="openEditModal('${item.id}')">✏️ 編集</button></div>
                <img src="${currentVariant.image}" class="goods-img">
                <div class="goods-info">
                    <p class="goods-name">${item.name}</p><p class="goods-price">単価: ${item.price.toLocaleString()} 円</p><p class="goods-total">グッズ総計: ${(item.price * totalQty).toLocaleString()} 円</p>
                    <div style="margin:4px 0;"><select onchange="changeVariantSelect('${item.id}', this.value)" style="padding:4px; font-size:0.8rem; width:100%; border-radius:4px;">${selectOptions}</select></div>
                    <div class="count-wrapper">
                        <button class="qty-btn" onclick="stepQty('${item.id}', '${currentVariant.id}', -1)">-</button>
                        <input type="number" class="count-input" value="${currentVariant.quantity}" onchange="inputQty('${item.id}', '${currentVariant.id}', this.value)">
                        <button class="qty-btn" onclick="stepQty('${item.id}', '${currentVariant.id}', 1)">+</button>
                    </div>
                </div>
            </div>`;
    });
    if (currentEvent.items.length === 0) html += `<p style="color:#759076; text-align:center; padding:30px 0; grid-column:1/-1;">グッズが未登録です。</p>`;
    mainEl.innerHTML = html + `</div>`;
}
