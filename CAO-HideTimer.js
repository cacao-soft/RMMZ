/*=============================================================================
  CAO-HideTimer.js - v1.0.0
 -----------------------------------------------------------------------------
  Copyright (c) 2022 CACAO
  Released under the MIT License.
  https://opensource.org/licenses/MIT
 -----------------------------------------------------------------------------
  [Twitter] https://twitter.com/cacao_soft/
  [GitHub]  https://github.com/cacao-soft/
=============================================================================*/

/*:
 * @target MZ
 * @author CACAO
 * @url https://raw.githubusercontent.com/cacao-soft/RMMZ/main/CAO-HideTimer.js
 * @plugindesc v1.0.0 タイマーを非表示にできるようにします
 *
 * @help
 * == 使用方法 ==
 *
 *  設定したスイッチを ON にすると非表示になります
 *
 *
 * @param HideSwitchID
 * @text タイマー非表示スイッチ
 * @desc ON にするとタイマーを非表示にします。
 * @type switch
 * @default 0
 */

;(() => {
    'use strict'

    const pluginName = document.currentScript.src.split('/').pop().split(/\.(?=[^.]+$)/)[0]
    const pluginParams = PluginManager.parameters(pluginName)

    function isVisibleTimer() {
        if (pluginParams.HideSwitchID) {
            return !$gameSwitches.value(pluginParams.HideSwitchID)
        }
        return true
    }

    const _Sprite_Timer_updateVisibility = Sprite_Timer.prototype.updateVisibility
    Sprite_Timer.prototype.updateVisibility = function() {
        _Sprite_Timer_updateVisibility.apply(this, arguments)
        this.visible = this.visible && isVisibleTimer()
    }

})();
