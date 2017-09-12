/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Object representing a warning.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Warning');

goog.require('Blockly.Bubble');
goog.require('Blockly.Icon');


/**
 * Class for a warning.
 * @param {!Blockly.Block} block The block associated with this warning.
 * @extends {Blockly.Icon}
 * @constructor
 */
Blockly.Warning = function(block) {
    Blockly.Warning.superClass_.constructor.call(this, block);
    this.createIcon();
    // The text_ object can contain multiple warnings.
    this.text_ = {};
};
goog.inherits(Blockly.Warning, Blockly.Icon);

/**
 * Does this icon get hidden when the block is collapsed.
 */
Blockly.Warning.prototype.collapseHidden = false;

/**
 * Icon in base64 format.
 * Josef - Red/white/black version, doesn't blend in with text
 * http://www.onlinewebfonts.com/icon/78843 
 * @private
 */
Blockly.Warning.prototype.png_ = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI0OHB4IiBpZD0ic3ZnMTM3NyIgd2lkdGg9IjQ4cHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcyBpZD0iZGVmczEzNzkiPjxyYWRpYWxHcmFkaWVudCBjeD0iNjA1LjcxNDI5IiBjeT0iNDg2LjY0Nzg5IiBmeD0iNjA1LjcxNDI5IiBmeT0iNDg2LjY0Nzg5IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0yLjc3NDM4OSwwLDAsMS45Njk3MDYsMTEyLjc2MjMsLTg3Mi44ODU0KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJyYWRpYWxHcmFkaWVudDY3MTkiIHI9IjExNy4xNDI4NiIgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NTA2MCIvPjxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyR3JhZGllbnQ1MDYwIj48c3RvcCBpZD0ic3RvcDUwNjIiIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6YmxhY2s7c3RvcC1vcGFjaXR5OjE7Ii8+PHN0b3AgaWQ9InN0b3A1MDY0IiBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOmJsYWNrO3N0b3Atb3BhY2l0eTowOyIvPjwvbGluZWFyR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGN4PSI2MDUuNzE0MjkiIGN5PSI0ODYuNjQ3ODkiIGZ4PSI2MDUuNzE0MjkiIGZ5PSI0ODYuNjQ3ODkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMi43NzQzODksMCwwLDEuOTY5NzA2LC0xODkxLjYzMywtODcyLjg4NTQpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9InJhZGlhbEdyYWRpZW50NjcxNyIgcj0iMTE3LjE0Mjg2IiB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ1MDYwIi8+PGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXJHcmFkaWVudDUwNDgiPjxzdG9wIGlkPSJzdG9wNTA1MCIgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjpibGFjaztzdG9wLW9wYWNpdHk6MDsiLz48c3RvcCBpZD0ic3RvcDUwNTYiIG9mZnNldD0iMC41IiBzdHlsZT0ic3RvcC1jb2xvcjpibGFjaztzdG9wLW9wYWNpdHk6MTsiLz48c3RvcCBpZD0ic3RvcDUwNTIiIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6YmxhY2s7c3RvcC1vcGFjaXR5OjA7Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgyLjc3NDM4OSwwLDAsMS45Njk3MDYsLTE4OTIuMTc5LC04NzIuODg1NCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0ibGluZWFyR3JhZGllbnQ2NzE1IiB4MT0iMzAyLjg1NzE1IiB4Mj0iMzAyLjg1NzE1IiB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ1MDQ4IiB5MT0iMzY2LjY0Nzg5IiB5Mj0iNjA5LjUwNTA3Ii8+PGxpbmVhckdyYWRpZW50IGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iYWlncmQxIiB4MT0iNC4xOTE0IiB4Mj0iNDcuMzE5NyIgeTE9IjExLjExMzMiIHkyPSI1Ni4wNTIzIj48c3RvcCBpZD0ic3RvcDY0OTAiIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0Q0RDRENCIvPjxzdG9wIGlkPSJzdG9wNjQ5MiIgb2Zmc2V0PSIwLjM5ODIiIHN0eWxlPSJzdG9wLWNvbG9yOiNFMkUyRTIiLz48c3RvcCBpZD0ic3RvcDY0OTQiIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRkZGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0ibGluZWFyR3JhZGllbnQ3NDUxIiB4MT0iNC4xOTE0IiB4Mj0iNDcuMzE5NyIgeGxpbms6aHJlZj0iI2FpZ3JkMSIgeTE9IjExLjExMzMiIHkyPSI1Ni4wNTIzIi8+PGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXJHcmFkaWVudDQxMjYiPjxzdG9wIGlkPSJzdG9wNDEyOCIgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eToxOyIvPjxzdG9wIGlkPSJzdG9wNDEzMCIgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eTowOyIvPjwvbGluZWFyR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGN4PSIyMy44NTcxNDMiIGN5PSI0MC4wMDAwMDAiIGZ4PSIyMy44NTcxNDMiIGZ5PSI0MC4wMDAwMDAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMC41LDIuMTM5Mjg2ZS0xNCwyMCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0icmFkaWFsR3JhZGllbnQ3NDQ5IiByPSIxNy4xNDI4NTciIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQxMjYiLz48bGluZWFyR3JhZGllbnQgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjg5OTAwOSwwLDAsMC45MzQyMzUsMS44NzUxMDgsMS4xOTM2NDUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImxpbmVhckdyYWRpZW50NTI1MCIgeDE9IjguNTQ2OTM0MSIgeDI9IjMwLjg1MDg4IiB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ2NTI1IiB5MT0iMzAuMjgxNjgxIiB5Mj0iNDguMzAxODg0Ii8+PGxpbmVhckdyYWRpZW50IGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0ibGluZWFyR3JhZGllbnQzOTIyIiB4MT0iNC4xOTE0IiB4Mj0iNDcuMzE5NyIgeGxpbms6aHJlZj0iI2FpZ3JkMSIgeTE9IjExLjExMzMiIHkyPSI1Ni4wNTIzIi8+PGxpbmVhckdyYWRpZW50IGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC44OTkwMDksMCwwLDAuOTM0MjM1LDEuODc1MTA4LDEuMTkzNjQ1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJsaW5lYXJHcmFkaWVudDM5MjQiIHgxPSI4LjU0NjkzNDEiIHgyPSIzMC44NTA4OCIgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NjUyNSIgeTE9IjMwLjI4MTY4MSIgeTI9IjQ4LjMwMTg4NCIvPjxsaW5lYXJHcmFkaWVudCBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuODk5MDA5LDAsMCwwLjkzNDIzNSwxLjg3NTEwOCwxLjE5MzY0NSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0ibGluZWFyR3JhZGllbnQzOTMzIiB4MT0iOC41NDY5MzQxIiB4Mj0iMzAuODUwODgiIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDY1MjUiIHkxPSIzMC4yODE2ODEiIHkyPSI0OC4zMDE4ODQiLz48bGluZWFyR3JhZGllbnQgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJsaW5lYXJHcmFkaWVudDM5MzUiIHgxPSI0LjE5MTQiIHgyPSI0Ny4zMTk3IiB4bGluazpocmVmPSIjYWlncmQxIiB5MT0iMTEuMTEzMyIgeTI9IjU2LjA1MjMiLz48bGluZWFyR3JhZGllbnQgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJsaW5lYXJHcmFkaWVudDM5NDYiIHgxPSI0LjE5MTQiIHgyPSI0Ny4zMTk3IiB4bGluazpocmVmPSIjYWlncmQxIiB5MT0iMTEuMTEzMyIgeTI9IjU2LjA1MjMiLz48bGluZWFyR3JhZGllbnQgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjg5OTAwOSwwLDAsMC45MzQyMzUsMS44NzUxMDgsMS4xOTM2NDUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImxpbmVhckdyYWRpZW50Mzk0OCIgeDE9IjguNTQ2OTM0MSIgeDI9IjMwLjg1MDg4IiB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ2NTI1IiB5MT0iMzAuMjgxNjgxIiB5Mj0iNDguMzAxODg0Ii8+PC9kZWZzPjxnIGlkPSJsYXllcjEiPjxnIGlkPSJnNzQzNSIgdHJhbnNmb3JtPSJtYXRyaXgoMS41NjY2NjcsMC4wMDAwMDAsMC4wMDAwMDAsMS41NjY2NjcsLTguOTI1NTY2LC0yMy45NDc2NCkiPjxnIGlkPSJnNjcwNyIgc3R5bGU9ImRpc3BsYXk6aW5saW5lIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjQ0NDA3NGUtMiwwLDAsMS4zMzE5NzNlLTIsMzMuMzg4NzEsNDAuNDAzMzcpIj48cmVjdCBoZWlnaHQ9IjQ3OC4zNTcxOCIgaWQ9InJlY3Q2NzA5IiBzdHlsZT0ib3BhY2l0eTowLjQwMjA2MTg1O2NvbG9yOmJsYWNrO2ZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDY3MTUpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjptaXRlcjttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTt2aXNpYmlsaXR5OnZpc2libGU7ZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZSIgd2lkdGg9IjEzMzkuNjMzNSIgeD0iLTE1NTkuMjUyMyIgeT0iLTE1MC42OTY4NSIvPjxwYXRoIGQ9Ik0gLTIxOS42MTg3NiwtMTUwLjY4MDM4IEMgLTIxOS42MTg3NiwtMTUwLjY4MDM4IC0yMTkuNjE4NzYsMzI3LjY1MDQxIC0yMTkuNjE4NzYsMzI3LjY1MDQxIEMgLTc2Ljc0NDU5NCwzMjguNTUwODYgMTI1Ljc4MTQ2LDIyMC40ODA3NSAxMjUuNzgxMzgsODguNDU0MjM1IEMgMTI1Ljc4MTM4LC00My41NzIzMDIgLTMzLjY1NTQzNiwtMTUwLjY4MDM2IC0yMTkuNjE4NzYsLTE1MC42ODAzOCB6ICIgaWQ9InBhdGg2NzExIiBzdHlsZT0ib3BhY2l0eTowLjQwMjA2MTg1O2NvbG9yOmJsYWNrO2ZpbGw6dXJsKCNyYWRpYWxHcmFkaWVudDY3MTcpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjptaXRlcjttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTt2aXNpYmlsaXR5OnZpc2libGU7ZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZSIvPjxwYXRoIGQ9Ik0gLTE1NTkuMjUyMywtMTUwLjY4MDM4IEMgLTE1NTkuMjUyMywtMTUwLjY4MDM4IC0xNTU5LjI1MjMsMzI3LjY1MDQxIC0xNTU5LjI1MjMsMzI3LjY1MDQxIEMgLTE3MDIuMTI2NSwzMjguNTUwODYgLTE5MDQuNjUyNSwyMjAuNDgwNzUgLTE5MDQuNjUyNSw4OC40NTQyMzUgQyAtMTkwNC42NTI1LC00My41NzIzMDIgLTE3NDUuMjE1NywtMTUwLjY4MDM2IC0xNTU5LjI1MjMsLTE1MC42ODAzOCB6ICIgaWQ9InBhdGg2NzEzIiBzdHlsZT0ib3BhY2l0eTowLjQwMjA2MTg1O2NvbG9yOmJsYWNrO2ZpbGw6dXJsKCNyYWRpYWxHcmFkaWVudDY3MTkpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjptaXRlcjttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTt2aXNpYmlsaXR5OnZpc2libGU7ZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZSIvPjwvZz48ZyBpZD0iZzM5MzciIHRyYW5zZm9ybT0ibWF0cml4KDEsMCw0LjUzNzg0NmUtMywxLC0wLjEzODkwNywtMS4zOTQ3MThlLTE1KSI+PHBhdGggZD0iTSAzMy4yODI3ODEsMzguNjQ0NzQ0IEwgMjIuNDA3NzkxLDE4LjM5NDc2NSBDIDIyLjA5NTI5MiwxNy44MzIyNjYgMjEuNTMyNzkyLDE3LjUxOTc2NyAyMC45MDc3OTMsMTcuNTE5NzY3IEMgMjAuMjgyNzkzLDE3LjUxOTc2NyAxOS43MjAyOTQsMTcuODk0NzY1IDE5LjQwNzc5NSwxOC40NTcyNjUgTCA4Ljc4MjgwNDgsMzguNzA3MjQ1IEMgOC41MzI4MDQ4LDM5LjIwNzI0NCA4LjUzMjgwNDgsMzkuODk0NzQ0IDguODQ1MzA0OCw0MC4zOTQ3NDMgQyA5LjE1NzgwMzgsNDAuODk0NzQzIDkuNjU3ODAzOCw0MS4xNDQ3NDIgMTAuMjgyODA0LDQxLjE0NDc0MiBMIDMxLjc4Mjc4Miw0MS4xNDQ3NDIgQyAzMi40MDc3ODEsNDEuMTQ0NzQyIDMyLjk3MDI4LDQwLjgzMjI0MyAzMy4yMjAyODEsNDAuMzMyMjQzIEMgMzMuNTMyNzgsMzkuODMyMjQzIDMzLjUzMjc4LDM5LjIwNzI0NCAzMy4yODI3ODEsMzguNjQ0NzQ0IHogIiBpZD0icGF0aDY0ODUiIHN0eWxlPSJmaWxsOiNjYzAwMDA7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOiM5ZjAwMDA7c3Ryb2tlLXdpZHRoOjAuNjM4Mjk3ODtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsLTguNzI2NjgzZS0zLDEsMC4zMjgwNzQsMS4yNzY1OTYpIi8+PGcgaWQ9Imc2NDg3IiBzdHlsZT0iZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLW1pdGVybGltaXQ6NCIgdHJhbnNmb3JtPSJtYXRyaXgoMC42MjUsMCwtNS41MzQ5MzRlLTMsMC42MzQyNTQsNi4xNjQwNTMsMTUuNzYwNTUpIj48bGluZWFyR3JhZGllbnQgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJsaW5lYXJHcmFkaWVudDY1MjUiIHgxPSI0LjE5MTQwMDEiIHgyPSI0Ny4zMTk2OTgiIHkxPSIxMS4xMTMzIiB5Mj0iNTYuMDUyMjk5Ij48c3RvcCBpZD0ic3RvcDY1MjkiIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MTsiLz48c3RvcCBpZD0ic3RvcDY1MzEiIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MC4zNDAyMDYxODsiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGQ9Ik0gOS41LDM3LjYgQyA5LjIsMzguMSA5LjUsMzguNSAxMCwzOC41IEwgMzguMiwzOC41IEMgMzguNywzOC41IDM5LDM4LjEgMzguNywzNy42IEwgMjQuNCwxMSBDIDI0LjEsMTAuNSAyMy43LDEwLjUgMjMuNSwxMSBMIDkuNSwzNy42IHogIiBpZD0icGF0aDY0OTYiIHN0eWxlPSJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQzOTQ2KTtzdHJva2U6bm9uZSIvPjwvZz48cGF0aCBkPSJNIDMyLjMyMzEwNiwzOC4xODM5MDUgTCAyMi4xNTAyNzEsMTkuMjY1NjY2IEMgMjEuNzE2OTgsMTguNDUwNjkgMjEuNTYxNjk4LDE4LjE4OTIxMyAyMC45MDg0MDYsMTguMTg5MjEzIEMgMjAuMzQ2NTI1LDE4LjE4OTIxMyAyMC4wNTQxMjcsMTguNTcwMDIgMTkuNjUxMzA1LDE5LjMzOTI5MSBMIDkuNzQ4OTI4NSwzOC4yNDIyOTYgQyA5LjE3Mzc2NDksMzkuMzAzNTg4IDkuMTEyODIzOCwzOS41ODAyMjggOS4zOTM3NjQ0LDQwLjA0NzM0NSBDIDkuNjc0NzAzNCw0MC41MTQ0NjIgMTAuMDMyNzk3LDQwLjQ4OTAyIDExLjM1NjQ0MSw0MC41MTk0OTEgTCAzMC45NzQ1OTMsNDAuNTE5NDkxIEMgMzIuMjA2ODI1LDQwLjUzNDcyNiAzMi40ODM5ODgsNDAuNDQwODM3IDMyLjcwODc0LDM5Ljk3MzcyIEMgMzIuOTg5NjgxLDM5LjUwNjYwMiAzMi44Njc3OTksMzkuMTM2IDMyLjMyMzEwNiwzOC4xODM5MDUgeiAiIGlkPSJwYXRoMTMyNSIgc3R5bGU9Im9wYWNpdHk6MC41O2ZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6dXJsKCNsaW5lYXJHcmFkaWVudDM5NDgpO3N0cm9rZS13aWR0aDowLjYzODI5NzkyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwtOC43MjY2ODNlLTMsMSwwLjMxODI3NywxLjI3NjU5NikiLz48L2c+PGcgaWQ9Imc2NDk4IiBzdHlsZT0iZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLW1pdGVybGltaXQ6NCIgdHJhbnNmb3JtPSJtYXRyaXgoMC41NTUwODgsMCwwLDAuNTU1MDUyLDcuNzQ5NzExLDE3LjgwMTk2KSI+PHBhdGggZD0iTSAyMy45LDM2LjUgQyAyMi42LDM2LjUgMjEuNiwzNS41IDIxLjYsMzQuMiBDIDIxLjYsMzIuOCAyMi41LDMxLjkgMjMuOSwzMS45IEMgMjUuMywzMS45IDI2LjEsMzIuOCAyNi4yLDM0LjIgQyAyNi4yLDM1LjUgMjUuMywzNi41IDIzLjksMzYuNSBMIDIzLjksMzYuNSB6IE0gMjIuNSwzMC42IEwgMjEuOSwxOS4xIEwgMjUuOSwxOS4xIEwgMjUuMywzMC42IEwgMjIuNCwzMC42IEwgMjIuNSwzMC42IHogIiBpZD0icGF0aDY1MDAiIHN0eWxlPSJzdHJva2U6bm9uZSIvPjwvZz48L2c+PC9nPjwvc3ZnPg==';

