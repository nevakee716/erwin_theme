/* Copyright � 2012-2017 erwin, Inc. - All rights reserved */

/*global  cwBehaviours, $, cwAPI, jvm*/

(function (cwApi, jvm) {
  "use strict";

  var that, registerMap, reloadMap, loadMap, goToPage, setTooltip, MAX_REGION_COLOR;

  MAX_REGION_COLOR = "#004488";

  cwBehaviours.cwJVectorMap = (function () {
    that = {};
    that.maps = {};
    that.pieChartData = {};

    function getAppCostByOrgPieData(sourceItems) {
      var pieData, supportCosts, objectTypeScriptName, i, app;

      pieData = [];
      supportCosts = {};
      objectTypeScriptName = "apm_application";

      for (i = 0; i < sourceItems.length; i += 1) {
        app = sourceItems[i];
        cwApi.cwPropertyRegexp.browsePropertiesWhichMatches("<select:cost_yearly*>", objectTypeScriptName, function (pScriptName) {
          var p, supportCost;
          p = cwApi.mm.getProperty(objectTypeScriptName, pScriptName);
          if (cwApi.isUndefined(supportCosts[p.name])) {
            supportCosts[p.name] = 0;
          }
          supportCost = parseInt(app.properties[pScriptName], 10);
          if (!cwApi.isNaN(supportCost)) {
            supportCosts[p.name] += supportCost;
          }
        });
      }

      $.each(supportCosts, function (orgName, value) {
        if (value === 0) {
          return;
        }
        pieData.push({
          category: orgName,
          value: value,
        });
      });
      return pieData;
    }

    function setHeight(chart) {
      //var $pageContent = $('.page-content');

      //var topBarHeight = parseInt($('.wrap').css('margin-top'));

      //var pageTopPadding = parseInt($pageContent.css('padding-top'));

      //var pageBottomPadding = parseInt($pageContent.css('padding-bottom'));

      //var height = $(window).height() - (topBarHeight + pageTopPadding + pageBottomPadding);

      var height = cwApi.getFullScreenHeight();

      chart.$mDiv.css("height", height);
    }

    function getChart(parentId, properties) {
      var chart;
      chart = {};
      chart.ID = "cw-jvectormap-id-" + parentId;
      chart.$mDiv = $('<div class="cw-jvector-map" id="' + chart.ID + '"></div>');

      setHeight(chart);

      if (properties.PageType === 0) {
        if (properties.ParentNodeID === null) {
          switch (properties.LayoutName) {
            case "list":
              chart.parentDiv = $("ul." + parentId).parent();
              break;
            case "empty":
              chart.parentDiv = $("div." + parentId).parent();
              break;
            default:
              break;
          }
        } else {
          switch (properties.LayoutName) {
            case "list":
              chart.parentDiv = $("ul." + parentId).parent();
              break;
            case "empty":
              chart.parentDiv = $("." + parentId).parent();
              break;
            case "list-box":
              chart.parentDiv = $("div." + properties.NodeID);
              break;
            default:
              break;
          }
        }
      } else {
        // single page
        switch (properties.LayoutName) {
          case "list":
            chart.parentDiv = $("li." + properties.NodeID)
              .parent()
              .parent();
            break;
          case "empty":
            chart.parentDiv = $("div." + properties.NodeID);
            break;
          case "list-box":
            chart.parentDiv = $("li." + properties.NodeID + "-value");
            break;
          default:
            break;
        }
      }
      chart.parentDiv.addClass("cw-jvectormap-from-" + properties.LayoutName);

      chart.parentDiv.append(chart.$mDiv);
      var height = cwApi.getFullScreenHeight();
      chart.parentDiv.css("height", height);

      chart.container = $("#" + chart.ID);
      return chart;
    }

    function getData(content) {
      var itemsMapping,
        markersMapping,
        regionsValues,
        markersValues,
        items,
        markers,
        item,
        i,
        name,
        isocode,
        latlng,
        latlngArray,
        m,
        res,
        numberOfAssociations,
        targetItems,
        pieData,
        j,
        locChildren,
        sum;

      itemsMapping = {};
      markersMapping = {};
      regionsValues = [];
      markersValues = [];
      items = {};
      markers = [];

      function sumTheValue(memo, item) {
        return memo + item.value;
      }

      for (i = 0; i < content.length; i += 1) {
        item = content[i];
        name = cwApi.cwSearchEngine.removeSearchEngineZone(item.name);
        isocode = cwApi.cwSearchEngine.removeSearchEngineZone(item.properties[that.IsoCodeProperty]);
        isocode = isocode.toUpperCase();
        targetItems = [];
        pieData = [];
        if (that.mainObjectTypeScriptName === "apm_location") {
          targetItems = targetItems.concat(item.associations.applications);
          if (item.properties.type_abbreviation === "CO") {
            for (j = 0; j < item.associations.location_children.length; j += 1) {
              locChildren = item.associations.location_children[j];
              $.each(locChildren.associations.applications, function (k, app) {
                targetItems.push(app);
              });
            }
          }
          pieData = getAppCostByOrgPieData(targetItems);
        }

        sum = pieData.reduce(sumTheValue, 0);
        that.pieChartData[item.object_id] = {
          pieData: pieData,
          sum: sum,
        };

        numberOfAssociations = 0;
        if (!cwApi.isUndefined(item.associations.applications)) {
          numberOfAssociations = item.associations.applications.length;
        }

        if (isocode !== "") {
          items[isocode] = sum;
          itemsMapping[isocode] = item;
        }

        regionsValues.push(numberOfAssociations);

        latlng = cwApi.cwSearchEngine.removeSearchEngineZone(item.properties[that.LatLngProperty]);
        if (latlng !== "") {
          latlngArray = latlng.split(",");
          m = {
            latLng: [parseFloat(latlngArray[0]), parseFloat(latlngArray[1])],
            name: name,
            code: name,
          };
          markersMapping[markers.length] = item;
          markers.push(m.latLng);
          markersValues.push(sum);
        }
      }

      res = {};
      res.regions = items;
      res.markers = markers;
      res.regionsMapping = itemsMapping;
      res.markersMapping = markersMapping;
      res.regionsValues = regionsValues;
      res.markersValues = markersValues;
      return res;
    }

    reloadMap = function (id) {
      var chart = that.maps[id];
      chart.map.setSize();
    };

    loadMap = function (nodeId, content, properties, initialMap) {
      var chart, data, map;
      chart = getChart(nodeId, properties);
      data = getData(content);
      that.data = data;
      cwApi.CwCharts.cwChartHelper.pushChartContextAndGetChartWidth(chart.parentDiv, ".cw-jvector-map");
      map = new jvm.WorldMap({
        container: chart.$mDiv,
        map: initialMap,
        regionsSelectable: false,
        backgroundColor: "transparent",
        zoomMax: 60,
        markerStyle: {
          initial: {
            fill: "#AAAAAA",
          },
          selected: {
            fill: "#004488",
          },
        },
        regionStyle: {
          initial: {
            fill: "#DDDDDD",
          },
          selected: {
            fill: MAX_REGION_COLOR,
          },
        },
        series: {
          regions: [
            {
              attribute: "fill",
              scale: ["#66A8FE", "#004488"],
              values: data.regions,
              min: jvm.min(data.regionsValues),
              max: jvm.max(data.regionsValues),
            },
          ],
          markers: [
            {
              attribute: "fill",
              scale: ["#FFFFFF", "#004488"],
              values: data.markersValues,
              min: jvm.min(data.markersValues),
              max: jvm.max(data.markersValues),
            },
            {
              attribute: "r",
              scale: [5, 12],
              values: data.markersValues,
              min: jvm.min(data.markersValues),
              max: jvm.max(data.markersValues),
            },
          ],
        },
        onRegionClick: function (e, code) {
          var item = data.regionsMapping[code];
          goToPage(item);
          return e;
        },
        onMarkerClick: function (e, code) {
          var item = data.markersMapping[code];
          goToPage(item);
          return e;
        },
        markers: data.markers,
        onRegionLabelShow: function (e, label, code) {
          var item = data.regionsMapping[code];
          setTooltip(label, item);
          return e;
        },
        onMarkerLabelShow: function (e, label, code) {
          var item = data.markersMapping[code];
          setTooltip(label, item);
          return e;
        },
      });
      cwApi.CwCharts.cwChartHelper.popChartContext(chart.parentDiv, ".cw-jvector-map");
      chart.map = map;
      that.maps[chart.ID] = chart;
      $(chart.container)
        .find('path[fill="' + MAX_REGION_COLOR + '"]')
        .attr("cw-selected-zone", true);

      setTimeout(function () {
        chart.map.setSize();
      }, 200); // Wait for menu to disappear then reset the size.
    };

    setTooltip = function (label, item) {
      var o, pieInfo, pieData, sum, legends;
      if (cwApi.isUndefined(item)) {
        return;
      }
      o = [];
      pieInfo = that.pieChartData[item.object_id];
      pieData = pieInfo.pieData;
      sum = pieInfo.sum;
      legends = {};

      o.push(item.name, "</br>");
      if (sum > 0) {
        legends.valueUnit = "$";
        legends.title = "Yearly Support Cost (" + sum + legends.valueUnit + ")";
        legends.id = Math.floor(Math.random() * 1e5);
        o.push('<div class="cw-apm-tooltip-chart" id="cw-chart-', legends.id, '"></div>');
      }
      label.html(o.join(""));
      if (sum > 0) {
        cwApi.cwReporting.cwKendoUIPieChart.createChart(legends, pieData);
      }
    };

    goToPage = function (item) {
      if (!cwApi.isUndefined(item)) {
        var hash;
        hash = cwApi.getSingleViewHash(that.mainObjectTypeScriptName, item.object_id);
        $(".jvectormap-label").remove();
        cwApi.updateURLHash(hash);
      }
    };

    registerMap = function (properties, allItems) {
      var initialMap, items, itemsAssociations, i, item, nodeId, $container;
      nodeId = properties.NodeID;

      if (cwApi.queryObject.isEditMode() || cwApi.isNull(allItems)) {
        $container = $("div." + nodeId);
        cwApi.cwDisplayManager.setNoDataAvailableHtml($container);
        return;
      }

      if (cwApi.queryObject.isEditMode()) {
        return;
      }
      if (cwApi.isUndefined(allItems)) {
        return;
      }

      initialMap = properties.Behaviour.Options["zoom-on-map"];
      that.mainObjectTypeScriptName = properties.ObjectTypeScriptName;
      that.LatLngProperty = properties.Behaviour.Options["latlng-pt"].toLowerCase();
      that.IsoCodeProperty = properties.Behaviour.Options["isocode-pt"].toLowerCase();

      if (properties.PageType === 0) {
        items = allItems[properties.NodeID];
        if (cwApi.isUndefined(items) && properties.ParentNodeID !== null) {
          itemsAssociations = allItems[properties.ParentNodeID];
          for (i = 0; i < itemsAssociations.length; i += 1) {
            item = itemsAssociations[i];
            that.OriginalNodeID = nodeId;
            that.NodeID = properties.NodeID + "-" + item.object_id;
            loadMap(that.NodeID, item.associations[nodeId], properties, initialMap);
          }
        } else {
          loadMap(properties.NodeID, items, properties, initialMap);
        }
      } else {
        items = allItems.associations[properties.NodeID];
        loadMap(properties.NodeID, items, properties, initialMap);
      }
    };
    return {
      reloadMap: reloadMap,
      setup: registerMap,
    };
  })();
})(cwAPI, jvm);
