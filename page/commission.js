

var detailed_json = {};
var detailed_crop = "full";
var detailed_config = "L0001";
var detailed_has_ref = true;

var detailed_valid_configs = [];

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

async function loadValidConfigs() {
  let text = await fetch("./image/commission placeholders/().txt")
                                .then(response => response.text())
                                .catch(e => "");
                                
  detailed_valid_configs = text.replaceAll('\r', '').split('\n');
}

function price(json = {}, str = "", crop = "full", ref = false) {
  const detail = str.substr(0, 3);
  const bg = str.substr(3, 1);
  const N_amount = parseInt(str.substr(4, 1));
  const ref_price = (1 - ref) + ref * json.global;
  
  return (( ((1 - N_amount) * json.count["0"] + json.crop[crop] * N_amount * N_amount * 0.6) * ref_price) * json.detail[detail] * json.background[bg] * json.global + json.base).toFixed(2);
}

function outputFinalPrice() {
  document.getElementById("d_final_price").innerText = price(detailed_json, detailed_config, detailed_crop, detailed_has_ref);
}

function outputSample() {
  let conf = detailed_config;
  conf = conf.replaceAt(4, conf[4] == '0' ? '0' : '1');
  
  document.getElementById("img_sample").src = "./image/commission placeholders/com ph ("+conf+").png";
}

function grayOutControllers() {
  //.disabled
  
  let bg_anchor = document.querySelector('input[name="background"]:checked').value;
  let ln_anchor = detailed_config[0];
  let pa_anchor = detailed_config[1];
  let sh_anchor = detailed_config[2];
  
  document.getElementById("d_background_blank")   .disabled = true;
  document.getElementById("d_background_abstract").disabled = true;
  document.getElementById("d_background_photo")   .disabled = true;
  document.getElementById("d_background_basic")   .disabled = true;
  document.getElementById("d_background_advanced").disabled = true;
  
  document.getElementById("d_detail_line")  .disabled = true;
  document.getElementById("d_detail_paint") .disabled = true;
  document.getElementById("d_detail_shadow").disabled = true;
  
  for(let i = 0; i < detailed_valid_configs.length; i++) {
    const config = detailed_valid_configs[i];
    if(config == detailed_config) continue;
    
    let diff = 0;
    for(let s = 0; s < 4; s++) {
      if(config[s] !== detailed_config[s]) {
        diff++;
      }
    }
    diff += ((detailed_config[4] === '0') ^ (config[4] === '0'));
    if(diff !== 1) continue;
    console.log((detailed_config[4] === '0') ^ (config[4] === '0'));
    
    if(bg_anchor !== config[3]) document.getElementById("d_background_advanced").disabled = false;
    if(bg_anchor !== config[3]) document.getElementById("d_background_basic")   .disabled = false;
    if(bg_anchor !== config[3]) document.getElementById("d_background_photo")   .disabled = false;
    if(bg_anchor !== config[3]) document.getElementById("d_background_abstract").disabled = false;
    if(bg_anchor !== config[3]) document.getElementById("d_background_blank")   .disabled = false;

    if(sh_anchor !== config[2]) document.getElementById("d_detail_shadow").disabled = false;
    if(pa_anchor !== config[1]) document.getElementById("d_detail_paint") .disabled = false;
    if(ln_anchor !== config[0]) document.getElementById("d_detail_line")  .disabled = false;
  }
}

function onSelectChange(event) {
  let is_simple = (event.target.value === "simple");
  document.getElementById("simple").style.display = is_simple ? "inherit" : "none";
  document.getElementById("detailed").style.display = !is_simple ? "inherit" : "none";
}

function onCropChange() {
  detailed_crop = document.querySelector('input[name="crop"]:checked').value;
  outputFinalPrice();
  outputSample();
}

function onCheckboxLineChange(event) {
  detailed_config = detailed_config.replaceAt(0, event.target.checked ? 'L' : '0');
  outputFinalPrice();
  outputSample();
  grayOutControllers();
}

function onCheckboxPaintChange(event) {
  detailed_config = detailed_config.replaceAt(1, event.target.checked ? 'P' : '0');
  outputFinalPrice();
  outputSample();
  grayOutControllers();
}

function onCheckboxShadowChange(event) {
  detailed_config = detailed_config.replaceAt(2, event.target.checked ? 'S' : '0');
  outputFinalPrice();
  outputSample();
  grayOutControllers();
}

