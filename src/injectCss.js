function addCss(rule) {
  let css = document.createElement("style");
  css.type = "text/css";
  if (css.styleSheet) css.styleSheet.cssText = rule;
  // Support for IE
  else css.appendChild(document.createTextNode(rule)); // Support for the rest
  document.getElementsByTagName("head")[0].appendChild(css);
}

// CSS rules
let halfSize = "{ width : calc(50% - 1.5rem);}";
let fullSize = "{ width : calc(100% - 0.75rem); min-width: 600px;}";
//list box title
let rule = "div.cw-property-details-right { width : calc(50% - 1.5rem);}";
rule += " div.filteredListBox div.cw-property-details-right { width : calc(50% - 1.5rem);}";
rule += "  div.property-box {width: calc(50% - 0.75rem);}";
rule += '  div.property-box[class*="full"] {width: 100%;}';

rule += '  ul.cw-accordion-header[class*="half"] ' + halfSize;
rule += "  ul.cw-accordion-header " + fullSize;
rule += "  .property-box-asso  ul.cw-accordion-header {width: 100%;}";
rule += "  div.layoutSearchDocumentCustom " + fullSize;
rule += "  div.layoutSearch " + fullSize;

rule += " div.cwLayoutGraph2D " + fullSize;
rule += '  div.cwLayoutGraph2D[id*="half"] ' + halfSize;
rule += '  div.CwPropertiesLayoutHelpText[id*="half"] ' + halfSize;
rule += '  table.cw-grid[class*="half"] ' + halfSize;
rule += "  div.cw-accordion-content div.cw-accordion-header {width: calc(100% - 16px);}";
rule += "  div.cwPropertiesTableContainer {width: calc(50% - 0.75rem - 2.5rem);}";
rule += " .cwLayoutTimelineExpertModeConfig div.cwPropertiesTableContainer {width: calc(100% - 2.5rem);}";
rule += "  .cw-dashboard-container {width: calc(50% - 3.5rem); min-width: 600px;}";
rule += "  .cw-list-wrapper " + halfSize;

rule += " .cw-jvectormap-from-list .cwLayoutList {width: calc(15% - 2.5rem);}";
rule += " .cw-jvectormap-from-list .cwLayoutList .cwLayoutList{  width: calc(100% - 2.5rem);}";
rule += " div.empty.k-grid div.property-box.property-box-asso { width: calc(100 % - 1rem); }";
rule += " div.empty.k-grid div.cw-list-wrapper { width: calc(100 % - 1rem); }";

rule += " .cw-gantt-roadmap-lifecycle { width: 100%; }";
rule += " .cwRadarWrapper " + halfSize;

// Load the rules and execute after the DOM loads
window.onload = function () {
  var a = setInterval(function () {
    if (!document.body) return;
    clearInterval(a);
    if (window.getComputedStyle(document.body).backgroundColor != "rgb(255, 255, 255)") {
      console.log("Enable Next Gen Style");
      addCss(rule);
    }
  }, 1000);
};
