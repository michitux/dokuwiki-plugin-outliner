<?php
/**
 * Outliner Plugin
 *
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author     Pavel Vitis <pavel [dot] vitis [at] seznam [dot] cz>
 */

if(!defined('DOKU_INC')) define('DOKU_INC',realpath(dirname(__FILE__).'/../../').'/');
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once(DOKU_PLUGIN.'syntax.php');
require_once(realpath(dirname(__FILE__).'/../outliner.php'));

global $outline_num;
global $outline_ids;
if (!isset($outline_num)) {
  $outline_num = 0;
}
if (!isset($outline_ids)) {
  $outline_ids = array();
}

/**
 * All DokuWiki plugins to extend the parser/rendering mechanism
 * need to inherit from this class
 */
class syntax_plugin_outliner_start extends DokuWiki_Syntax_Plugin {

    /**
     * return some info
     */
    function getInfo(){
        return array(
            'author' => 'Pavel Vitis',
            'email'  => 'pavel.vitis@seznam.cz',
            'date'   => '2005-08-19',
            'name'   => 'Outliner Plugin',
            'desc'   => 'Allows collapsible outline layout',
            'url'    => 'http://blackdaemon.no-ip.org/dokuwiki:plugin:outliner',
        );
    }

    /**
     * What kind of syntax are we?
     */
    function getType(){
        return 'substition';
    }

    function getPType(){
        return 'block';
    }

    /**
     * Where to sort in?
     */
    function getSort(){
        return 0;
    }

    /**
     * Connect pattern to lexer
     */
    function connectTo($mode) {
      $this->Lexer->addSpecialPattern(
          /* pattern is: newline,optional spaces,-->,A-Za-z0-9-_ ,optional ^ */
          /* ending pattern is: newline,<--- */
          '\n[ \t]*-->[^\n]*\n(?=.*\n[ \t]*\x3C--)',
          $mode,
          'plugin_outliner_start');
    }

    /**
     * Handle the match
     */
    function handle($match, $state, $pos, &$handler){
        global $outline_num;
        global $outline_ids;
        global $ID;
	define(FLAGS, '\^#');

        $outline_id = ''.md5($ID).'_'.mt_rand(100000,999999);
        array_push($outline_ids, $outline_id);
        $outline_num++;

	// Trim <--
        $match = substr(trim($match),3);
	// Get flags on the end of line
	ereg('(^[^'.FLAGS.']*)(['.FLAGS.' ]*)$', $match, $flags);
	// Strip flags from title
	$match = $flags[1];
	// Test if '^ - opened node' flag is present
	$opened = (strrpos($flags[2], '^') !== FALSE);
//	echo "opened: ".$opened."<br>";
	// Test if '# - no popup' flag is present
	$nopopup = (strrpos($flags[2], '#') !== FALSE);
//	echo "nopopup: ".$nopopup."<br>";
        return array($match, $state, $outline_id, $opened, $nopopup);
    }

    /**
     * Create output
     */
    function render($mode, &$renderer, $data) {
      if ($mode == 'xhtml') {
          $renderer->doc .= "".outlinerStart($data[2], $data[0], $data[3], $data[4]);
          return true;
      }
      return false;
    }
}

//Setup VIM: ex: et ts=4 enc=utf-8 :
