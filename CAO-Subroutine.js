/*=============================================================================
  CAO-Subroutine.js - v1.0.0
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
 * @url https://raw.githubusercontent.com/cacao-soft/RMMZ/main/CAO-Subroutine.js
 * @plugindesc v1.0.0 イベントコマンドでサブルーチンを作るための機能を提供します
 *
 * @help
 * == 使用方法 ==
 *
 *  1. ラベル名を全角＠から始めると呼び出し元が記録されるようになります
 *  2. 呼び出しには「ラベルジャンプ」を使用します
 *  3. 戻るには「ラベルジャンプ」で return を指定します
 *  4. スキップ化(Ctrl+/)すると「スキップ終了」で、自動的に return します
 *
 *
 * @param PrefixString
 * @text ラベル名の接頭辞
 * @desc
 *  先頭にこの文字がつけられたラベルはサブルーチン化される
 *  ラベルジャンプ時に呼び出し元が記録される
 * @type string
 * @default ＠
 *
 * @param ReturnCommand
 * @text リターン命令
 * @desc
 *  ラベルジャンプで指定すると呼び出し元へ戻る
 *  スキップ化されていれば実行不要
 * @type string
 * @default return
 *
 */

;(() => {
    'use strict'

    const pluginName = document.currentScript.src.split('/').pop().split(/\.(?=[^.]+$)/)[0]
    const pluginParams = PluginManager.parameters(pluginName)


    const _Game_Interpreter_clear = Game_Interpreter.prototype.clear
    Game_Interpreter.prototype.clear = function() {
        _Game_Interpreter_clear.apply(this, arguments)
        this._caller = []
    }

    // Jump to Label
    const _Game_Interpreter_command119 = Game_Interpreter.prototype.command119
    Game_Interpreter.prototype.command119 = function(params) {
        const labelName = params[0]
        // return
        if (labelName === pluginParams.ReturnCommand) {
            if (this._caller.length === 0) {
                throw new Error("サブルーチンの戻り先が見つかりません")
            } else {
                const [index, indent] = this._caller.pop()
                this.jumpTo(index)
            }
            return true
        }
        // jump
        const lastIndex = this._index
        _Game_Interpreter_command119.apply(this, arguments)
        if (this._index !== lastIndex && labelName.startsWith(pluginParams.PrefixString)) {
            this._caller.push([lastIndex, this._list[this._index].indent])
        }
        return true
    }

    // End of Skip
    const _Game_Interpreter_command409 =
        Game_Interpreter.prototype.hasOwnProperty('command409')
            ? Game_Interpreter.prototype.command409
            : function() { return true }
    Game_Interpreter.prototype.command409 = function() {
        if (this._caller.length > 0) {
            const [index, indent] = this._caller[this._caller.length - 1]
            if (this._indent === indent - 1) {
                this.jumpTo(index)
                this._caller.pop()
                return true
            }
        }
        return _Game_Interpreter_command409.apply(this, arguments)
    }

})();
