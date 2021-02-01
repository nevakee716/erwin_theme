/* Copyright � 2012-2017 erwin, Inc. - All rights reserved */

/*global cwAPI, jQuery*/
(function (cwApi, $) {
  "use strict";
  cwApi.cwLayouts.CwLayout.prototype.drawAssociations = function (output, associationTitleText, object) {
    /*jslint unparam:true*/
    var i, child, associationTargetNode, objectId;

    if (cwApi.isUndefinedOrNull(object) || cwApi.isUndefined(object.associations)) {
      // Is a creation page therefore a real object does not exist
      if (!cwApi.isUndefined(this.mmNode.AssociationsTargetObjectTypes[this.nodeID])) {
        objectId = 0;
        associationTargetNode = this.mmNode.AssociationsTargetObjectTypes[this.nodeID];
      } else {
        return;
      }
    } else {
      if (!cwApi.isUndefined(object.associations[this.nodeID])) {
        objectId = object.object_id;
        associationTargetNode = object.associations[this.nodeID];
      } else {
        if (object.iAssociations !== undefined && object.iAssociations[this.nodeID] !== undefined) {
          objectId = object.object_id;
          associationTargetNode = object.iAssociations[this.nodeID];
        } else {
          return;
        }
      }
    }
    if (this.options && this.options.CustomOptions && this.options.CustomOptions["display-title"] === true && associationTargetNode.length > 0) {
      output.push("<div class='cw-list-wrapper'>");
      output.push('<h5 class="cw-list-title">', this.mmNode.NodeName, "</h5>");
    }
    output.push(
      "<ul id='cw-layout-",
      this.layoutId,
      "' class='cw-list ",
      this.nodeID,
      " ",
      this.nodeID,
      "-",
      objectId,
      " ",
      this.LayoutName,
      " ",
      this.mmNode.LayoutDrawOne,
      " ot-",
      this.mmNode.ObjectTypeScriptName.toLowerCase()
    );
    if (associationTargetNode.length > 0 || cwApi.queryObject.isEditMode()) {
      output.push(" cw-visible ");
    }
    output.push("' data-association-key=" + this.nodeID + ">");

    if (this.isUsingDirective()) {
      this.associationTargetNode = associationTargetNode;
      // create a hidden li so the ul don't get delete by the display manager
      output.push("<li style='display:none;'></li>");
    } else {
      for (i = 0; i < associationTargetNode.length; i += 1) {
        child = associationTargetNode[i];
        this.drawOneMethod(output, child);
      }
    }
    output.push("</ul>");

    if (this.options && this.options.CustomOptions && this.options.CustomOptions["display-title"] === true && associationTargetNode.length > 0) {
      output.push("</div>");
    }
  };
})(cwAPI, jQuery);
