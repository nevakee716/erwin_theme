/* Copyright © 2012-2017 erwin, Inc. - All rights reserved */
/*global cwAPI, jQuery */

(function (cwApi, $) {
  "use strict";

  function mapValue(property, item) {
    var value;
    value = item.properties[property.scriptName];
    if (property.type === "Lookup") {
      value = parseInt(item.properties[property.scriptName + "_abbreviation"], 10);
      if (isNaN(value)) {
        value = 0;
      }
    }
    return value;
  }

  function mapValueUsingScriptName(pScriptname, item) {
    var property = cwApi.mm.getProperty(item.objectTypeScriptName, pScriptname);
    return mapValue(property, item);
  }

  var CwPropertiesLayoutRadar = function (propertyGroup) {
    cwApi.extend(this, cwApi.cwPropertiesLayouts.CwPropertiesLayout, propertyGroup);
    this.noData = false;
    this.init(propertyGroup);
    cwApi.registerLayoutForJSActions(this);
  };

  CwPropertiesLayoutRadar.prototype.getChartData = function () {
    var i,
      propertyScriptName,
      label,
      data = [],
      property,
      chartData = {
        categories: [],
      };
    for (i = 0; i < this.propertyGroup.properties.length; i += 1) {
      propertyScriptName = this.propertyGroup.properties[i];
      property = cwApi.mm.getProperty(this.mainObject.objectTypeScriptName, propertyScriptName);
      label = property.name;
      data.push(mapValue(property, this.mainObject));
      chartData.categories.push(label);
    }
    chartData.series = [
      {
        data: data,
        name: this.title,
      },
    ];
    return chartData;
  };

  CwPropertiesLayoutRadar.prototype.applyJavaScript = function () {
    var chart;
    if (this.noData === false && !cwApi.isUndefinedOrNull(this.mainObject)) {
      chart = new cwApi.CwCharts.CwRadarChart(this.getId());
      chart.title = this.chartData.title;
      chart.createChart(this.chartData);
    }
  };

  CwPropertiesLayoutRadar.prototype.init = function () {
    this.customClass = "CwPropertiesLayoutRadar";
    this.displayHeaderInTheTable = false;
  };

  CwPropertiesLayoutRadar.prototype.outputTable = function (output, mainObject) {
    var defaultHeading, heading;

    if (!cwApi.isNull(mainObject)) {
      this.mainObject = mainObject;
      this.chartData = this.getChartData();
      if (
        this.chartData.series[0].data.reduce(function (a, b) {
          return a + b;
        }) === 0
      ) {
        output.push($.i18n.prop("chart_noDataAvailable"));
        this.noData = true;
      } else {
        defaultHeading = cwApi.mapToTranslation(this.propertyGroup.name) + " (" + this.mainObject.name + ")";
        this.title = this.getCustomDisplayStringValue(mainObject, defaultHeading);
        output.push("<div class='cwRadarWrapper'>");
        output.push('<div class="cwPropertiesTableHeader CwPropertiesLayoutGaugeHeader">', this.title, "</div>");
        output.push('<div class="cw-list cw-visible cw-radar-chart ', this.getId(), '">');
        output.push("</div>");
        output.push("</div>");
      }
    } else if (cwApi.queryObject.isCreatePage()) {
      output.push('<div id="', this.getId(), '" class="cw-dashboard-container cw-list cw-visible cw-radar-chart is-on-create-page">');
      output.push('<div class="cwPropertiesTableHeader">', cwApi.mapToTranslation(this.propertyGroup.name), "</div>");
      output.push("<p>" + $.i18n.prop("edit_thisIsNotAvailableForEdit") + "</p>");
      output.push("</div>");
    }
  };

  cwApi.cwPropertiesLayouts.CwPropertiesLayoutRadar = CwPropertiesLayoutRadar;
  cwApi.cwPropertiesLayouts.CwPropertiesLayoutRadarHelper = {
    mapValue: mapValue,
    mapValueUsingScriptName: mapValueUsingScriptName,
  };
})(cwAPI, jQuery);
