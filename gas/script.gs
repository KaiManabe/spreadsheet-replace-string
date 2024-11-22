/**
 * APIに対してPOSTリクエストが飛んできたときに呼ばれる
 * ToDo: 処理結果をJSONで返す
 * 
 * @param {*} e POSTリクエストオブジェクト
 */
function doPost(e){
    const URL = JSON.parse(e.parameter.url);
    const REPLACE_BEFORE = e.parameter.before;
    const REPLACE_AFTER = e.parameter.after;
    
    replace(URL, REPLACE_BEFORE, REPLACE_AFTER);
}
  

/**
 * すべてのブックのすべてのシートのすべてのセルに対し，置換を実行
 * 探索するセルの数が多いとそこそこの時間を要する
 * 
 * @param {Array<string>} url ブックのURL(配列)
 * @param {string} before 置換元文字列
 * @param {string} after 置換後文字列
 */
function replace(url, before, after){
/** すべてのブックに対して実行 */
for(let i = 0; i < url.length; ++i){
    let ss = SpreadsheetApp.openByUrl(url[i]);
    let sheets = ss.getSheets();

    /** すべてのシートに対して実行 */
    for(let j = 0; j < sheets.length; ++j){
    let s = sheets[j];
    const data = s.getDataRange().getValues();

    /** すべてのセルに対して実行 */
    for(let r = 0; r < data.length; ++r){
        for(let c = 0; c < data[r].length; ++c){
        cellValue = s.getRange(r+1,c+1).getValue();
        if(typeof cellValue === "string" && cellValue != ""){
            replacedValue = cellValue.replaceAll(before, after);
            if(replacedValue != cellValue){
            s.getRange(r+1, c+1).setValue(replacedValue);
            }
        }
        }
    }/** すべてのセルに対して実行 */
    }/** すべてのシートに対して実行 */
}/** すべてのブックに対して実行 */
}
  
  