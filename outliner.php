<?php
/**
 * Outliner plugin library
 *
 * @author Pavel Vitis <pavel [dot] vitis [at] seznam [dot] cz>
 */

function outlinerStart($id, $title, $opened = false, $noPopup = false) {
  return
    '<div class="wedge wedgeClosed" id="outliner_wedge_'.$id.'"'.
    '  onmouseover="outliner_toggleLine(\''.$id.'\', true);'.
    ($noPopup ? '' : 'outliner_showPopup(\''.$id.'\',this,event);').
    '"'.
    '  onmouseout="outliner_toggleLine(\''.$id.'\', false);'.
    ($noPopup ? '' : 'outliner_clearPopup(\''.$id.'\');').
    '"'.
    '  onclick="if (this.blur) this.blur();'.
    ($noPopup ? '' : 'outliner_clearPopup(\''.$id.'\');').
    'outliner_toggleLine(\''.$id.'\',outliner_switch(\''.$id.'\'));return false;"'.
    '>'.
    hsc($title).
    '</div>'.
    '<div id="outliner_div_'.$id.'" class="outline-block invisible unmarked'.($opened ? ' default-open' : '').'">'.
    '<table border="0" cellspacing="0" cellpadding="4"><tr>'.
    '<td style="width:4px;">&nbsp;</td>'.
    '<td class="outline-bar unmarked" id="outliner_bar_'.$id.'">'.
    '<span style="width:4px;">&nbsp;</span></td>'.
    '<td></td>'.
    '<td class="outline-content" id="outliner_content_'.$id.'">'.
    '';
}

function outlinerEnd($id) {
  return
    "</td></tr></table></div>".
    "<script type=\"text/javascript\">\n".
    "<!--\n".
    "  outliner_loadState(\"".$id."\");\n".
    "//-->\n".
    "</script>".
    "";
}
