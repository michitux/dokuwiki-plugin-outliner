/**
 * Outliner plugin JS library
 *
 * @author Michael Hamann <michael [at] content-space [dot] de>
 */

addInitEvent(function () {
  var outliner_dls = getElementsByClass('outliner', document, 'dl');

  var setState = function(node, state) {
    if (state != 'open' && state != 'closed') return;
    var otherState = (state == 'open') ? 'closed' : 'open';
    if (node.className.indexOf('outliner-' + state) ==  -1 && node.className.indexOf('outliner-' + otherState) == -1) {
      node.className += ' outliner-' + state;
    } else {
      if (state == 'open') {
        node.className = node.className.replace(/outliner-closed/, 'outliner-' + state);
      } else {
        node.className = node.className.replace(/outliner-open/, 'outliner-' + state);
      }
    }
    var nodeId = getOutlinerId(node);
    if (nodeId.length) {
      DokuCookie.setValue(nodeId, state);
    }
  };

  var getOutlinerId = function(node) {
    return node.className.match(/outliner_\w+/)[0];
  };

  for (var i = 0; i < outliner_dls.length; i++) {
    outliner_dls[i].className += ' outliner-js';

    setState(outliner_dls[i], DokuCookie.getValue(getOutlinerId(outliner_dls[i])));
    if (outliner_dls[i].className.indexOf('outliner-open') ==  -1 && outliner_dls[i].className.indexOf('outliner-closed') == -1) {
      setState(outliner_dls[i], 'closed');
    }

    addEvent(outliner_dls[i].getElementsByTagName('dt')[0], 'click', function() {
      if (this.parentNode.className.indexOf('outliner-open') == -1) {
        setState(this.parentNode, 'open');
      } else {
        setState(this.parentNode, 'closed');
      }
    });
    addEvent(outliner_dls[i].getElementsByTagName('dt')[0], 'mouseover', function() {
      with (this.parentNode.getElementsByTagName('dd')[0]) {
        style.left = findPosX(this)+40 + 'px';
        style.top = findPosY(this)+20 + 'px';
      }
    });
  }
});
