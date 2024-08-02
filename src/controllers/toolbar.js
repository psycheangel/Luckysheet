import locale from "../locale/locale";
import {
  getComputedInlineClassStyling,
  getComputedInlineStyling,
  default as luckysheetConfigsetting,
} from "./luckysheetConfigsetting";

import { getObjType, camel2split } from "../utils/util";

// 默认的工具栏按钮
export const defaultToolbar = [
  "undo",
  "redo",
  "paintFormat",
  "|",

  "currencyFormat",
  "percentageFormat",
  "numberIncrease",
  "numberDecrease",
  "moreFormats",
  "|",

  "font",
  "|",
  "fontSize",
  "|",

  "bold",
  "italic",
  "strikethrough",
  "underline",
  "textColor",
  "|",

  "fillColor",
  "border",
  "mergeCell",
  "|",

  "horizontalAlignMode",
  "verticalAlignMode",
  "textWrapMode",
  "textRotateMode",
  "|",

  "image",
  "link",
  "chart",
  "postil",
  "pivotTable",
  "|",

  "function",
  "frozenMode",
  "sortAndFilter",
  "conditionalFormat",
  "dataVerification",
  "splitColumn",
  "screenshot",
  "findAndReplace",
  "protection",
  "print",
  "exportXlsx",
];

// 工具栏按钮 id 关系
export const toolbarIdMap = {
  undo: "#luckysheet-icon-undo", //Undo redo
  redo: "#luckysheet-icon-redo",
  paintFormat: ["#luckysheet-icon-paintformat"], //Format brush
  currencyFormat: "#luckysheet-icon-currency", //currency format
  percentageFormat: "#luckysheet-icon-percent", //Percentage format
  numberDecrease: "#luckysheet-icon-fmt-decimal-decrease", //'Decrease the number of decimal places'
  numberIncrease: "#luckysheet-icon-fmt-decimal-increase", //'Increase the number of decimal places
  moreFormats: "#luckysheet-icon-fmt-other", //'More Formats'
  font: "#luckysheet-icon-font-family", //'font'
  fontSize: "#luckysheet-icon-font-size", //'Font size'
  bold: "#luckysheet-icon-bold", //'Bold (Ctrl+B)'
  italic: "#luckysheet-icon-italic", //'Italic (Ctrl+I)'
  strikethrough: "#luckysheet-icon-strikethrough", //'Strikethrough (Alt+Shift+5)'
  underline: "#luckysheet-icon-underline", //'Underline (Alt+Shift+6)'
  textColor: [
    "#luckysheet-icon-text-color",
    "#luckysheet-icon-text-color-menu",
  ], //'Text color'
  fillColor: [
    "#luckysheet-icon-cell-color",
    "#luckysheet-icon-cell-color-menu",
  ], //'Cell color'
  border: ["#luckysheet-icon-border-all", "#luckysheet-icon-border-menu"], //'border'
  mergeCell: ["#luckysheet-icon-merge-button", "#luckysheet-icon-merge-menu"], //'Merge cells'
  horizontalAlignMode: [
    "#luckysheet-icon-align",
    "#luckysheet-icon-align-menu",
  ], //'Horizontal alignment'
  verticalAlignMode: [
    "#luckysheet-icon-valign",
    "#luckysheet-icon-valign-menu",
  ], //'Vertical alignment'
  textWrapMode: ["#luckysheet-icon-textwrap", "#luckysheet-icon-textwrap-menu"], //'Wrap mode'
  textRotateMode: [
    "#luckysheet-icon-rotation",
    "#luckysheet-icon-rotation-menu",
  ], //'Text Rotation Mode'
  image: "#luckysheet-insertImg-btn-title", //'Insert link'
  link: "#luckysheet-insertLink-btn-title", //'Insert picture'
  chart: "#luckysheet-chart-btn-title", //'chart' (the icon is hidden, but if the chart plugin is configured, you can still create a new chart by right click)
  postil: "#luckysheet-icon-postil", //'comment'
  pivotTable: ["#luckysheet-pivot-btn-title"], //'PivotTable'
  function: ["#luckysheet-icon-function", "#luckysheet-icon-function-menu"], //'formula'
  frozenMode: [
    "#luckysheet-freezen-btn-horizontal",
    "#luckysheet-icon-freezen-menu",
  ], //'freeze mode'
  sortAndFilter: "#luckysheet-icon-autofilter", //'sort and filter'
  conditionalFormat: "#luckysheet-icon-conditionformat", //'Conditional Format'
  dataVerification: "#luckysheet-dataVerification-btn-title", // 'Data Verification'
  splitColumn: "#luckysheet-splitColumn-btn-title", //'Split column'
  screenshot: "#luckysheet-chart-btn-screenshot", //'screenshot'
  findAndReplace: "#luckysheet-icon-seachmore", //'Find and Replace'
  protection: "#luckysheet-icon-protection", // 'Worksheet protection'
  print: "#luckysheet-icon-print", // 'print'
  exportXlsx: "#luckysheet-exportXlsx-btn-title", // 'export xlsx'
};