/**
 * Create the text for the warning's bubble.
 * @param {string} text The text to display.
 * @return {!SVGTextElement} The top-level node of the text.
 * @private
 */
Blockly.Warning.textToDom_ = function(text) {
    var paragraph = /** @type {!SVGTextElement} */ (
        Blockly.createSvgElement('text', {
                'class': 'blocklyText blocklyBubbleText',
                'y': Blockly.Bubble.BORDER_WIDTH
            },
            null));
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var tspanElement = Blockly.createSvgElement('tspan', {
            'dy': '1em',
            'x': Blockly.Bubble.BORDER_WIDTH
        }, paragraph);
        var textNode = document.createTextNode(lines[i]);
        tspanElement.appendChild(textNode);
    }
    return paragraph;
};

/**
 * Show or hide the warning bubble.
 * @param {boolean} visible True if the bubble should be visible.
 */
Blockly.Warning.prototype.setVisible = function(visible) {
    if (visible == this.isVisible()) {
        // No change.
        return;
    }
    if (visible) {
        // Create the bubble to display all warnings.
        var paragraph = Blockly.Warning.textToDom_(this.getText());
        this.bubble_ = new Blockly.Bubble(
            /** @type {!Blockly.Workspace} */
            (this.block_.workspace),
            paragraph, this.block_.svgBlockPath_,
            this.iconX_, this.iconY_, null, null);
        if (this.block_.RTL) {
            // Right-align the paragraph.
            // This cannot be done until the bubble is rendered on screen.
            var maxWidth = paragraph.getBBox().width;
            for (var i = 0, textElement; textElement = paragraph.childNodes[i]; i++) {
                textElement.setAttribute('text-anchor', 'end');
                textElement.setAttribute('x', maxWidth + Blockly.Bubble.BORDER_WIDTH);
            }
        }
        this.updateColour();
        // Bump the warning into the right location.
        var size = this.bubble_.getBubbleSize();
        this.bubble_.setBubbleSize(size.width, size.height);
    } else {
        // Dispose of the bubble.
        this.bubble_.dispose();
        this.bubble_ = null;
        this.body_ = null;
    }
};

/**
 * Bring the warning to the top of the stack when clicked on.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.Warning.prototype.bodyFocus_ = function(e) {
    this.bubble_.promote_();
};

/**
 * Set this warning's text.
 * @param {string} text Warning text (or '' to delete).
 * @param {string} id An ID for this text entry to be able to maintain
 *     multiple warnings.
 */
Blockly.Warning.prototype.setText = function(text, id) {
    if (this.text_[id] == text) {
        return;
    }
    if (text) {
        this.text_[id] = text;
    } else {
        delete this.text_[id];
    }
    if (this.isVisible()) {
        this.setVisible(false);
        this.setVisible(true);
    }
};

/**
 * Get this warning's texts.
 * @return {string} All texts concatenated into one string.
 */
Blockly.Warning.prototype.getText = function() {
    var allWarnings = [];
    for (var id in this.text_) {
        allWarnings.push(this.text_[id]);
    }
    return allWarnings.join('\n');
};

/**
 * Dispose of this warning.
 */
Blockly.Warning.prototype.dispose = function() {
    this.block_.warning = null;
    Blockly.Icon.prototype.dispose.call(this);
};
