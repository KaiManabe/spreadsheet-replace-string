/**********************************************************************************************************
 * 設定必須の定数
**********************************************************************************************************/
// デプロイしたGASAPIのURL
const API_URL = "";

// URL入力欄に表示される文字列
const USERFORM_PLACEHOLDER = "";

// URL入力欄のサイズ (em)
const USERFORM_WIDTH = 50;
const USERFORM_HEIGHT = 10;

// spreadsheetのURL判定用正規表現
const IS_SPREADSHEET = r = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-90_]+/;

// 確認用ポップアップの文言
const CONFIRM_STRING = "入力されたスプレッドシートに対して置換を実行します";

// 無効なURLを警告するポップアップの文言
const INVALID_URL_ALERT_STRING = "無効なURLが含まれています\nこれらのURLは無視されます";

/**********************************************************************************************************
 * グローバル変数
 **********************************************************************************************************/
// ユーザが設定したURLの数
window.urlCount = 0;


/**********************************************************************************************************
 * 関数定義
 **********************************************************************************************************/

/**
 * ボタンを押されたときに実行
 * urlをjson形式にしてPOST送信
 */
function submitForm(){
    // 入力されたurlをチェック
    urls = [];
    let invalidUrls = [];
    let inputs = document.querySelector("#userFormUrl").value.split("\n");
    for(let i = 0; i < inputs.length; ++i){
        if(IS_SPREADSHEET.test(inputs[i])){
            urls.push(inputs[i]);
        }else if(inputs[i].replace(" ", "") != ""){
            invalidUrls.push(inputs[i]);
        }
    }

    // 無効なurlが含まれている場合には警告
    if(invalidUrls.length > 0){
        let alertString = INVALID_URL_ALERT_STRING
        for(let i = 0; i < invalidUrls.length; ++i){
            alertString += "\n";
            alertString += invalidUrls[i];
        }
        window.alert(alertString);
    }
    
    // 確認ポップアップを出し、OKが押されたらAPIを叩く
    if(urls.length > 0 && window.confirm(CONFIRM_STRING)){
        document.querySelector("#url").value = JSON.stringify(urls);
        document.querySelector("#userFormSubmit").click();
    }

}


/**********************************************************************************************************
 * ページ読み込み完了時のコールバック
 **********************************************************************************************************/
window.addEventListener("load", function(){
    /** formのaction属性を設定 */
    const FORM = document.querySelector("#userForm");
    FORM.setAttribute("action", API_URL);

    /** placeholderをセット */
    const USERFORM_URL = document.querySelector("#userFormUrl");
    USERFORM_URL.setAttribute("placeholder", USERFORM_PLACEHOLDER);

    /** USERFORMの大きさを設定 */
    USERFORM_URL.style.width = USERFORM_WIDTH + "rem";
    USERFORM_URL.style.height = USERFORM_HEIGHT + "rem";

    if(API_URL == ""){
        window.alert("GAS APIのURLが設定されていません")
    }

    /** ボタンにイベントリスナを仕込む */
    document.querySelector("#submitButton").addEventListener("click", submitForm);
});

