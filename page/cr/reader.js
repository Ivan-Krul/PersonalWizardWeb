
let params = new URLSearchParams(document.location.search);
let title = params.get("title");
let page = params.get("page");

(async () => {

let json = await (fetch("./library/"+title+"/about.json")
    .then(response => response.json())
    .catch(document.getElementById("title").innerText = "Invalid entry!"));


let page_int = parseInt(page);

document.getElementById("title").innerText = json.title;
document.getElementById("date_first").innerText = json.date_first_page;
document.getElementById("date_latest").innerText = json.date_latest_page;
document.getElementById("page_count").innerText = json.pages;
document.getElementById("about").innerText = json.description;


/*
  let reqPage = aboutJson.numeration;
  let indxFirstDigit = reqPage.indexOf('#');
  let indxLastDigit = reqPage.lastIndexOf('#');
  
  if((indxLastDigit - indxFirstDigit) >= pageArg.length) {
    console.log(pageArg);
    reqPage = reqPage.replaceAll('#', '0');
    reqPage = [reqPage.slice(0,indxLastDigit - pageArg.length), pageArg, reqPage.slice(indxLastDigit - pageArg.length)].join();
  }
  else {
    reqPage = reqPage.replaceAll('#', '');
    reqPage = [reqPage.slice(0,indxFirstDigit), pageArg, reqPage.slice(indxFirstDigit)].join('');
  }
*/


if(page_int != NaN && page != null) {
  let target = json.numeration;

  let ix_first_d = target.indexOf('#');
  let ix_last_d = target.lastIndexOf('#');
  
  if((ix_last_d - ix_first_d) >= page.length) {
    target = target.replaceAll('#', '0');
    target = [target.slice(0,ix_last_d - page.length), page_int, target.slice(ix_last_d - page.length)].join();
  }
  else {
    target = target.replaceAll('#', '');
    target = [target.slice(0,ix_first_d), page_int, target.slice(ix_first_d)].join('');
  }

  document.getElementById("viewer").src = "./library/" + title + "/" + target;
  document.getElementById("inpnum_goto").value = page_int;
}


document.getElementById("goto_first").href = "./reader.html?title=" + title + "&page=1";
document.getElementById("btn_tofirst").disabled = page_int < 2;
document.getElementById("btn_tofirst").onclick = () => {
  window.open("./reader.html?title=" + title + "&page=1", '_self');
};

document.getElementById("btn_toprev").disabled = page_int <= 0;
document.getElementById("btn_toprev").onclick = () => {
  if(page >= 0)
    window.open("./reader.html?title=" + title + "&page=" + (page_int - 1), '_self');
};

document.getElementById("btn_goto").onclick = () => {
  let goto = parseInt(document.getElementById("inpnum_goto").value);
  if(goto <= json.pages)
    window.open("./reader.html?title=" + title + "&page=" + goto, '_self');
};

document.getElementById("btn_tonext").disabled = page_int >= json.pages;
document.getElementById("btn_tonext").onclick = () => {
  if(page <= json.pages)
    window.open("./reader.html?title=" + title + "&page=" + (page_int + 1), '_self');
};

document.getElementById("btn_tolast").disabled = page_int >= json.pages;
document.getElementById("btn_tolast").onclick = () => {
  window.open("./reader.html?title=" + title + "&page=" + json.pages, '_self');
};

})();
