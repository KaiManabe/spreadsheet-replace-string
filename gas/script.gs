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

    //適当な文言を返す
    return ContentService.createTextOutput("置換に成功しました．このタブは閉じてください．").setMimeType(ContentService.MimeType.TEXT);
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
      let data = s.getDataRange().getValues();

      /** すべてのセルに対して実行 */
      for(let r = 0; r < data.length; ++r){
        for(let c = 0; c < data[r].length; ++c){
          cellValue = data[r][c];
          if(typeof cellValue === "string" && cellValue != ""){
              replacedValue = cellValue.replaceAll(before, after);
              if(replacedValue != cellValue){
                data[r][c] = replacedValue;
              }
          }
        }
      }/** すべてのセルに対して実行 */
      s.getDataRange().setValues(data);

    }/** すべてのシートに対して実行 */
}/** すべてのブックに対して実行 */
}
  
  