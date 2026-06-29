// トラックデータを管理する配列
const tracks = [];

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

// ページ数の入力時に全角数字を半角に変換し、数字以外を除去
pageEntry.addEventListener('input', (e) => {
    let value = e.target.value;
    // 全角数字を半角数字に変換
    value = value.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    // 数字以外の文字を削除
    e.target.value = value.replace(/[^0-9]/g, '');
});

// XML文字列を綺麗にビルドする関数（ご指定の空白・改行フォーマットに修正）
function generateXmlString() {
    let xml = '<?xml version="1.0" encoding="utf-8" ?>\n';
    xml += '<Playlist>\n'; 
    
    tracks.forEach(track => {
        xml += '    <Track>\n'; // インデントを半角スペース4つに設定
        xml += `        <Page>${track.page}</Page>\n`;
        xml += `        <MusicPath>${track.url}</MusicPath>\n`;
        xml += '    </Track>\n';
    });
    
    xml += '</Playlist>\n';
    return xml;
}

// プレビュー表示エリアを更新する関数
function updatePreview() {
    if (tracks.length === 0) {
        xmlPreviewBox.textContent = '<!-- トラックを追加するとここにXMLがリアルタイム生成されます -->';
        return;
    }
    xmlPreviewBox.textContent = generateXmlString();
}

// トラック追加処理
addButton.addEventListener('click', () => {
    const page = pageEntry.value.trim();
    const url = urlEntry.value.trim();

    if (!page || !url) {
        alert("ページ番号とURLを入力してください。");
        return;
    }

    tracks.push({ page, url });

    // .link-list の構造に合わせてカード形式のリストを生成
    const li = document.createElement('li');
    const titleSpan = document.createElement('span');
    titleSpan.style.fontWeight = '600';
    titleSpan.textContent = `Page: ${page}`;
    li.appendChild(titleSpan);

    const descSpan = document.createElement('span');
    descSpan.className = 'desc';
    descSpan.textContent = url;
    li.appendChild(descSpan);

    trackList.appendChild(li);

    pageEntry.value = "";
    urlEntry.value = "";
    pageEntry.focus();

    updatePreview();
});

// コードコピー処理
copyButton.addEventListener('click', () => {
    if (tracks.length === 0) {
        alert("Trackがありません。");
        return;
    }

    const xmlText = generateXmlString();
    
    navigator.clipboard.writeText(xmlText).then(() => {
        copiedPopup.classList.add('show');
        setTimeout(() => {
            copiedPopup.classList.remove('show');
        }, 2000);
    }).catch(err => {
        alert("コピーに失敗しました: " + err);
    });
});

// XMLファイルの作成・ローカルダウンロード処理
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
    const blob = new Blob([xmlText], { type: 'text/xml;charset=utf-8;' });
    const link = document.createElement("a");
    
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${filename}.xml`);
    document.body.appendChild(link);
    
    link.click(); 
    document.body.removeChild(link);
});