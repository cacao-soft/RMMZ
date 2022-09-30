/*=============================================================================
  CAO-OpaqueHamburgerButton.js - v1.0.0
 -----------------------------------------------------------------------------
  Copyright (c) 2022 CACAO
  Released under the MIT License. see https://opensource.org/licenses/MIT
 -----------------------------------------------------------------------------
  [Twitter] https://twitter.com/cacao_soft/
  [GitHub]  https://github.com/cacao-soft/
=============================================================================*/

/*:
 * @target MZ
 * @author CACAO
 * @url https://raw.githubusercontent.com/cacao-soft/RMMZ/main/CAO-OpaqueHamburgerButton.js
 * @plugindesc v1.0.0 ハンバーガーボタンの不透明化
 *
 * @help
 * マップ右上に表示されているメニューを開くハンバーガーボタンを
 * 常時不透明にします。導入するだけで機能します。
 *
 * デフォルトのアイコンは画像自体が透過されているのでご注意ください。
 *
 */

;(() => {
    'use strict'

    const _Scene_Map_createMenuButton = Scene_Map.prototype.createMenuButton
    Scene_Map.prototype.createMenuButton = function() {
        _Scene_Map_createMenuButton.apply(this, arguments)
        this._menuButton.updateOpacity = function() { this.opacity = 255 }
    }

})();
