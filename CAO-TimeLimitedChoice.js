/*=============================================================================
  CAO-TimeLimitedChoice.js - v1.0.3
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
 * @url https://raw.githubusercontent.com/cacao-soft/RMMZ/main/CAO-TimeLimitedChoice.js
 * @plugindesc v1.0.2 時間制限のある選択肢を作れるようにします。
 *
 * @help
 * == 使用方法 ==
 *
 *  1. イベントコマンドでタイマーを起動
 *  2. プラグインコマンドで時間切れ動作の指定
 *  3. イベントコマンドで選択肢を表示
 *
 * == プラグインコマンド ==
 *
 *  [時間切れ動作 スキップ]
 *    選択肢の分岐を飛ばして次のコマンドを実行する
 *
 *  [時間切れ動作 決定]
 *    現在選択中の項目の選択肢を実行する
 *
 *  [時間切れ動作 キャンセル]
 *    キャンセル時に実行される選択肢を実行する
 *
 *  [時間切れ動作 指定]
 *    指定された番号(1-6)の選択肢を実行する
 *
 *
 * @param TimeoutSwitchID
 * @text 時間切れスイッチ
 * @desc
 *  時間切れ時にONにするスイッチ
 *  選択肢の表示を行なうと OFF になる
 * @type switch
 * @default 0
 *
 * @param TimeleftVariableID
 * @text 残り時間変数
 * @desc
 *  残り時間を取得する変数
 * @type variable
 * @default 0
 *
 * @param TimeleftType
 * @text 残り時間タイプ
 * @desc
 *  残り時間の取得方法を設定する
 *  この値が残り時間変数に代入される
 * @type select
 * @option 秒数
 * @option フレーム数
 * @default フレーム数
 *
 *
 * @command T_SKIP
 * @text 時間切れ動作 [スキップ]
 * @desc 時間切れ時に選択肢を飛ばして次のコマンドを実行する
 *
 * @command T_OK
 * @text 時間切れ動作 [決定]
 * @desc 時間切れ時に現在選択中の項目の選択肢を実行する
 *
 * @command T_CANCEL
 * @text 時間切れ動作 [キャンセル]
 * @desc 時間切れ時にキャンセル時の選択肢を実行する
 *
 * @command T_INDEX
 * @text 時間切れ動作 [指定]
 * @desc 時間切れ時に指定された選択肢を実行する
 * @arg index
 * @text 選択肢
 * @desc 選択肢の番号 (1-)
 * @type number
 * @min 1
 * @max 6
 */

;(() => {
    'use strict'

    const pluginName = document.currentScript.src.split('/').pop().split(/\.(?=[^.]+$)/)[0]
    const pluginParams = PluginManager.parameters(pluginName)

    PluginManager.registerCommand(pluginName, 'T_SKIP',
        args => { $gameMessage.setChoiceTimeoutType(99) })
    PluginManager.registerCommand(pluginName, 'T_OK',
        args => { $gameMessage.setChoiceTimeoutType(-1) })
    PluginManager.registerCommand(pluginName, 'T_CANCEL',
        args => { $gameMessage.setChoiceTimeoutType(-2) })
    PluginManager.registerCommand(pluginName, 'T_INDEX',
        args => { $gameMessage.setChoiceTimeoutType(args.index - 1) })

    function setTimeoutSwitch(value) {
        if (pluginParams.TimeoutSwitchID) {
            $gameSwitches.setValue(pluginParams.TimeoutSwitchID, value)
        }
    }

    const _Game_Message_clear = Game_Message.prototype.clear
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.apply(this, arguments)
        this.clearChoiceTimeoutType()
    }

    Game_Message.prototype.choiceTimeoutType = function() {
        return this._choiceTimeoutType
    }

    Game_Message.prototype.setChoiceTimeoutType = function(timeoutType) {
        this._choiceTimeoutType = timeoutType
    }

    Game_Message.prototype.clearChoiceTimeoutType = function() {
        this._choiceTimeoutType = 0
    }

    const _Game_Interpreter_setupChoices = Game_Interpreter.prototype.setupChoices
    Game_Interpreter.prototype.setupChoices = function(params) {
        _Game_Interpreter_setupChoices.apply(this, arguments)
        if ($gameTimer.frames() > 0) {
            setTimeoutSwitch(false)
        } else {
            $gameMessage.clearChoiceTimeoutType()
        }
    }

    const _Window_ChoiceList_close = Window_ChoiceList.prototype.close
    Window_ChoiceList.prototype.close = function() {
        _Window_ChoiceList_close.apply(this, arguments)
        if (pluginParams.TimeleftVariableID) {
            const value = $gameTimer[(pluginParams.TimeleftType === '秒数') ? 'seconds' : 'frames']()
            $gameVariables.setValue(pluginParams.TimeleftVariableID, value)
        }
    }

    const _Window_ChoiceList_update = Window_ChoiceList.prototype.update
    Window_ChoiceList.prototype.update = function() {
        _Window_ChoiceList_update.apply(this, arguments)
        this.checkTimeout()
    }

    Window_ChoiceList.prototype.isEnabledTimeout = function() {
      return $gameMessage.choiceTimeoutType() != 0
    }

    Window_ChoiceList.prototype.checkTimeout = function() {
        if (this.isEnabledTimeout() && $gameTimer.frames() === 0) {
            this.callTimeoutHandler()
            setTimeoutSwitch(true)
        }
    }
    
    Window_ChoiceList.prototype.callTimeoutHandler = function() {
        if (!this.isEnabledTimeout()) return
        if ($gameMessage.choiceTimeoutType() < 0) {
            if ($gameMessage.choiceTimeoutType() === -2) {
                this.callCancelHandler()
            } else {
                if (this.index() < 0) {
                    this._index = $gameMessage.choices().length
                }
                this.callOkHandler()
            }
        } else if ($gameMessage.choiceTimeoutType() > 0) {
            $gameMessage.onChoice($gameMessage.choiceTimeoutType())
            this._messageWindow.terminateMessage()
            this.close()
        }
        this.deactivate()
    }

})();
