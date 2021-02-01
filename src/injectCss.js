function addCss(rule) {
  let css = document.createElement("style");
  css.type = "text/css";
  if (css.styleSheet) css.styleSheet.cssText = rule;
  // Support for IE
  else css.appendChild(document.createTextNode(rule)); // Support for the rest
  document.getElementsByTagName("head")[0].appendChild(css);
}

// CSS rules

//list box title
let rule = "div.cw-property-details-right {width : calc(50% - 1.5rem)}";
rule += "  div.property-box { width: calc(50% - 0.75rem); min-width: 600px;}";
rule += "  div.property-box { width: calc(50% - 0.75rem); min-width: 600px;}";
rule += '  div.CwPropertiesLayoutHelpText[id*="half"] {width: calc(50% - 0.75rem); min-width: 600px;}';
rule += '  table.cw-grid[class*="half"] {width: calc(50% - 0.75rem); min-width: 600px;}';
rule += "  div.cw-accordion-content div.cw-accordion-header {width: calc(100% - 16px);}";
rule += "  div.cwPropertiesTableContainer {width: calc(50% - 3.25rem);}";
rule += "  div.empty {width: calc(50% - 3.25rem); min-width: 600px;}";

// Load the rules and execute after the DOM loads
window.onload = function () {
  addCss(rule);
};
