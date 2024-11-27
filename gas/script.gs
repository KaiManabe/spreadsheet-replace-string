/**
 * APIに対してPOSTリクエストが飛んできたときに呼ばれる
 * ToDo: 処理結果をJSONで返す
 * 
 * @param {*} e POSTリクエストオブジェクト
 */
function doPost(e){
    const URL = JSON.parse(e.parameter.url);
    const REPLACEMENT_STRING = JSON.parse(e.parameter.replacement);
    
    let replaced = replace(URL, REPLACEMENT_STRING);

    let resp = "次のスプレッドシートの置換が完了しました．\n";
    for(let i = 0; i < replaced.length; ++i){
      resp += replaced[i] + "\n";
    }
    if(replaced.length < URL.length){
      resp += "\nGAS実行時間の制限により，次のスプレッドシートは処理が完了していません．\n";
      for(let i = 0; i < URL.length; ++i){
        if(replaced.indexOf(URL[i]) == -1){
          resp += URL[i] + "\n";
        }
      } 
    }
    return ContentService.createTextOutput(resp).setMimeType(ContentService.MimeType.TEXT);
}
  

/**
 * すべてのブックのすべてのシートのすべてのセルに対し，置換を実行
 * 探索するセルの数が多いとそこそこの時間を要する
 * 
 * @param {Array<string>} url ブックのURL(JSON)
 * @param {object} replacementString 置換前後文字列 (JSON)
 * 
 * @return {Array<string>} 置換が完了したURL
 */
function replace(url, replacementString){
  let startTime = new Date();
  let stop = false;
  let replacedUrls = [];

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
              replacedValue = replaceString(cellValue, replacementString);
              if(replacedValue != cellValue){
                data[r][c] = replacedValue;
              }
          }

          /** 経過時間が5分を超えたら中止 */
          let currentTime = new Date();
          if(currentTime - startTime > 300000){
            stop = true;
            break;
          }
        }
        if(stop) break;
      }/** すべてのセルに対して実行 */
      if(stop) break;
      s.getDataRange().setValues(data);

    }/** すべてのシートに対して実行 */
    if(stop) break;
    replacedUrls.push(url[i]);
  }/** すべてのブックに対して実行 */
  return replacedUrls;
}


/**
 * JSONに基づいて複数回の置換を実行する
 * 
 * @param {string} original 置換元文字列
 * @param {object} replacementString 置換前後の文字列 (JSON)
 */
function replaceString(original, replacementString){
  let ret = original;
  for(let i = 0; i < replacementString.length; ++i){
    ret = ret.replaceAll(replacementString[i]["before"], replacementString[i]["after"]);
  }
  return ret;
}
  
  