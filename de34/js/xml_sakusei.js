// トラックデータを管理する配列
let tracks = [];

// DOM要素の参照
const filenameEntry = document.getElementById('filename_entry');
const pageEntry = document.getElementById('page_entry');
const urlEntry = document.getElementById('url_entry');
const trackList = document.getElementById('track_list');
const xmlPreviewBox = document.getElementById('xml_preview_box');

const addButton = document.getElementById('add_button');
const copyButton = document.getElementById('copy_button');
const createButton = document.getElementById('create_button');
const copiedPopup = document.getElementById('copied_popup');

// ページ数入力（半角数字のみ）
pageEntry.addEventListener('input', (e) => {
    let value = e.target.value;

    // 全角数字 → 半角数字
    value = value.replace(/[０-９]/g, s =>
        String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    );

    // 半角数字以外を削除
    value = value.replace(/\D/g, '');

    e.target.value = value;
});

// XML文字列を生成
function generateXmlString() {
    let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
    xml += '<Playlist>\n';

    tracks.forEach(track => {
        xml += '    <Track>\n';
        xml += `        <Page>${track.page}</Page>\n`;
        xml += `        <MusicPath>${track.url}</MusicPath>\n`;
        xml += '    </Track>\n';
    });

    xml += '</Playlist>\n';
    return xml;
}

// UI更新
function updateUI() {

    if (tracks.length === 0) {
        xmlPreviewBox.textContent =
            '　　　　<!-- トラックを追加するとここにXMLがリアルタイム生成されます -->';
    } else {
        xmlPreviewBox.textContent = generateXmlString();
    }

    trackList.innerHTML = '';

    tracks.forEach((track, index) => {

        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.gap = '15px';

        const textContainer = document.createElement('div');
        textContainer.style.flex = '1';

        const titleSpan = document.createElement('span');
        titleSpan.style.fontWeight = '600';
        titleSpan.textContent = `Page: ${track.page}`;

        textContainer.appendChild(titleSpan);

        const descSpan = document.createElement('span');
        descSpan.className = 'desc';
        descSpan.style.marginLeft = '10px';
        descSpan.textContent = track.url;

        textContainer.appendChild(descSpan);

        li.appendChild(textContainer);

        // ボタン
        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '8px';

        // 編集
        const editBtn = document.createElement('button');
        editBtn.textContent = '編集';

        editBtn.style.background = '#9b72ff';
        editBtn.style.color = '#fff';
        editBtn.style.border = 'none';
        editBtn.style.borderRadius = '8px';
        editBtn.style.padding = '6px 14px';
        editBtn.style.fontSize = '13px';
        editBtn.style.fontWeight = '500';
        editBtn.style.cursor = 'pointer';
        editBtn.style.transition = '.2s';

        editBtn.onmouseover = () => editBtn.style.background = '#80288b';
        editBtn.onmouseout = () => editBtn.style.background = '#9b72ff';

        editBtn.addEventListener('click', () => {

            pageEntry.value = track.page;
            urlEntry.value = track.url;

            tracks.splice(index, 1);

            updateUI();

            pageEntry.focus();

        });

        // 削除
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '削除';

        deleteBtn.style.background = '#faf8ff';
        deleteBtn.style.color = '#5a4f7a';
        deleteBtn.style.border = '1px solid #e6e3f2';
        deleteBtn.style.borderRadius = '8px';
        deleteBtn.style.padding = '6px 14px';
        deleteBtn.style.fontSize = '13px';
        deleteBtn.style.fontWeight = '500';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.transition = '.2s';

        deleteBtn.onmouseover = () => deleteBtn.style.background = '#f3efff';
        deleteBtn.onmouseout = () => deleteBtn.style.background = '#faf8ff';

        deleteBtn.addEventListener('click', () => {

            if (confirm('このトラックを削除しますか？')) {
                tracks.splice(index, 1);
                updateUI();
            }

        });

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);

        li.appendChild(btnContainer);

        trackList.appendChild(li);

    });

}
// トラック追加処理
addButton.addEventListener('click', () => {

    const page = pageEntry.value.trim();
    const url = urlEntry.value.trim();

    if (!page || !url) {
        alert("ページ番号とURLを入力してください。");
        return;
    }

    tracks.push({
        page,
        url
    });

    pageEntry.value = "";
    urlEntry.value = "";

    pageEntry.focus();

    updateUI();

});

// コードコピー処理
copyButton.addEventListener('click', () => {

    if (tracks.length === 0) {
        alert("Trackがありません。");
        return;
    }

    const xmlText = generateXmlString();

    navigator.clipboard.writeText(xmlText)
        .then(() => {

            copiedPopup.classList.add('show');

            setTimeout(() => {
                copiedPopup.classList.remove('show');
            }, 2000);

        })
        .catch(err => {
            alert("コピーに失敗しました: " + err);
        });

});

// XMLファイル作成
createButton.addEventListener('click', () => {

    if (tracks.length === 0) {
        alert("Trackがありません。");
        return;
    }

    let filename = filenameEntry.value.trim();

    if (filename === "") {
        filename = "playlist";
    }

    const xmlText = generateXmlString();

    const blob = new Blob(
        [xmlText],
        { type: 'text/xml;charset=utf-8;' }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.xml`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);

});

// 初期表示
updateUI();