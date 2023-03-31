/*=============================================================================
  CAO-CenterChoiceList.js - v1.0.0
 -----------------------------------------------------------------------------
  Copyright (c) 2023 CACAO
  Released under the MIT License. see https://opensource.org/licenses/MIT
 -----------------------------------------------------------------------------
  [Twitter] https://twitter.com/cacao_soft/
  [GitHub]  https://github.com/cacao-soft/
=============================================================================*/

/*:
 * @target MZ
 * @author CACAO
 * @url https://raw.githubusercontent.com/cacao-soft/RMMZ/main/CAO-CenterChoiceList.js
 * @plugindesc v1.0.0 選択肢のみの場合は画面中央に表示する
 */

;(() => {
    'use strict'

    const _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement
    Window_ChoiceList.prototype.updatePlacement = function() {
        _Window_ChoiceList_updatePlacement.apply(this, arguments)
        if (!this._messageWindow.isOpen()) {
            this.x = (Graphics.width - this.windowWidth()) / 2
            this.y = (Graphics.height - this.windowHeight()) / 2
        }
    }

})();