// 创建工具栏按钮的html
export function createToolbarHtml() {
  const toolbar = locale().toolbar;
  const fontarray = locale().fontarray;
  const defaultFmtArray = locale().defaultFmt;

  const uuidInline = getComputedInlineClassStyling(`
    &.select-none {
    user-select: none;
    }
    &.select-border-bottom {
    border-bottom-color: rgb(0, 0, 0); 
    user-select: none;
    }
    &.select-border-bottom-one {
    border-bottom-color: rgb(255, 255, 255);
    user-select: none;
    }
    &.background-default {
    background-color:${luckysheetConfigsetting.defaultTextColor}
    }
    &.background-default-cell {
    background-color:${luckysheetConfigsetting.defaultCellColor}
    }
    &.display-none {
    display:none;
    }
    &.display-layout {
    user-select: none;
    margin-left: 0px;
    margin-right: 4px;
    }
  `);
  const htmlMap = {
    undo: `<div class="luckysheet-toolbar-button luckysheet-inline-block disabled ${uuidInline} select-none" data-tips="${toolbar.undo}"
        id="luckysheet-icon-undo" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block  ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-undo iconfont-luckysheet luckysheet-iconfont-qianjin  ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
    redo: `<div class="luckysheet-toolbar-button luckysheet-inline-block disabled ${uuidInline} select-none" data-tips="${toolbar.redo}"
        id="luckysheet-icon-redo" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-redo iconfont-luckysheet luckysheet-iconfont-houtui ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
    paintFormat: `<div class="luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.paintFormat}"
        id="luckysheet-icon-paintformat" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img iconfont-luckysheet luckysheet-iconfont-geshishua ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
    currencyFormat: `<div class="luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.currencyFormat}"
        id="luckysheet-icon-currency" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img iconfont-luckysheet luckysheet-iconfont-jine ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
    percentageFormat: `<div class="luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.percentageFormat}"
        id="luckysheet-icon-percent" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img iconfont-luckysheet luckysheet-iconfont-baifenhao ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //Percentage format
    numberDecrease: `<div class="luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.numberDecrease}"
        id="luckysheet-icon-fmt-decimal-decrease" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block toolbar-decimal-icon ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-decimal-decrease iconfont-luckysheet luckysheet-iconfont-zengjiaxiaoshuwei ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Decrease the number of decimal places'
    numberIncrease: `<div class="luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.numberIncrease}"
        id="luckysheet-icon-fmt-decimal-increase" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block toolbar-decimal-icon ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-decimal-increase iconfont-luckysheet luckysheet-iconfont-jianxiaoxiaoshuwei ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Increase the number of decimal places
    moreFormats: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.moreFormats}"
        id="luckysheet-icon-fmt-other" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        ${defaultFmtArray[0].text}
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'More Formats'
    font: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.font}" id="luckysheet-icon-font-family" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        ${fontarray[0]}
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'font'
    fontSize: `<div class="luckysheet-toolbar-select luckysheet-toolbar-zoom-combobox luckysheet-toolbar-combo-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.fontSize}" id="luckysheet-icon-font-size">
            <div class="luckysheet-toolbar-combo-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-combo-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div aria-posinset="4" aria-setsize="7" class="luckysheet-inline-block luckysheet-toolbar-combo-button-caption ${uuidInline} select-none">
                        <input aria-label="${toolbar.fontSize}" class="luckysheet-toolbar-combo-button-input luckysheet-toolbar-textinput ${uuidInline} select-none"
                        role="combobox" tabindex="-1" type="text" value="10"
                        />
                    </div>
                    <div class="luckysheet-toolbar-combo-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige">
                    </div>
                </div>
            </div>
        </div>`, //'Font size'
    bold: `<div class="luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.bold}"
        id="luckysheet-icon-bold" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-bold iconfont-luckysheet luckysheet-iconfont-jiacu ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Bold (Ctrl+B)'
    italic: `<div class="luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.italic}"
        id="luckysheet-icon-italic" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-italic iconfont-luckysheet luckysheet-iconfont-wenbenqingxie1 ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Italic (Ctrl+I)'
    strikethrough: `<div class="luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.strikethrough}"
        id="luckysheet-icon-strikethrough" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-strikethrough iconfont-luckysheet luckysheet-iconfont-wenbenshanchuxian ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Strikethrough (Alt+Shift+5)'
    underline: `<div class="luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.underline}"
        id="luckysheet-icon-underline" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-underline iconfont-luckysheet luckysheet-iconfont-wenbenxiahuaxian ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Underline (Alt+Shift+6)'
    textColor: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-text-color ${uuidInline} select-none"
        data-tips="${toolbar.textColor}" id="luckysheet-icon-text-color" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-color-menu-button-indicator ${uuidInline} select-border-bottom">
                            <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                                <div class="text-color-bar ${uuidInline} background-default"></div>
                                <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-text-color iconfont-luckysheet luckysheet-iconfont-wenbenyanse ${uuidInline} select-none">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.chooseColor}..." id="luckysheet-icon-text-color-menu" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'Text color'
    fillColor: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-cell-color ${uuidInline} select-none"
        data-tips="${toolbar.fillColor}" id="luckysheet-icon-cell-color" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-color-menu-button-indicator ${uuidInline} select-border-bottom-one">
                            <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                                <div class="text-color-bar ${uuidInline} background-default-cell"></div>
                                <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-cell-color iconfont-luckysheet luckysheet-iconfont-tianchong ${uuidInline} select-none">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.chooseColor}..." id="luckysheet-icon-cell-color-menu" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'Cell color'
    border: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-border-all ${uuidInline} select-none"
        data-tips="${toolbar.border}" id="luckysheet-icon-border-all" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-border-all iconfont-luckysheet luckysheet-iconfont-quanjiabiankuang ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.borderStyle}..." id="luckysheet-icon-border-menu" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'border'
    mergeCell: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-merge-button ${uuidInline} select-none"
        data-tips="${toolbar.mergeCell}" id="luckysheet-icon-merge-button" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-merge iconfont-luckysheet luckysheet-iconfont-hebing ${uuidInline} select-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.chooseMergeType}..." id="luckysheet-icon-merge-menu" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'Merge cells'
    horizontalAlignMode: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-align ${uuidInline} select-none"
        data-tips="${toolbar.horizontalAlign}" id="luckysheet-icon-align" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-align-left iconfont-luckysheet luckysheet-iconfont-wenbenzuoduiqi ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.alignment}..." id="luckysheet-icon-align-menu" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'Horizontal alignment'
    verticalAlignMode: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-valign ${uuidInline} select-none"
        data-tips="${toolbar.verticalAlign}" id="luckysheet-icon-valign" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-valign-bottom iconfont-luckysheet luckysheet-iconfont-dibuduiqi ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.alignment}..." id="luckysheet-icon-valign-menu" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'Vertical alignment'
    textWrapMode: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-textwrap ${uuidInline} select-none"
        data-tips="${toolbar.textWrap}" id="luckysheet-icon-textwrap" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-textwrap-clip iconfont-luckysheet luckysheet-iconfont-jieduan ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.textWrapMode}..." id="luckysheet-icon-textwrap-menu" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'Wrap mode'
    textRotateMode: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-rotation ${uuidInline} select-none"
        data-tips="${toolbar.textRotate}" id="luckysheet-icon-rotation" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont-luckysheet luckysheet-iconfont-wuxuanzhuang ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.textRotateMode}..." id="luckysheet-icon-rotation-menu" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'Text Rotation Mode'
    image: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.insertImage}" id="luckysheet-insertImg-btn-title" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont-luckysheet luckysheet-iconfont-tupian ${uuidInline} select-none">
                                <input id="luckysheet-imgUpload" type="file" accept="image/*" class="${uuidInline} display-none"></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, // 'Insert picture'
    link: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.insertLink}" id="luckysheet-insertLink-btn-title" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont-luckysheet luckysheet-iconfont-lianjie ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, // 'Insert link'(TODO)
    chart: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.chart}" id="luckysheet-chart-btn-title" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont-luckysheet luckysheet-iconfont-tubiao ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'chart' (the icon is hidden, but if the chart plugin is configured, you can still create a new chart by right click)
    postil: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.postil}"
        id="luckysheet-icon-postil" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon-img-container luckysheet-toolbar-menu-button-caption luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-zhushi ${uuidInline} select-none">
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'comment'
    pivotTable: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.pivotTable}" id="luckysheet-pivot-btn-title" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont-luckysheet luckysheet-iconfont-shujutoushi ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'PivotTable'
    function: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-function ${uuidInline} select-none"
        data-tips="${toolbar.autoSum}" id="luckysheet-icon-function" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-function iconfont-luckysheet luckysheet-iconfont-jisuan ${uuidInline} select-none">
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        ${toolbar.sum}
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.moreFunction}..." id="luckysheet-icon-function-menu" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'formula'
    frozenMode: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-freezen-btn-horizontal ${uuidInline} select-none"
        data-tips="${toolbar.freezeTopRow}" id="luckysheet-freezen-btn-horizontal" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">

                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont-luckysheet luckysheet-iconfont-dongjie1 ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.moreOptions}..." id="luckysheet-icon-freezen-menu" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'freeze mode'
    sortAndFilter: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.sortAndFilter}"
        id="luckysheet-icon-autofilter" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-autofilter iconfont-luckysheet luckysheet-iconfont-shaixuan ${uuidInline} select-none">
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} display-layout">
                    </div>
                </div>
            </div>
        </div>`, //'Sort and filter'
    conditionalFormat: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.conditionalFormat}"
        id="luckysheet-icon-conditionformat" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">

                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-autofilter iconfont-luckysheet luckysheet-iconfont-geshitiaojian ${uuidInline} select-none">
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} select-none">
                    </div>
                </div>
            </div>
        </div>`, //'Conditional Format'
    dataVerification: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.dataVerification}" id="luckysheet-dataVerification-btn-title" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont-luckysheet luckysheet-iconfont-shujuyanzheng ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, // 'Data Verification'
    splitColumn: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.splitColumn}" id="luckysheet-splitColumn-btn-title" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont-luckysheet luckysheet-iconfont-wenbenfenge ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Split column'
    screenshot: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.screenshot}" id="luckysheet-chart-btn-screenshot" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont-luckysheet luckysheet-iconfont-jieping ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'screenshot'
    findAndReplace: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.findAndReplace}"
        id="luckysheet-icon-seachmore" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">

                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-autofilter iconfont-luckysheet luckysheet-iconfont-sousuo ${uuidInline} select-none">
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} display-layout">
                    </div>
                </div>
            </div>
        </div>`, //'Find and Replace'
    protection: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.protection}" id="luckysheet-icon-protection" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont-luckysheet luckysheet-iconfont-biaogesuoding ${uuidInline} select-none">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, // 'Worksheet protection'
    print: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block ${uuidInline} select-none" data-tips="${toolbar.print}"
        id="luckysheet-icon-print" role="button">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">

                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-autofilter iconfont-luckysheet luckysheet-iconfont-dayin ${uuidInline} select-none">
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont-luckysheet luckysheet-iconfont-xiayige ${uuidInline} display-layout">
                    </div>
                </div>
            </div>
        </div>`, // 'print'
    exportXlsx: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block ${uuidInline} select-none"
        data-tips="${toolbar.exportXlsx}" id="luckysheet-exportXlsx-btn-title" role="button">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none ${uuidInline} select-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="M4 12a8 8 0 1 0 16 0"/><path stroke-linejoin="round" d="M12 14V4m0 0l3 3m-3-3L9 7"/></g></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, // 'Insert picture'
  };

  const showtoolbar = luckysheetConfigsetting.showtoolbar;
  const showtoolbarConfig = luckysheetConfigsetting.showtoolbarConfig;

  const buttonHTML = ['<div class="luckysheet-toolbar-left-theme"></div>'];

  // 数组形式直接生成
  if (getObjType(showtoolbarConfig) === "array") {
    // 此时不根据 showtoolbar=false，showtoolbarConfig为某几个进行适配，此时showtoolbarConfig本身就是全部要显示的按钮
    if (!showtoolbar) {
      return "";
    }
    let i = 0;
    showtoolbarConfig.forEach(function (key, i) {
      if (key === "|") {
        const nameKeys = showtoolbarConfig[i - 1];
        if (nameKeys !== "|") {
          buttonHTML.push(
            `<div id="toolbar-separator-${camel2split(
              nameKeys
            )}" class="luckysheet-toolbar-separator luckysheet-inline-block" nonce="${
              luckysheetConfigsetting.cspNonce
            }" style="user-select: none;"></div>`
          );
        }
      } else {
        buttonHTML.push(htmlMap[key]);
      }
    });
    return buttonHTML.join("");
  }

  const config = defaultToolbar.reduce(function (total, curr) {
    if (curr !== "|") {
      total[curr] = true;
    }
    return total;
  }, {});

  if (!showtoolbar) {
    for (let s in config) {
      config[s] = false;
    }
  }

  // 对象模式 则从里面挑选 true 保留 false 删掉
  if (JSON.stringify(showtoolbarConfig) !== "{}") {
    if (showtoolbarConfig.hasOwnProperty("undoRedo")) {
      config.undo = config.redo = showtoolbarConfig.undoRedo;
    }
    Object.assign(config, showtoolbarConfig);
  }
  for (let i = 0; i < defaultToolbar.length; i++) {
    let key = defaultToolbar[i];
    if (!config[key] && key !== "|") {
      // 如果当前元素隐藏 按照之前的规则 后面紧跟的 | 分割也不需要显示了
      if (defaultToolbar[i + 1] === "|") {
        i++;
      }
      continue;
    }
    if (key === "|") {
      const nameKeys = defaultToolbar[i - 1];
      if (nameKeys !== "|") {
        buttonHTML.push(
          `<div id="toolbar-separator-${camel2split(
            nameKeys
          )}" class="luckysheet-toolbar-separator luckysheet-inline-block" nonce="${
            luckysheetConfigsetting.cspNonce
          }" style="user-select: none;"></div>`
        );
      }
    } else {
      buttonHTML.push(htmlMap[key]);
    }
  }
  return buttonHTML.join("");
}
