/* Copyright © 2012-2017 erwin, Inc. - All rights reserved */
/*global cwAPI */
(function (cwApi) {
  "use strict";

  cwApi.cwPropertiesLayouts.CwPropertiesLayout.prototype.outputHeader = function (output, mainObject) {
    var isVisible, defaultHeading, heading;

    defaultHeading = cwApi.mapToTranslation(this.propertyGroup.name);
    heading = this.getCustomDisplayStringValue(mainObject, defaultHeading);

    if (cwApi.isNull(mainObject)) {
      isVisible = true;
    } else {
      isVisible = this.isVisible(mainObject);
    }

    if (this.propertyGroup.DisplayFullWidth === true) {
      output.push(
        '<div style="max-width: 100%" id="',
        this.getId(),
        'full" class="cwPropertiesTableContainer ',
        isVisible === true ? "cw-visible" : "cw-hidden",
        " ",
        this.customClass,
        '"><div class="cwPropertiesTableHeader ',
        this.customClass,
        'Header">',
        heading,
        "</div>"
      );
    } else {
      output.push(
        '<div id="',
        this.getId(),
        '" class="cwPropertiesTableContainer ',
        isVisible === true ? "cw-visible" : "cw-hidden",
        " ",
        this.customClass,
        '"><div class="cwPropertiesTableHeader ',
        this.customClass,
        'Header">',
        heading,
        "</div>"
      );
    }

    output.push('<table class="cwPropertiesTable">');
  };
})(cwAPI);
