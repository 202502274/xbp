/*ソースコードのコピーボタン*/
function copyCode(btn) {
  const codeBlock = btn.parentElement;
  const code = codeBlock.querySelector("code").innerText;
  const popup = codeBlock.querySelector(".copied-popup");

  navigator.clipboard.writeText(code).then(() => {
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 1200);
  });
}

/*html
コード
<div class="code-box">
	<button class="copy-btn" onclick="copyCode(this)">Copy</button>
	<div class="copied-popup">Copy!!</div>
       <pre><code>
        	<!--コード-->
	</code></pre>
</div>

文末
<script src="./js/code_copy.js"></script>
</body>
*/