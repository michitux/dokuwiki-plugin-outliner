/**
 * Outliner plugin JS library
 *
 * @author Pavel Vitis <pavel [dot] vitis [at] seznam [dot] cz>
 */

function setStableCookie(name, value) {
    var expire = new Date();
    fixDate(expire);
    expire.setTime(expire.getTime()+365*24*60*60*1000);
    setCookie(name, value, expire);
}

function outliner_writeLayer(layerID, txt) {
    try {
	if (document.getElementById) {
    	    var layer = document.getElementById(layerID);
            if (layer) {
	      layer.innerHTML = txt;
	    }
        }
	else {
            if (document.all) {
		document.all[layerID].innerHTML = txt;
	    }
	    else {
		if (document.layers) {
                    var layer_content = document.layers[layerID].document;
                    layer_content.open();
                    layer_content.open();
                    layer_content.write(txt);
                    layer_content.close();
		}
	    }
	}
   }
   catch (e) {}
}

function outliner_isOpen(div) {
  if (typeof(div) == 'string') {
    div = document.getElementById('outliner_div_'+div);
  }
  try {
    return (div.className.indexOf(' visible') != -1);
  } catch (e) {
    div.visible = 0;
    return false;
  }
}

function outliner_openByDefault(div) {
  if (typeof(div) == 'string') {
    div = document.getElementById('outliner_div_'+div);
  }
  try {
    return (div.className.indexOf('default-open') != -1);
  } catch (e) {
    return false;
  }
}

function outliner_switch(out, show) {
  if (!document.getElementById) {
    return NULL;
  }

  var div = document.getElementById("outliner_div_"+out);
  var link = document.getElementById("outliner_wedge_"+out);
  if (typeof(show) == 'undefined') {
    show = !outliner_isOpen(out);
  }
  else {
    if ((show === false) && !outliner_isOpen(out)) {
      return false;
    }
  }

  if (show) {
//    alert(div.style.border);
    link.className = link.className.replace(/ wedgeClosed/gi, ' wedgeOpen');
    div.className = div.className.replace(/ invisible/gi, ' visible');
//	  div.style.height = 1;
    div.visible = 1;
    setStableCookie('outlineState_'+out, 'opened');
    return true;
  }
  else {
    link.className = link.className.replace(/ wedgeOpen/gi, ' wedgeClosed');
    div.className = div.className.replace(/ visible/gi, ' invisible');
    div.height = 0;
    div.visible = 0;
    setStableCookie('outlineState_'+out, 'collapsed');
    return false;
  }
}

function outliner_toggleLine(out, show) {
  if (!document.getElementById) {
    return;
  }
  var div = document.getElementById("outliner_div_"+out);
  if (outliner_isOpen(out)) {
    var bar = document.getElementById("outliner_bar_"+out);
    if (show) {
//    alert(div.style.border);
	div.className = div.className.replace(/ unmarked/gi, ' marked');
	bar.className = bar.className.replace(/ unmarked/gi, ' marked');
    }
    else {
	div.className = div.className.replace(/ marked/gi, ' unmarked');
	bar.className = bar.className.replace(/ marked/gi, ' unmarked');
    }
  }
}

function outliner_loadState(out) {
  var state = getCookie('outlineState_'+out);
//  alert(state);
//  alert(out);
  var show;
  if ((null == state) && outliner_openByDefault(out)) {
    show = true;
  }
  else {
    show = (state == 'opened');
  }
  outliner_switch(out, show);
}

function outliner_setPopup(out, e, evt) {
  var div = document.getElementById("outliner_div_"+out);
  if (!outliner_isOpen(out)) {
    var content = new String(document.getElementById('outliner_content_'+out).innerHTML);
    content = content.replace(/<div class=\"secedit\">.*?<\/div>/gi, '');
    var popup = document.getElementById("outliner_popup_"+out);
    if (document.getElementById("outliner_popup_"+out)) {
	outliner_writeLayer('outliner_popup_'+out, content);
    }

    domTT_activate(
      e,
      evt,
      'content', content,
      'type', 'velcro',
      'fade', 'out',
      'offsetX', 0, 'offsetY', 5,
//    'clearMouse', true,
//    'trail', true,
      'lazy', false,
      'id', 'outliner_popup_'+out,
      'styleClass', 'floating',
      'maxWidth', (document.body.offsetWidth*0.8));

//    popup.style.display = 'block';
//    popup.style.left = document.mouseX + 0;
//    popup.style.top = document.mouseY + 10;
//    divopup.className = 'outline floating';
  }
  clearTimeout();
}

var outliner_tmid = null;

function outliner_showPopup(out, e, evt) {
  outliner_setPopup(out, e, evt);
}

function outliner_clearPopup(out) {
  if (null !== outliner_tmid) {
    clearTimeout(outliner_tmid);
    outliner_tmid = null;
  }
  var popup = document.getElementById('outliner_popup_'+out);
  outliner_writeLayer('outliner_popup_'+out, '');
  domTT_close('outliner_popup_'+out);
}
