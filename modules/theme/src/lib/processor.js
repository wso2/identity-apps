/* eslint-disable */
"use strict";

function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
        };
    }
    return _typeof(obj);
}

/**
 *
 * MIT License
 *
 * Copyright (c) 2020 Jerad Rutnam (www.jeradrutnam.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
module.exports = function() {
    function PreProcessor(options) {
        this.options = options || {};
    }

    function replaceVar(src, replaceVar, replaceValue) {
        var regex = new RegExp("(?<=" + replaceVar + "(.[^aA-zZ]*?))[:](.*?)[;]", "g");
        var match = src.match(regex);

        if (match) {
            return src.replace(match, ":" + replaceValue + ";");
        } else {
            return src;
        }
    }

    PreProcessor.prototype.process = function(src, extra) {
        var _this = this;

        var fileElements = extra.fileInfo.filename.split("/");
        var newSrc = src;
        Object.keys(this.options).forEach(function(option) {
            var optionValue = _this.options[option];

            if (_typeof(optionValue) === "object" && optionValue !== null) {
                if (fileElements[fileElements.length - 1] == optionValue.file) {
                    newSrc = replaceVar(newSrc, option, optionValue.value);
                }
            } else if (typeof optionValue === "string" && optionValue !== null) {
                newSrc = replaceVar(newSrc, option, optionValue);
            }
        });
        return newSrc;
    };

    return PreProcessor;
};
