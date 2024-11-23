// デプロイしたGASAPIのURL
const API_URL = "https://script.google.com/macros/s/AKfycbzP9R-sJe2nqGlnehdkvr-AxwA87cFXZ9AcsstiZPAn4y-EFWUU7orRiGT3WFSNRWfe/exec";

// ユーザが設定したURLの数
window.urlCount = 0;


/**
 * urlの入力フォームを追加する
 */
function addSheetURL(){
    // 要素作成
    const urlTbody = document.querySelector("#urlTable tbody");
    let newRow = document.createElement("tr");
    let newCellLeft = document.createElement("td");
    let newCellRight = document.createElement("td");
    let newLabel = document.createElement("label");
    let newInput = document.createElement("input");

    // 要素追加
    urlTbody.appendChild(newRow);
    newRow.appendChild(newCellLeft);
    newRow.appendChild(newCellRight);
    newCellLeft.appendChild(newLabel);
    newCellRight.appendChild(newInput);

    // 要素の属性設定
    newCellLeft.classList.add("tdLabel");
    newCellRight.classList.add("tdInput");

    newRow.id = `row_${String(window.urlCount).padStart(2, "0")}`;
    
    newLabel.setAttribute("for", `url_${String(window.urlCount).padStart(2, "0")}`);
    newLabel.innerHTML = `URL (${String(window.urlCount + 1)})`;

    newInput.id = `url_${String(window.urlCount).padStart(2, "0")}`;
    newInput.placeholder = "https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXX/edit";
    newInput.classList.add("urls");

    // 一番下のフォームが入力されたら新たな入力欄を追加
    let currentIndex = window.urlCount;
    newInput.addEventListener("change", function(){
        if(currentIndex == window.urlCount - 1) addSheetURL();
    });

    window.urlCount++;
}


/**
 * ボタンを押されたときに実行
 * urlをjson形式にしてPOST送信
 */
function submitForm(){
    urls = [];

    let inputs = document.querySelectorAll(".urls");
    for(let i = 0; i < inputs.length; ++i){
        let url = inputs[i].value;
        if(url == "") continue;
        urls.push(url);
    }
    document.querySelector("#url").value = JSON.stringify(urls);

    document.querySelector("#userFormSubmit").click();
}



window.addEventListener("load", function(){
    /** formのaction属性を設定 */
    const FORM = document.querySelector("#userForm");
    FORM.setAttribute("action", API_URL);

    /** urlの1行目を作成 */
    addSheetURL();

    /** ボタンにイベントリスナを仕込む */
    document.querySelector("#submitButton").addEventListener("click", submitForm);
});

