/**
 * Outliner plugin JS library
 *
 * @author Michael Hamann <michael [at] content-space [dot] de>
 */


jQuery(function () {
    var $outliner_dls = jQuery('dl.outliner');
	
    var setState = function(node, state) {
		if (state != 'open' && state != 'closed') { return; }
		var otherState = (state == 'open') ? 'closed' : 'open';
	    jQuery(node).removeClass('outliner-' + otherState).addClass('outliner-' + state);
	    var nodeId = getOutlinerId(node);
	    if (nodeId) {
			try {
				localStorage.setItem(nodeId,state);
			} catch (e){
				console.error("something went wrong when trying to access local storage : {",e,"}");
			}
		}
    };

    var getOutlinerId = function(node) {
        var match = node.className.match(/outl_\w+/);
        if (match) {
            return match[0];
        } else {
            return null;
        }
    };

    $outliner_dls
        .addClass('outliner-js')
        .find('dt')
            .click(function() {
                if (jQuery(this.parentNode).hasClass('outliner-open')) {
                    setState(this.parentNode, 'closed');
                } else {
                    setState(this.parentNode, 'open');
                }
            })
            .mouseover(function() {
                var thisPos = jQuery(this).position();
                jQuery(this).siblings('dd').css({'left': thisPos.left + 40 + 'px', 'top': thisPos.top + 20 + 'px'});
            });
    $outliner_dls
        .each(function() {
            var id = getOutlinerId(this);
            if (id) {
					try {
						setState(this, localStorage.getItem(id));
					} catch (e){
						console.error("Something went wrong when trying to access local storage : {",e,"}");
						setState(this, "closed");
					}
            }
        })
        .filter(':not(.outliner-open,.outliner-closed)').each(function() {
            setState(this, 'closed');
        });

});
