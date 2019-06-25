<?php
/**
 * Main plugin file
 *
 * @package     Derweili\GutenIpsum
 * @author      Julian Weiland (@derweili)
 * @license     GPL2+
 *
 * @wordpress-plugin
 * Plugin Name: GutenIpsum
 * Plugin URI:  https://github.com/derweili/GutenIpsum
 * Description: Generate blind text in Gutenberg. Insert dummy text directly into Gutenberg as text paragraphs.
 * Version:     1.0.6
 * Author:      Derweili
 * Author URI:  https://derweili.de
 * Text Domain: gutenipsum
 * Domain Path: /languages
 * License:     GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

namespace Derweili\GutenIpsum;

//  Exit if accessed directly.
defined('ABSPATH') || exit;

/**
 * Gets this plugin's absolute directory path.
 *
 * @since  2.1.0
 * @ignore
 * @access private
 *
 * @return string
 */
function _get_plugin_directory() {
	return __DIR__;
}

/**
 * Gets this plugin's URL.
 *
 * @since  2.1.0
 * @ignore
 * @access private
 *
 * @return string
 */
function _get_plugin_url() {
	static $plugin_url;

	if ( empty( $plugin_url ) ) {
		$plugin_url = plugins_url( null, __FILE__ );
	}

	return $plugin_url;
}


// Enqueue JS and CSS
include __DIR__ . '/lib/register-scripts.php';



// Register block server side
// include __DIR__ . '/lib/register-blocks.php';

// Register block server side
// include __DIR__ . '/lib/block-categories.php';