function onBackgroundChange() {
  let val = document.querySelector('input[name="background"]:checked').value;
  detailed_config = detailed_config.replaceAt(3, val);
  outputFinalPrice();
  outputSample();
  grayOutControllers();
}

function onAmountChange(event) {
  console.log(event.target.value)
  detailed_config = detailed_config.replaceAt(4, event.target.value);
  outputFinalPrice();
  outputSample();
  grayOutControllers();
}


function onRefChange(event) {
  detailed_has_ref = event.target.checked;
  outputFinalPrice();
}

(async () => {
  const json = await fetch("./commission_params.json").then(response => response.json()).catch((e) => {
    document.getElementById("none").style.display = "inherit";
    console.error(e);
    return;
  });

  // on load
  try {
    loadValidConfigs();
    
    document.querySelector("form").reset();
    
    document.getElementById("select_pricing").onchange = onSelectChange;
    
    document.getElementById("s_base_head").innerText = price(json, "L0001", "head");
    document.getElementById("s_base_half").innerText = price(json, "L0001", "half");
    document.getElementById("s_base_full").innerText = price(json, "L0001", "full");
    
    document.getElementById("s_full_lp0").innerText = (price(json, "LP001", "full") - price(json, "L0001", "full")).toFixed(2);
    document.getElementById("s_full_lps").innerText = (price(json, "LPS01", "full") - price(json, "L0001", "full")).toFixed(2);
    document.getElementById("s_full_0p0").innerText = (price(json, "0P001", "full") - price(json, "L0001", "full")).toFixed(2);
    document.getElementById("s_full_0ps").innerText = (price(json, "0PS01", "full") - price(json, "L0001", "full")).toFixed(2);
    
    document.getElementById("s_full_lps_a").innerText = (price(json, "LPSA1", "full") - price(json, "LPS01", "full")).toFixed(2);
    document.getElementById("s_full_lps_p").innerText = (price(json, "LPSP1", "full") - price(json, "LPS01", "full")).toFixed(2);
    document.getElementById("s_full_lps_m").innerText = (price(json, "LPSM1", "full") - price(json, "LPS01", "full")).toFixed(2);
    document.getElementById("s_full_lps_h").innerText = (price(json, "LPSH1", "full") - price(json, "LPS01", "full")).toFixed(2);
    
    document.getElementById("s_lps_m_only").innerText =      (price(json, "LPSM0", "full") - price(json, "LPSM1", "full")).toFixed(2);
    document.getElementById("s_full_lps_m_one").innerText =  (price(json, "LPSM1", "full") - price(json, "LPSM1", "full")).toFixed(2);
    document.getElementById("s_full_lps_m_more").innerText = (price(json, "LPSM2", "full") - price(json, "LPSM1", "full")).toFixed(2);
    
    document.getElementById("s_full_lps_m_one_ref").innerText = (price(json, "L0002", "full") - price(json, "L0002", "full", true)).toFixed(2);
    
    document.getElementById("d_crop_head").onchange = onCropChange;
    document.getElementById("d_crop_half").onchange = onCropChange;
    document.getElementById("d_crop_full").onchange = onCropChange;
    
    document.getElementById("d_detail_line").onchange = onCheckboxLineChange;
    document.getElementById("d_detail_paint").onchange = onCheckboxPaintChange;
    document.getElementById("d_detail_shadow").onchange = onCheckboxShadowChange;
    
    document.getElementById("d_background_blank").onchange = onBackgroundChange;
    document.getElementById("d_background_abstract").onchange = onBackgroundChange;
    document.getElementById("d_background_photo").onchange = onBackgroundChange;
    document.getElementById("d_background_basic").onchange = onBackgroundChange;
    document.getElementById("d_background_advanced").onchange =  onBackgroundChange;
    
    document.getElementById("d_count").onchange = onAmountChange;
    
    document.getElementById("d_reference").onchange = onRefChange;
    
    detailed_json = json;
    
    outputFinalPrice();
    outputSample();

  }
  catch(e) {
    document.getElementById("none").style.display = "inherit";
    console.error(e);
  }
  if(document.getElementById("select_pricing").value == "simple") {
    document.getElementById("simple").style.display = "inherit";
  }
  else {
    document.getElementById("detailed").style.display = "inherit";
  }
})();
