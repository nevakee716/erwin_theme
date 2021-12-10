function addCss(rule) {
  let css = document.createElement("style");
  css.type = "text/css";
  if (css.styleSheet) css.styleSheet.cssText = rule;
  // Support for IE
  else css.appendChild(document.createTextNode(rule)); // Support for the rest
  document.getElementsByTagName("head")[0].appendChild(css);
}

// CSS rules
let halfSize = "{ width : 30rem; flex: 1 0 auto; margin : 0.75rem}";
let fullSize = "{ width : calc(100% - 0.75rem); min-width: 600px;}";
//list box title
let rule = "div.cw-property-details-right { width : calc(50% - 1.5rem);}";
rule += " div.filteredListBox div.cw-property-details-right { width : calc(50% - 1.5rem);}";

rule += " .property-box-asso ul.cw-accordion-header {width: calc(100% - 1.25rem);}";
rule += "  div.cw-accordion-content div.cw-accordion-header {width: calc(100% - 16px);}";
rule += " .cwLayoutTimelineExpertModeConfig div.cwPropertiesTableContainer {width: calc(100% - 2.5rem);}";

rule += " .homePage_display_content .tableForPopoutWrapper {width: calc(100% - 10px)}";

rule += " .cw-jvectormap-from-list .cwLayoutList {width: calc(15rem - 20px);}";
rule += " .cw-jvectormap-from-list > div {  width: calc(100% - 15rem - 20px);}";
rule += " .cw-jvectormap-from-list > .cwLayoutList { height: calc(100%);}";

rule += " .cw-jvectormap-from-list .cwLayoutList .cwLayoutList{  width: calc(100% - 0.75rem);}";
rule += " div.empty.k-grid div.property-box.property-box-asso { width: calc(100% - 1rem); }";
rule += " div.empty.k-grid div.cw-list-wrapper { width: calc(100% - 1rem); }";
rule += " div.empty.k-grid div.property-box.property-box-asso {width: calc(100% - 1rem);}";
rule += " div.empty.k-grid div.cw-list-wrapper { width: calc(100% - 1rem); }";
rule += " div.wrap-kendo-mobile { width: calc(100% - 1.5rem); }";
rule += " div.cwPropertiesTableContainer[id*='full'] { width: calc(100% - 1.5rem); }";
rule += " div.cwPropertiesTableContainer[id*='pct50'] { width: calc(50% - 1.5rem); }";
rule += " div.cwPropertiesTableContainer[id*='pct75'] { width: calc(75% - 1.5rem); }";
rule += " div.cwPropertiesTableContainer[id*='pct80'] { width: calc(80% - 1.5rem); }";
rule += " div.cwPropertiesTableContainer[id*='pct90'] { width: calc(90% - 1.5rem); }";
rule += " div.cwPropertiesTableContainer[id*='pct60'] { width: calc(60% - 1.5rem); }";
rule += " div.cwPropertiesTableContainer[id*='pct40'] { width: calc(40% - 1.5rem); }";
rule += " div.cwPropertiesTableContainer[id*='pct30'] { width: calc(30% - 1.5rem); }";
rule += " div.cwPropertiesTableContainer[id*='pct25'] { width: calc(20% - 1.5rem); }";

rule += " div.property-box[class*='pct50']{width: calc(50% - 1.5rem);}";
rule += " div.property-box[class*='pct75']{width: calc(75% - 1.5rem);}";
rule += " div.property-box[class*='pct80']{width: calc(80% - 1.5rem);}";
rule += " div.property-box[class*='pct90']{width: calc(90% - 1.5rem);}";
rule += " div.property-box[class*='pct60']{width: calc(60% - 1.5rem);}";
rule += " div.property-box[class*='pct40']{width: calc(40% - 1.5rem);}";
rule += " div.property-box[class*='pct30']{width: calc(30% - 1.5rem);}";
rule += " div.property-box[class*='pct25']{width: calc(20% - 1.5rem);}";

// Load the rules and execute after the DOM loads
window.onload = function () {
  var a = setInterval(function () {
    if (!document.body) return;
    clearInterval(a);
    if (window.getComputedStyle(document.body).backgroundColor != "rgb(255, 255, 255)") {
      console.log("Enable Next Gen Style");
      cwAPI.cwLayouts.cwLayoutGrid = cwAPI.cwLayouts.cwLayoutGridForPopout;
      addCss(rule);
    }
  }, 1000);
};
