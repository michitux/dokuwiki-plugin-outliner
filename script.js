/**
 * Outliner plugin JS library
 *
 * @author Michael Hamann <michael [at] content-space [dot] de>
 */
function isStorageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
};

jQuery(function () {
    var $outliner_dls = jQuery('dl.outliner');

	var $StorageAvailable = isStorageAvailable('localStorage');
	if ($StorageAvailable != true) {
		console.warn("localStorage seem to be not available. no open/close state store: {",$StorageAvailable,"}");
	}
    var setState = function(node, state) {
		if (state != 'open' && state != 'closed') { return; }
		var otherState = (state == 'open') ? 'closed' : 'open';
	    jQuery(node).removeClass('outliner-' + otherState).addClass('outliner-' + state);
	    var nodeId = getOutlinerId(node);
	    if (nodeId) {
			if ( $StorageAvailable) {
				try {
					localStorage.setItem(nodeId,state);
				} catch (e){
					console.error("something went wrong when trying to access local storage : {",e,"}");
				}
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
				if ($StorageAvailable) {
					try {
						setState(this, localStorage.getItem(id));
					} catch (e){
						console.error("Something went wrong when trying to access local storage : {",e,"}");
					}
				} else {
					setState(this, "closed");
				}
            }
        })
        .filter(':not(.outliner-open,.outliner-closed)').each(function() {
            setState(this, 'closed');
        });

});
