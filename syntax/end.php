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
class syntax_plugin_outliner_end extends DokuWiki_Syntax_Plugin {

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
        return 11;
    }

    /**
     * Connect pattern to lexer
     */
    function connectTo($mode) {
      $this->Lexer->addSpecialPattern("\n[\s]*\x3c\-\-[^\n]*\n{0,1}",$mode,'plugin_outliner_end');
    }

    /**
     * Handle the match
     */
    function handle($match, $state, $pos, &$handler){
      global $outline_ids;

      $outline_id = array_pop($outline_ids);
      if (FALSE !== $outline_id) {
        return array($match, $state, $outline_id);
      }
      else {
        return false;
      }	
    }

    /**
     * Create output
     */
    function render($mode, &$renderer, $data) {
      if($mode == 'xhtml'){
          if (isset($data[2])) {
            $renderer->doc .= outlinerEnd($data[2], "");
	  }
          return true;
      }
      return false;
    }
}

//Setup VIM: ex: et ts=4 enc=utf-8 :
