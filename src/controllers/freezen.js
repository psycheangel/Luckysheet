import { getSheetIndex } from "../methods/get";
import { luckysheet_searcharray } from "./sheetSearch";
import { selectHightlightShow } from "./select";
import { createFilterOptions } from "./filter";
import server from "./server";
import menuButton from "./menuButton";
import luckysheetPostil from "./postil";
import luckysheetDropCell from "./dropCell";
import { rowLocationByIndex, colLocationByIndex } from "../global/location";
import Store from "../store";
import locale from "../locale/locale";
import { luckysheetrefreshgrid } from "../global/refresh";
import luckysheetConfigsetting, {
  getComputedInlineClassStyling,
} from "./luckysheetConfigsetting";

const luckysheetFreezen = {
  freezenHorizontalHTML:
    '<div id="luckysheet-freezebar-horizontal" class="luckysheet-freezebar" tabindex="0"><div class="luckysheet-freezebar-handle luckysheet-freezebar-horizontal-handle" ><div class="luckysheet-freezebar-handle-bar luckysheet-freezebar-horizontal-handle-title" ></div><div class="luckysheet-freezebar-handle-bar luckysheet-freezebar-horizontal-handle-bar" ></div></div><div class="luckysheet-freezebar-drop luckysheet-freezebar-horizontal-drop" ><div class="luckysheet-freezebar-drop-bar luckysheet-freezebar-horizontal-drop-title" ></div><div class="luckysheet-freezebar-drop-bar luckysheet-freezebar-horizontal-drop-bar" >&nbsp;</div></div></div>',
  freezenVerticalHTML:
    '<div id="luckysheet-freezebar-vertical" class="luckysheet-freezebar" tabindex="0"><div class="luckysheet-freezebar-handle luckysheet-freezebar-vertical-handle" ><div class="luckysheet-freezebar-handle-bar luckysheet-freezebar-vertical-handle-title" ></div><div class="luckysheet-freezebar-handle-bar luckysheet-freezebar-vertical-handle-bar" ></div></div><div class="luckysheet-freezebar-drop luckysheet-freezebar-vertical-drop" ><div class="luckysheet-freezebar-drop-bar luckysheet-freezebar-vertical-drop-title" ></div><div class="luckysheet-freezebar-drop-bar luckysheet-freezebar-vertical-drop-bar" >&nbsp;</div></div></div>',
  initialHorizontal: true,
  initialVertical: true,
  horizontalmovestate: false,
  horizontalmoveposition: null,
  verticalmovestate: false,
  verticalmoveposition: null,
  windowHeight: null,
  windowWidth: null,
  freezenhorizontaldata: null,
  freezenverticaldata: null,
  // 定义冻结首行、首列是实际的第一行第一列还是当前视图的第一行第一列
  // excel 为视图的第一行第一列，但此处实现有问题，如滚动到15行冻结首行，当前冻结了15行，保存再进去实际冻结了第一行
  // 冻结真实的第一行、第一列更符合直觉
  freezenRealFirstRowColumn: true,
  cutVolumn: function (arr, cutindex) {
    if (cutindex <= 0) {
      return arr;
    }

    let pre = arr.slice(0, cutindex);
    let premax = pre[pre.length - 1];
    let ret = arr.slice(cutindex);

    // for (let i = 0; i < ret.length; i++) {
    //     ret[i] -= premax;
    // }

    return ret;
  },
  cancelFreezenVertical: function (sheetIndex) {
    let _this = this;

    const _locale = locale();
    const locale_freezen = _locale.freezen;
    // 解决freeze 不垂直居中的问题
    const uuidInline = getComputedInlineClassStyling(`
        &.select-none {
           user-select: none;
        }
      `);
    const freezeHTML = `
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-function iconfont-luckysheet luckysheet-iconfont-dongjie1 ${uuidInline} select-none">
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none">
                        ${locale_freezen.default}
                    </div>
                </div>
            </div>
        `;

    $("#luckysheet-freezen-btn-horizontal").html(freezeHTML);

    $("#luckysheet-freezen-btn-vertical").html(
      '<i class="fa fa-indent"></i> ' + locale_freezen.freezenColumn
    );
    _this.freezenverticaldata = null;
    let isvertical = $("#luckysheet-freezebar-vertical").is(":visible");
    $("#luckysheet-freezebar-vertical").hide();

    if (sheetIndex == null) {
      sheetIndex = Store.currentSheetIndex;
    }

    let currentSheet = Store.luckysheetfile[getSheetIndex(sheetIndex)];
    if (currentSheet.freezen != null) {
      currentSheet.freezen.vertical = null;
    }

    if (currentSheet.frozen != null && isvertical) {
      server.saveParam("all", sheetIndex, currentSheet.frozen, { k: "frozen" });
    }
  },
  createFreezenVertical: function (freezenverticaldata, left) {
    let _this = this;

    if (_this.initialVertical) {
      _this.initialVertical = false;
      $("#luckysheet-grid-window-1").append(_this.freezenVerticalHTML);

      $("#luckysheet-freezebar-vertical")
        .find(".luckysheet-freezebar-vertical-drop")
        .hover(
          function () {
            $(this).parent().addClass("luckysheet-freezebar-hover");
          },
          function () {
            $(this).parent().removeClass("luckysheet-freezebar-hover");
          }
        );

      $("#luckysheet-freezebar-vertical")
        .find(".luckysheet-freezebar-vertical-drop")
        .mousedown(function () {
          _this.verticalmovestate = true;
          _this.verticalmoveposition = $(this).position().left;
          _this.windowWidth = $("#luckysheet-grid-window-1").width();
          const uuidInline = getComputedInlineClassStyling(`
          &.cursor {
            cursor: "-webkit-grabbing";
          }
        `);
          $(this).parent().addClass("luckysheet-freezebar-active");
          $("#luckysheet-freezebar-vertical")
            .find(".luckysheet-freezebar-vertical-handle")
            .addClass(uuidInline + " cursor");
        });

      let gridheight = $("#luckysheet-grid-window-1").height();
      const uuidInline = getComputedInlineClassStyling(`
        &.layoutOne {
          height: ${gridheight - 10}px;
          width: 4px,
          cursor: -webkit-grab,
          top: 0px,
        }
      `);
      $("#luckysheet-freezebar-vertical")
        .find(".luckysheet-freezebar-vertical-handle")
        .addClass(uuidInline + " layoutOne")
        .end()
        .find(".luckysheet-freezebar-vertical-drop")
        .addClass(uuidInline + " layoutOne");
    }

    if (freezenverticaldata == null) {
      if (_this.freezenRealFirstRowColumn) {
        let dataset_col_st = 0;
        left =
          Store.visibledatacolumn[dataset_col_st] - 2 + Store.rowHeaderWidth;
        freezenverticaldata = [
          Store.visibledatacolumn[dataset_col_st],
          dataset_col_st + 1,
          0,
          _this.cutVolumn(Store.visibledatacolumn, dataset_col_st + 1),
          left,
        ];
      } else {
        let scrollLeft = $("#luckysheet-cell-main").scrollLeft();
        let dataset_col_st = luckysheet_searcharray(
          Store.visibledatacolumn,
          scrollLeft
        );
        if (dataset_col_st == -1) {
          dataset_col_st = 0;
        }

        left =
          Store.visibledatacolumn[dataset_col_st] -
          2 -
          scrollLeft +
          Store.rowHeaderWidth;
        freezenverticaldata = [
          Store.visibledatacolumn[dataset_col_st],
          dataset_col_st + 1,
          scrollLeft,
          _this.cutVolumn(Store.visibledatacolumn, dataset_col_st + 1),
          left,
        ];
      }

      _this.saveFreezen(null, null, freezenverticaldata, left);
    }

    _this.freezenverticaldata = freezenverticaldata;

    // $("#luckysheet-freezen-btn-horizontal").html('<i class="luckysheet-icon-img-container iconfont-luckysheet luckysheet-iconfont-dongjie1"></i> '+locale().freezen.freezenCancel);
    const uuidInline = getComputedInlineClassStyling(`
    &.select-none {
      user-select: none;
    }
    &.layout-position {
    left: ${left}px;
    }
  `);
    // 解决freeze 不垂直居中的问题
    const freezeHTML = `
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block  ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block  ${uuidInline} select-none">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-function iconfont-luckysheet luckysheet-iconfont-dongjie1  ${uuidInline} select-none">
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block  ${uuidInline} select-none">
                        ${locale().freezen.freezenCancel}
                    </div>
                </div>
            </div>
        `;
    $("#luckysheet-freezen-btn-horizontal").html(freezeHTML);

    $("#luckysheet-freezebar-vertical")
      .show()
      .find(".luckysheet-freezebar-vertical-handle")
      .addClass(uuidInline + " layout-position")
      .end()
      .find(".luckysheet-freezebar-vertical-drop")
      .addClass(uuidInline + " layout-position");
  },
  saveFreezen: function (
    freezenhorizontaldata,
    top,
    freezenverticaldata,
    left
  ) {
    let currentSheet =
      Store.luckysheetfile[getSheetIndex(Store.currentSheetIndex)];
    if (currentSheet.freezen == null) {
      currentSheet.freezen = {};
    }

    if (freezenhorizontaldata != null) {
      if (currentSheet.freezen.horizontal == null) {
        currentSheet.freezen.horizontal = {};
      }

      currentSheet.freezen.horizontal.freezenhorizontaldata =
        freezenhorizontaldata;
      currentSheet.freezen.horizontal.top = top;
    }

    if (freezenverticaldata != null) {
      if (currentSheet.freezen.vertical == null) {
        currentSheet.freezen.vertical = {};
      }

      currentSheet.freezen.vertical.freezenverticaldata = freezenverticaldata;
      currentSheet.freezen.vertical.left = left;
    }

    // if(currentSheet.freezen != null){
    //     server.saveParam("all", Store.currentSheetIndex, currentSheet.freezen, { "k": "freezen" });
    // }

    // use new property frozen
    if (currentSheet.frozen != null) {
      server.saveParam("all", Store.currentSheetIndex, currentSheet.frozen, {
        k: "frozen",
      });
    }
  },
  initialFreezen: function (sheetIndex) {
    let _this = this;

    // when init ,we get frozen, but here, we need freezen,so tranform it
    _this.frozenTofreezen();

    let currentSheet = Store.luckysheetfile[getSheetIndex(sheetIndex)];
    if (
      currentSheet.freezen != null &&
      currentSheet.freezen.horizontal != null &&
      currentSheet.freezen.horizontal.freezenhorizontaldata != null
    ) {
      _this.createFreezenHorizontal(
        currentSheet.freezen.horizontal.freezenhorizontaldata,
        currentSheet.freezen.horizontal.top
      );
    } else {
      _this.cancelFreezenHorizontal(sheetIndex);
    }

    if (
      currentSheet.freezen != null &&
      currentSheet.freezen.vertical != null &&
      currentSheet.freezen.vertical.freezenverticaldata != null
    ) {
      _this.createFreezenVertical(
        currentSheet.freezen.vertical.freezenverticaldata,
        currentSheet.freezen.vertical.left
      );
    } else {
      _this.cancelFreezenVertical(sheetIndex);
    }

    _this.createAssistCanvas();
  },
  changeFreezenIndex: function (originindex, type) {
    let _this = this;

    if (type == "v" && _this.freezenverticaldata != null) {
      let freezen_colindex = _this.freezenverticaldata[1];
      let offset = luckysheet_searcharray(
        Store.visibledatacolumn,
        $("#luckysheet-cell-main").scrollLeft()
      );

      if (originindex - offset < freezen_colindex) {
        originindex = originindex - offset;
      }
    } else if (type == "h" && _this.freezenhorizontaldata != null) {
      let freezen_rowindex = _this.freezenhorizontaldata[1];
      let offset = luckysheet_searcharray(
        Store.visibledatarow,
        $("#luckysheet-cell-main").scrollTop()
      );

      if (originindex - offset < freezen_rowindex) {
        originindex = originindex - offset;
      }
    }

    return originindex;
  },
  scrollFreezen: function () {
    let _this = this;

    let row;
    let row_focus = Store.luckysheet_select_save[0]["row_focus"];
    if (row_focus == Store.luckysheet_select_save[0]["row"][0]) {
      row = Store.luckysheet_select_save[0]["row"][1];
    } else if (row_focus == Store.luckysheet_select_save[0]["row"][1]) {
      row = Store.luckysheet_select_save[0]["row"][0];
    }

    let column;
    let column_focus = Store.luckysheet_select_save[0]["column_focus"];
    if (column_focus == Store.luckysheet_select_save[0]["column"][0]) {
      column = Store.luckysheet_select_save[0]["column"][1];
    } else if (column_focus == Store.luckysheet_select_save[0]["column"][1]) {
      column = Store.luckysheet_select_save[0]["column"][0];
    }

    if (_this.freezenverticaldata != null) {
      let freezen_colindex = _this.freezenverticaldata[1];

      let offset = luckysheet_searcharray(
        _this.freezenverticaldata[3],
        $("#luckysheet-cell-main").scrollLeft()
      );

      let top = _this.freezenverticaldata[4];

      freezen_colindex += offset;

      if (column >= Store.visibledatacolumn.length) {
        column = Store.visibledatacolumn.length - 1;
      }

      if (freezen_colindex >= Store.visibledatacolumn.length) {
        freezen_colindex = Store.visibledatacolumn.length - 1;
      }

      let column_px = Store.visibledatacolumn[column],
        freezen_px = Store.visibledatacolumn[freezen_colindex];

      if (column_px <= freezen_px + top) {
        setTimeout(function () {
          $("#luckysheet-scrollbar-x").scrollLeft(0);
        }, 100);
      }
    }

    if (_this.freezenhorizontaldata != null) {
      let freezen_rowindex = _this.freezenhorizontaldata[1];

      let offset = luckysheet_searcharray(
        _this.freezenhorizontaldata[3],
        $("#luckysheet-cell-main").scrollTop()
      );

      let left = _this.freezenhorizontaldata[4];

      freezen_rowindex += offset;

      if (row >= Store.visibledatarow.length) {
        row = Store.visibledatarow.length - 1;
      }

      if (freezen_rowindex >= Store.visibledatarow.length) {
        freezen_rowindex = Store.visibledatarow.length - 1;
      }

      let row_px = Store.visibledatarow[row],
        freezen_px = Store.visibledatarow[freezen_rowindex];

      if (row_px <= freezen_px + left) {
        setTimeout(function () {
          $("#luckysheet-scrollbar-y").scrollTop(0);
        }, 100);
      }
    }
  },
  cancelFreezenHorizontal: function (sheetIndex) {
    let _this = this;
    const uuidInline = getComputedInlineClassStyling(`
    &.select-none {
      user-select: none;
    }

  `);
    // $("#luckysheet-freezen-btn-horizontal").html('<i class="luckysheet-icon-img-container iconfont-luckysheet luckysheet-iconfont-dongjie1"></i> '+locale().freezen.default);

    // 解决freeze 不垂直居中的问题
    const freezeHTML = `
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block  ${uuidInline} select-none">
                    <div class="luckysheet-icon luckysheet-inline-block  ${uuidInline} select-none" >
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-function iconfont-luckysheet luckysheet-iconfont-dongjie1  ${uuidInline} select-none">
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block  ${uuidInline} select-none">
                        ${locale().freezen.default}
                    </div>
                </div>
            </div>
        `;

    $("#luckysheet-freezen-btn-horizontal").html(freezeHTML);

    _this.freezenhorizontaldata = null;
    let ishorizontal = $("#luckysheet-freezebar-horizontal").is(":visible");
    $("#luckysheet-freezebar-horizontal").hide();

    if (sheetIndex == null) {
      sheetIndex = Store.currentSheetIndex;
    }

    let currentSheet = Store.luckysheetfile[getSheetIndex(sheetIndex)];
    if (currentSheet.freezen != null) {
      currentSheet.freezen.horizontal = null;
    }

    if (currentSheet.frozen != null && ishorizontal) {
      server.saveParam("all", sheetIndex, currentSheet.frozen, { k: "frozen" });
    }
  },
  createFreezenHorizontal: function (freezenhorizontaldata, top) {
    let _this = this;

    if (_this.initialHorizontal) {
      _this.initialHorizontal = false;
      $("#luckysheet-grid-window-1").append(_this.freezenHorizontalHTML);

      $("#luckysheet-freezebar-horizontal")
        .find(".luckysheet-freezebar-horizontal-drop")
        .hover(
          function () {
            $(this).parent().addClass("luckysheet-freezebar-hover");
          },
          function () {
            $(this).parent().removeClass("luckysheet-freezebar-hover");
          }
        );

      $("#luckysheet-freezebar-horizontal")
        .find(".luckysheet-freezebar-horizontal-drop")
        .mousedown(function () {
          _this.horizontalmovestate = true;
          _this.horizontalmoveposition = $(this).position().top;
          _this.windowHeight = $("#luckysheet-grid-window-1").height();
          const uuidInline = getComputedInlineClassStyling(`
          &.cursor {
            cursor : -webkit-grabbing;
          }
      
        `);
          $(this).parent().addClass("luckysheet-freezebar-active");
          $("#luckysheet-freezebar-horizontal")
            .find(".luckysheet-freezebar-horizontal-handle")
            .addClass(uuidInline + " cursor");
        });

      let gridwidth = $("#luckysheet-grid-window-1").width();
      const uuidInline = getComputedInlineClassStyling(`
        &.cursorKit {
          width: ${gridwidth - 10}px;
          height: 4px;
          cursor: -webkit-grab;
          left: 0px;
        }
    
      `);
      $("#luckysheet-freezebar-horizontal")
        .find(".luckysheet-freezebar-horizontal-handle")
        .addClass(uuidInline + " cursorKit")
        .end()
        .find(".luckysheet-freezebar-horizontal-drop")
        .addClass(uuidInline + " cursorKit");
    }

    if (freezenhorizontaldata == null) {
      let dataset_row_st;
      if (_this.freezenRealFirstRowColumn) {
        dataset_row_st = 0;
        top =
          Store.visibledatarow[dataset_row_st] - 2 + Store.columnHeaderHeight;
        freezenhorizontaldata = [
          Store.visibledatarow[dataset_row_st],
          dataset_row_st + 1,
          0,
          _this.cutVolumn(Store.visibledatarow, dataset_row_st + 1),
          top,
        ];
        _this.saveFreezen(freezenhorizontaldata, top, null, null);
        // todo: 没有下面代码 如果有滚动，冻结之后首行的行号仍显示的之前滚动的行号
        // todo: 不 setTimeout 这里直接刷新的话，冻结的首行显示有问题，没有列的分割线
        setTimeout(() => {
          luckysheetFreezen.createAssistCanvas();
          luckysheetrefreshgrid();
        });
      } else {
        let scrollTop = $("#luckysheet-cell-main").scrollTop();
        dataset_row_st = luckysheet_searcharray(
          Store.visibledatarow,
          scrollTop
        );
        if (dataset_row_st == -1) {
          dataset_row_st = 0;
        }

        top =
          Store.visibledatarow[dataset_row_st] -
          2 -
          scrollTop +
          Store.columnHeaderHeight;
        freezenhorizontaldata = [
          Store.visibledatarow[dataset_row_st],
          dataset_row_st + 1,
          scrollTop,
          _this.cutVolumn(Store.visibledatarow, dataset_row_st + 1),
          top,
        ];
        _this.saveFreezen(freezenhorizontaldata, top, null, null);
      }
    }

    _this.freezenhorizontaldata = freezenhorizontaldata;

    // $("#luckysheet-freezen-btn-horizontal").html('<i class="fa fa-list-alt"></i> '+locale().freezen.freezenCancel);

    // $("#luckysheet-freezen-btn-horizontal").html('<i class="luckysheet-icon-img-container iconfont-luckysheet luckysheet-iconfont-dongjie1"></i> '+locale().freezen.freezenCancel);
    const uuidInline = getComputedInlineClassStyling(`
    &.select-none {
      user-select: none;
    }

  `);
    const freezeHTML = `
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block ${uuidInline} select-none ">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block ${uuidInline} select-none ">
                    <div class="luckysheet-icon luckysheet-inline-block ${uuidInline} select-none " >
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-function iconfont-luckysheet luckysheet-iconfont-dongjie1 ${uuidInline} select-none ">
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block ${uuidInline} select-none ">
                        ${locale().freezen.freezenCancel}
                    </div>
                </div>
            </div>
        `;

    $("#luckysheet-freezen-btn-horizontal").html(freezeHTML);
    const uuidInlineOne = getComputedInlineClassStyling(`
    &.layoutPosition {
      user-select: none;
    }

  `);
    $("#luckysheet-freezebar-horizontal")
      .show()
      .find(".luckysheet-freezebar-horizontal-handle")
      .addClass(uuidInlineOne + " layoutPosition")
      .end()
      .find(".luckysheet-freezebar-horizontal-drop")
      .addClass(uuidInlineOne + " layoutPosition");
  },
  createAssistCanvas: function () {
    let _this = this;
    _this.removeAssistCanvas();

    if (
      _this.freezenverticaldata != null ||
      _this.freezenhorizontaldata != null
    ) {
      let freezen_horizon_px, freezen_horizon_ed, freezen_horizon_scrollTop;
      let freezen_vertical_px, freezen_vertical_ed, freezen_vertical_scrollTop;
      let drawWidth = Store.luckysheetTableContentHW[0],
        drawHeight = Store.luckysheetTableContentHW[1];

      //双向freezen
      if (
        _this.freezenverticaldata != null &&
        _this.freezenhorizontaldata != null
      ) {
        freezen_horizon_px = _this.freezenhorizontaldata[0];
        freezen_horizon_ed = _this.freezenhorizontaldata[1];
        freezen_horizon_scrollTop = _this.freezenhorizontaldata[2];

        freezen_vertical_px = _this.freezenverticaldata[0];
        freezen_vertical_ed = _this.freezenverticaldata[1];
        freezen_vertical_scrollTop = _this.freezenverticaldata[2];

        //3
        _this.createCanvas(
          "freezen_3",
          freezen_vertical_px - freezen_vertical_scrollTop,
          freezen_horizon_px - freezen_horizon_scrollTop + 1,
          Store.rowHeaderWidth - 1,
          Store.columnHeaderHeight - 1
        );
        //4
        _this.createCanvas(
          "freezen_4",
          drawWidth - freezen_vertical_px + freezen_vertical_scrollTop,
          freezen_horizon_px - freezen_horizon_scrollTop + 1,
          freezen_vertical_px -
            freezen_vertical_scrollTop +
            Store.rowHeaderWidth -
            1,
          Store.columnHeaderHeight - 1
        );
        //7
        _this.createCanvas(
          "freezen_7",
          freezen_vertical_px - freezen_vertical_scrollTop,
          drawHeight -
            freezen_horizon_px +
            freezen_horizon_scrollTop -
            Store.columnHeaderHeight,
          Store.rowHeaderWidth - 1,
          freezen_horizon_px -
            freezen_horizon_scrollTop +
            Store.columnHeaderHeight -
            1
        );
      }
      //水平freezen
      else if (_this.freezenhorizontaldata != null) {
        freezen_horizon_px = _this.freezenhorizontaldata[0];
        freezen_horizon_ed = _this.freezenhorizontaldata[1];
        freezen_horizon_scrollTop = _this.freezenhorizontaldata[2];

        _this.createCanvas(
          "freezen_h",
          drawWidth,
          freezen_horizon_px - freezen_horizon_scrollTop + 1,
          Store.rowHeaderWidth - 1,
          Store.columnHeaderHeight - 1
        );
      }
      //垂直freezen
      else if (_this.freezenverticaldata != null) {
        freezen_vertical_px = _this.freezenverticaldata[0];
        freezen_vertical_ed = _this.freezenverticaldata[1];
        freezen_vertical_scrollTop = _this.freezenverticaldata[2];

        _this.createCanvas(
          "freezen_v",
          freezen_vertical_px - freezen_vertical_scrollTop,
          drawHeight,
          Store.rowHeaderWidth - 1,
          Store.columnHeaderHeight - 1
        );
      }

      _this.scrollAdapt();
    }
  },
  createCanvas: function (id, width, height, left, top) {
    const uuidInline = getComputedInlineClassStyling(`
    &.layout {
      user-select: none;
      postion: absolute;
      left: ${left}px;
      top: ${top}px;
      width: ${width}px;
      height: ${height}px;
      z-index: 10;
      pointer-events: none;
    }

  `);
    let c = $("<canvas/>")
      .appendTo("#luckysheet-grid-window-1")
      .attr({
        id: id,
        width: Math.ceil(width * Store.devicePixelRatio),
        height: Math.ceil(height * Store.devicePixelRatio),
      })
      .addClass(uuidInline + " layout");
  },
  removeAssistCanvas: function () {
    const uuidInline = getComputedInlineClassStyling(`
    &.layout {

      z-index: 15;
    }
  `);
    $("#luckysheet-grid-window-1 > canvas")
      .not($("#luckysheetTableContent"))
      .remove();
    $("#luckysheet-cell-selected").addClass(uuidInline + " layout");
  },
  scrollAdapt: function () {
    let _this = this;

    //有冻结时 选区框 滚动适应
    if (
      Store.luckysheet_select_save != null &&
      Store.luckysheet_select_save.length > 0
    ) {
      _this.scrollAdaptOfselect();
    }

    //有冻结时 图片 滚动适应
    if (
      $(".luckysheet-modal-dialog-image").length > 0 &&
      imageCtrl.images != undefined
    ) {
      _this.scrollAdaptOfImage();
    }

    //有冻结时 图表框 滚动适应
    if (
      $("#luckysheet-cell-main .luckysheet-data-visualization-chart").length > 0
    ) {
      // 当前sheet有图表才需要滚动适应
      const chart =
        Store.luckysheetfile[getSheetIndex(Store.currentSheetIndex)]["chart"];

      if (chart != null && chart.length > 0) {
        _this.scrollAdaptOfchart();
      }
    }

    //有冻结时 批注框 滚动适应
    if ($("#luckysheet-postil-showBoxs .luckysheet-postil-show").length > 0) {
      _this.scrollAdaptOfpostil();
    }

    //有冻结时 下拉选区图标 滚动适应
    if ($("#luckysheet-dropCell-icon").length > 0) {
      _this.scrollAdaptOfdpicon();
    }

    //有冻结时 筛选下拉按钮 滚动适应
    if (
      $(
        "#luckysheet-filter-options-sheet" +
          Store.currentSheetIndex +
          " .luckysheet-filter-options"
      ).length > 0
    ) {
      _this.scrollAdaptOffilteroptions();
    }
  },
  scrollAdaptOfselect: function () {
    let _this = this;

    if ($("#luckysheet-row-count-show").is(":visible")) {
      $("#luckysheet-row-count-show").hide();
    }

    if ($("#luckysheet-column-count-show").is(":visible")) {
      $("#luckysheet-column-count-show").hide();
    }

    $("#luckysheet-rows-h-selected").empty();
    $("#luckysheet-cols-h-selected").empty();

    let scrollTop = $("#luckysheet-cell-main").scrollTop();
    let scrollLeft = $("#luckysheet-cell-main").scrollLeft();

    if (
      _this.freezenhorizontaldata != null &&
      _this.freezenverticaldata != null
    ) {
      let freezenTop = _this.freezenhorizontaldata[0];
      let freezen_rowindex = _this.freezenhorizontaldata[1];
      let offTop = scrollTop - _this.freezenhorizontaldata[2];

      let freezenLeft = _this.freezenverticaldata[0];
      let freezen_colindex = _this.freezenverticaldata[1];
      let offLeft = scrollLeft - _this.freezenverticaldata[2];

      for (let s = 0; s < Store.luckysheet_select_save.length; s++) {
        let obj = $.extend(true, {}, Store.luckysheet_select_save[s]);

        let r1 = obj.row[0],
          r2 = obj.row[1];

        let row = Store.visibledatarow[r2],
          row_pre = r1 - 1 == -1 ? 0 : Store.visibledatarow[r1 - 1];

        let top_move = row_pre;
        let height_move = row - row_pre - 1;

        let rangeshow = true;

        if (r1 >= freezen_rowindex) {
          //原选区在冻结区外
          if (top_move + height_move < freezenTop + offTop) {
            rangeshow = false;
          } else if (top_move < freezenTop + offTop) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${freezenTop + offTop}px;
              height: ${height_move - (freezenTop + offTop - top_move)}px;
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${top_move}px;
              height: ${height_move}px;
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          }
        } else if (r2 >= freezen_rowindex) {
          //原选区有一部分在冻结区内
          if (top_move + height_move < freezenTop + offTop) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${top_move + offTop}px;
              height: ${freezenTop - top_move}px;
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${top_move + offTop}px;
              height: ${height_move - offTop}px;
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          }
        } else {
          //原选区在冻结区内
          const uuidInline = getComputedInlineClassStyling(`
          &.layout {
            top: ${top_move + offTop}px;
    
          }
        `);
          $("#luckysheet-cell-selected-boxs")
            .find(".luckysheet-cell-selected")
            .eq(s)
            .show()
            .addClass(uuidInline + " layout");
        }

        let c1 = obj.column[0],
          c2 = obj.column[1];

        let col = Store.visibledatacolumn[c2],
          col_pre = c1 - 1 == -1 ? 0 : Store.visibledatacolumn[c1 - 1];

        let left_move = col_pre;
        let width_move = col - col_pre - 1;

        if (c1 >= freezen_colindex) {
          //原选区在冻结区外
          if (left_move + width_move < freezenLeft + offLeft) {
            rangeshow = false;
          } else if (left_move < freezenLeft + offLeft) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              left: ${freezenLeft + offLeft}px;
              width: ${width_move - (freezenLeft + offLeft - left_move)}px;
      
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              left: ${left_move}px;
              width: ${width_move}px;
      
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          }
        } else if (c2 >= freezen_colindex) {
          //原选区有一部分在冻结区内
          if (left_move + width_move < freezenLeft + offLeft) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              left: ${left_move + offLeft}px;
              width: ${freezenLeft - left_move}px;
      
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              left: ${left_move + offLeft}px;
              width: ${width_move - offLeft}px;
      
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          }
        } else {
          const uuidInline = getComputedInlineClassStyling(`
          &.layout {
            left: ${left_move + offLeft}px;

    
          }
        `);
          //原选区在冻结区内
          $("#luckysheet-cell-selected-boxs")
            .find(".luckysheet-cell-selected")
            .eq(s)
            .show()
            .addClass(uuidInline + " layout");
        }

        if (!rangeshow) {
          $("#luckysheet-cell-selected-boxs")
            .find(".luckysheet-cell-selected")
            .eq(s)
            .hide();
        }

        if (s == Store.luckysheet_select_save.length - 1) {
          let rf = obj.row_focus == null ? r1 : obj.row_focus;
          let cf = obj.column_focus == null ? c1 : obj.column_focus;

          let row_f = Store.visibledatarow[rf],
            row_pre_f = rf - 1 == -1 ? 0 : Store.visibledatarow[rf - 1];
          let col_f = Store.visibledatacolumn[cf],
            col_pre_f = cf - 1 == -1 ? 0 : Store.visibledatacolumn[cf - 1];

          let margeset = menuButton.mergeborer(Store.flowdata, rf, cf);
          if (!!margeset) {
            row_f = margeset.row[1];
            row_pre_f = margeset.row[0];

            col_f = margeset.column[1];
            col_pre_f = margeset.column[0];
          }

          let top = row_pre_f;
          let height = row_f - row_pre_f - 1;

          let left = col_pre_f;
          let width = col_f - col_pre_f - 1;

          let focuscell = true;

          if (top >= freezenTop) {
            if (top + height < freezenTop + offTop) {
              focuscell = false;
            } else if (top < freezenTop + offTop) {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                top: ${freezenTop + offTop}px;
                height: ${height - (freezenTop + offTop - top)}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            } else {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                top: ${top}px;;
                height:${height}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            }
          } else if (top + height >= freezenTop) {
            if (top + height < freezenTop + offTop) {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                top: ${top + offTop}px;
                height:${freezenTop - top}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            } else {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                top: ${top + offTop}px;
                height:${height - offTop}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            }
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${top + offTop}px;
 
            }
          `);
            $("#luckysheet-cell-selected-focus")
              .show()
              .addClass(uuidInline + " layout");
          }

          if (left >= freezenLeft) {
            if (left + width < freezenLeft + offLeft) {
              focuscell = false;
            } else if (left < freezenLeft + offLeft) {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                left: ${freezenLeft + offLeft};
                width: ${width - (freezenLeft + offLeft - left)}px
   
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            } else {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                left: ${left}px;
                width: ${width}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            }
          } else if (left + width >= freezenLeft) {
            if (left + width < freezenLeft + offLeft) {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                left: ${left + offLeft}px;
                width: ${freezenLeft - left}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            } else {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                left: ${left + offLeft}px;
                width: ${width - offLeft}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            }
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              left: ${left + offLeft}px;
            }
          `);
            $("#luckysheet-cell-selected-focus")
              .show()
              .addClass(uuidInline + " layout");
          }

          if (!focuscell) {
            $("#luckysheet-cell-selected-focus").hide();
          }
        }
      }
    } else if (_this.freezenhorizontaldata != null) {
      let freezenTop = _this.freezenhorizontaldata[0];
      let freezen_rowindex = _this.freezenhorizontaldata[1];
      let offTop = scrollTop - _this.freezenhorizontaldata[2];

      for (let s = 0; s < Store.luckysheet_select_save.length; s++) {
        let obj = $.extend(true, {}, Store.luckysheet_select_save[s]);

        let r1 = obj.row[0],
          r2 = obj.row[1];

        let row = Store.visibledatarow[r2],
          row_pre = r1 - 1 == -1 ? 0 : Store.visibledatarow[r1 - 1];

        let top_move = row_pre;
        let height_move = row - row_pre - 1;

        if (r1 >= freezen_rowindex) {
          //原选区在冻结区外
          if (top_move + height_move < freezenTop + offTop) {
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .hide();
          } else if (top_move < freezenTop + offTop) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${freezenTop + offTop}px;
              height: ${height_move - (freezenTop + offTop - top_move)}px;
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${top_move};
              height: ${height_move};
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          }
        } else if (r2 >= freezen_rowindex) {
          //原选区有一部分在冻结区内
          if (top_move + height_move < freezenTop + offTop) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${top_move + offTop}px;
              height: ${freezenTop - top_move}px
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${top_move + offTop}px;
              height: ${height_move - offTop}px;
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          }
        } else {
          const uuidInline = getComputedInlineClassStyling(`
          &.layout {
            top: ${top_move + offTop}px;
      
          }
        `);
          //原选区在冻结区内
          $("#luckysheet-cell-selected-boxs")
            .find(".luckysheet-cell-selected")
            .eq(s)
            .show()
            .addClass(uuidInline + " layout");
        }

        if (s == Store.luckysheet_select_save.length - 1) {
          let rf = obj.row_focus == null ? r1 : obj.row_focus;
          let cf = obj.column_focus == null ? obj.column[0] : obj.column_focus;

          let row_f = Store.visibledatarow[rf],
            row_pre_f = rf - 1 == -1 ? 0 : Store.visibledatarow[rf - 1];

          let margeset = menuButton.mergeborer(Store.flowdata, rf, cf);
          if (!!margeset) {
            row_f = margeset.row[1];
            row_pre_f = margeset.row[0];
          }

          let top = row_pre_f;
          let height = row_f - row_pre_f - 1;

          if (top >= freezenTop) {
            if (top + height < freezenTop + offTop) {
              $("#luckysheet-cell-selected-focus").hide();
            } else if (top < freezenTop + offTop) {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                top: ${freezenTop + offTop}px;
                height: ${height - (freezenTop + offTop - top)}px
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            } else {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                top: ${top}px;
                height: ${height}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            }
          } else if (top + height >= freezenTop) {
            if (top + height < freezenTop + offTop) {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                top: ${top + offTop}px;
                height: ${freezenTop - top}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            } else {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                top: ${top + offTop}px;
                height: ${height - offTop}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            }
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${top + offTop}px;
            }
          `);
            $("#luckysheet-cell-selected-focus")
              .show()
              .addClass(uuidInline + " layout");
          }
        }
      }
    } else if (_this.freezenverticaldata != null) {
      let freezenLeft = _this.freezenverticaldata[0];
      let freezen_colindex = _this.freezenverticaldata[1];
      let offLeft = scrollLeft - _this.freezenverticaldata[2];

      for (let s = 0; s < Store.luckysheet_select_save.length; s++) {
        let obj = $.extend(true, {}, Store.luckysheet_select_save[s]);

        let c1 = obj.column[0],
          c2 = obj.column[1];

        let col = Store.visibledatacolumn[c2],
          col_pre = c1 - 1 == -1 ? 0 : Store.visibledatacolumn[c1 - 1];

        let left_move = col_pre;
        let width_move = col - col_pre - 1;

        if (c1 >= freezen_colindex) {
          //原选区在冻结区外
          if (left_move + width_move < freezenLeft + offLeft) {
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .hide();
          } else if (left_move < freezenLeft + offLeft) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              left: ${freezenLeft + offLeft}px
              width: ${width_move - (freezenLeft + offLeft - left_move)}px
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              left: ${left_move}px;
              width: ${width_move}px;
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          }
        } else if (c2 >= freezen_colindex) {
          //原选区有一部分在冻结区内
          if (left_move + width_move < freezenLeft + offLeft) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              left: ${left_move + offLeft}px;
              width: ${freezenLeft - left_move}px;
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              left: ${left_move + offLeft}px;
              width: ${width_move - offLeft}px;
            }
          `);
            $("#luckysheet-cell-selected-boxs")
              .find(".luckysheet-cell-selected")
              .eq(s)
              .show()
              .addClass(uuidInline + " layout");
          }
        } else {
          const uuidInline = getComputedInlineClassStyling(`
          &.layout {
            left: ${left_move + offLeft}px;
  
          }
        `);
          //原选区在冻结区内
          $("#luckysheet-cell-selected-boxs")
            .find(".luckysheet-cell-selected")
            .eq(s)
            .show()
            .addClass(uuidInline + " layout");
        }

        if (s == Store.luckysheet_select_save.length - 1) {
          let rf = obj.row_focus == null ? obj.row[0] : obj.row_focus;
          let cf = obj.column_focus == null ? c1 : obj.column_focus;

          let col_f = Store.visibledatacolumn[cf],
            col_pre_f = cf - 1 == -1 ? 0 : Store.visibledatacolumn[cf - 1];

          let margeset = menuButton.mergeborer(Store.flowdata, rf, cf);
          if (!!margeset) {
            col_f = margeset.column[1];
            col_pre_f = margeset.column[0];
          }

          let left = col_pre_f;
          let width = col_f - col_pre_f - 1;

          if (left >= freezenLeft) {
            if (left + width < freezenLeft + offLeft) {
              $("#luckysheet-cell-selected-focus").hide();
            } else if (left < freezenLeft + offLeft) {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                left: ${freezenLeft + offLeft}px;
                width: ${width - (freezenLeft + offLeft - left)}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            } else {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                left: ${left}px;
                width: ${width}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            }
          } else if (left + width >= freezenLeft) {
            if (left + width < freezenLeft + offLeft) {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                left: ${left}px;
                width: ${width}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            } else {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                left: ${left + offLeft}px;
                width: ${width - offLeft}px;
              }
            `);
              $("#luckysheet-cell-selected-focus")
                .show()
                .addClass(uuidInline + " layout");
            }
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              left: ${left + offLeft}px;
     
            }
          `);
            $("#luckysheet-cell-selected-focus")
              .show()
              .addClass(uuidInline + " layout");
          }
        }
      }
    } else {
      selectHightlightShow();
    }
  },
  scrollAdaptOfImage: function () {
    let _this = this;

    var images = imageCtrl.images;

    let scrollTop = $("#luckysheet-cell-main").scrollTop();
    let scrollLeft = $("#luckysheet-cell-main").scrollLeft();

    let freezenTop =
      _this.freezenhorizontaldata != null
        ? _this.freezenhorizontaldata[0] - _this.freezenhorizontaldata[2]
        : -1;
    let freezenLeft =
      _this.freezenverticaldata != null
        ? _this.freezenverticaldata[0] - _this.freezenverticaldata[2]
        : -1;

    let zoomRatio = Store.zoomRatio;

    $.each(images, function (i) {
      let image = images[i];
      let dialogImage = $("#" + i);
      let x = dialogImage.position();

      let width = dialogImage.width();
      let height = dialogImage.height();
      let defaultTop = image.default.top * zoomRatio;
      let defaultLeft = image.default.left * zoomRatio;

      let isHidden = false;

      //行冻结
      if (defaultTop >= freezenTop) {
        //原图片在冻结区外
        if (x.top < freezenTop) {
          const uuidInline = getComputedInlineClassStyling(`
          &.layout {
            visibility: hidden;
   
          }
        `);
          //在界面上的位置已经进入冻结区里面了
          dialogImage.addClass(uuidInline + " layout");
          isHidden = true;
        } else {
          const uuidInline = getComputedInlineClassStyling(`
          &.layout {
            visibility: visible;
   
          }
        `);
          dialogImage.addClass(uuidInline + " layout");
        }
      } else {
        const uuidInline = getComputedInlineClassStyling(`
        &.layout {
          visibility: visible;
          top: ${defaultTop + scrollTop}px;
          height: ${height}px;
        }
      `);
        //原图片在冻结区内
        dialogImage.addClass(uuidInline + " layout");
      }

      //列冻结
      if (!isHidden) {
        if (defaultLeft >= freezenLeft) {
          //原图片在冻结区外
          if (x.left < freezenLeft) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              visibility: hidden;
     
            }
          `);
            //在界面上的位置已经进入冻结区里面了
            dialogImage.addClass(uuidInline + " layout");
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              visibility: visible;
     
            }
          `);
            dialogImage.addClass(uuidInline + " layout");
          }
        } else {
          const uuidInline = getComputedInlineClassStyling(`
          &.layout {
            visibility: visible;
            left: ${defaultLeft + scrollLeft}px;
            width: ${width}px;
          }
        `);
          //原图片在冻结区内
          dialogImage.addClass(uuidInline + " layout");
        }
      }
    });
  },
  scrollAdaptOfchart: function () {
    let _this = this;

    let scrollTop = $("#luckysheet-cell-main").scrollTop();
    let scrollLeft = $("#luckysheet-cell-main").scrollLeft();

    if (
      _this.freezenhorizontaldata != null &&
      _this.freezenverticaldata != null
    ) {
      let freezenTop =
        _this.freezenhorizontaldata[0] - _this.freezenhorizontaldata[2];
      let freezenLeft =
        _this.freezenverticaldata[0] - _this.freezenverticaldata[2];

      $("#luckysheet-cell-main .luckysheet-data-visualization-chart").each(
        function (i, e) {
          let x = $(e).position();
          let width = $(e).width();
          let height = $(e).height();

          let $canvas_width = $(e).find("canvas").width();
          let $canvas_height = $(e).find("canvas").height();

          let height_diff = $canvas_height - height;
          let width_diff = $canvas_width - width;

          if (x.top - height_diff < freezenTop) {
            let size = freezenTop - (x.top - height_diff);

            if (size > $canvas_height + 40 + 2) {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                visibility: hidden;
           
              }
            `);
              $(e).addClass(uuidInline + " layout");
            } else {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                top: ${freezenTop + scrollTop}px;
                height: ${$canvas_height - size}px;
                visibility: visible;
              }
              &.layout-position {
                top: ${-size}px;
              }
            `);
              $(e).addClass(uuidInline + " layout");
              $(e)
                .find("canvas")
                .addClass(uuidInline + " layout-position");
            }
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout {
              top: ${x.top - height_diff + scrollTop}px;
              height: ${$canvas_height}px;
              visibility: visible;
            }
            &.layout-position {
              top: 0px;
            }
          `);
            $(e).addClass(uuidInline + " layout");
            $(e)
              .find("canvas")
              .addClass(uuidInline + " layout-position");
          }

          if (x.left - width_diff < freezenLeft) {
            let size = freezenLeft - (x.left - width_diff);

            if (size > $canvas_width + 20 + 2) {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
        
                visibility: hidden;
              }
            `);
              $(e).addClass(uuidInline + " layout");
            } else {
              const uuidInline = getComputedInlineClassStyling(`
              &.layout {
                left: ${freezenLeft + scrollLeft}px;
                width: ${$canvas_width - size}px;
                visibility:visible;
              }
            `);
              $(e).addClass(uuidInline + " layout");
              const uuidInlineOne = getComputedInlineClassStyling(`
                &.layout {
                  left: ${-size}px;
                 
                }
              `);
              $(e)
                .find("canvas")
                .addClass(uuidInlineOne + " layout");
            }
          } else {
            const uuidInlineOne = getComputedInlineClassStyling(`
            &.layout {
              left:${x.left - width_diff + scrollLeft}px;
              width: ${$canvas_width};
              visibility: visible;
            }
            &.layout-position {
              left: 0px;
            }
          `);
            $(e).addClass(uuidInlineOne + " layout");
            $(e)
              .find("canvas")
              .addClass(uuidInlineOne + " layout-position");
          }
        }
      );
    } else if (_this.freezenhorizontaldata != null) {
      let freezenTop =
        _this.freezenhorizontaldata[0] - _this.freezenhorizontaldata[2];

      $("#luckysheet-cell-main .luckysheet-data-visualization-chart").each(
        function (i, e) {
          let x = $(e).position();
          let height = $(e).height();

          let $canvas_height = $(e).find("canvas").height();

          let height_diff = $canvas_height - height;

          if (x.top - height_diff < freezenTop) {
            let size = freezenTop - (x.top - height_diff);

            if (size > $canvas_height + 40 + 2) {
              const uuidInlineOne = getComputedInlineClassStyling(`
              &.hidden {
                visibility : hidden;
              }
              &.layout {
                top: ${freezenTop + scrollTop}px;
                height:${$canvas_height - size}px;
                visibility: visible;
              }
              &.layout-position {
                left: ${-size}px;
              }
            `);
              $(e).addClass(uuidInlineOne + " hidden");
            } else {
              const uuidInlineOne = getComputedInlineClassStyling(`
              &.hidden {
                visibility : hidden;
              }
              &.layout {
                top: ${freezenTop + scrollTop}px;
                height:${$canvas_height - size}px;
                visibility: visible;
              }
              &.layout-position {
                left: ${-size}px;
              }
            `);
              $(e).addClass(uuidInlineOne + " layout");
              $(e)
                .find("canvas")
                .addClass(uuidInlineOne + " layout-position");
            }
          } else {
            const uuidInlineOne = getComputedInlineClassStyling(`
      
            &.layout {
              top: ${x.top - height_diff + scrollTop}px;
              height:${$canvas_height}px;
              visibility: visible;
            }
            &.layout-position {
              left: 0px;
            }
          `);
            $(e).addClass(uuidInlineOne + " layout");
            $(e)
              .find("canvas")
              .addClass(uuidInlineOne + " layout-position");
          }
        }
      );
    } else if (_this.freezenverticaldata != null) {
      let freezenLeft =
        _this.freezenverticaldata[0] - _this.freezenverticaldata[2];

      $("#luckysheet-cell-main .luckysheet-data-visualization-chart").each(
        function (i, e) {
          let x = $(e).position();
          let width = $(e).width();

          let $canvas_width = $(e).find("canvas").width();

          let width_diff = $canvas_width - width;

          if (x.left - width_diff < freezenLeft) {
            let size = freezenLeft - (x.left - width_diff);

            if (size > $canvas_width + 20 + 2) {
              const uuidInlineOne = getComputedInlineClassStyling(`
              &.hidden {
                visibility : hidden;
              }
              &.layout {
                left: ${freezenLeft + scrollLeft}px
                width: ${$canvas_width - size}px;
                visibility: visible;
              }
              &.layout-position {
                left: ${-size}px;
              }
            `);
              $(e).addClass(uuidInlineOne + " hidden");
            } else {
              const uuidInlineOne = getComputedInlineClassStyling(`
              &.hidden {
                visibility : hidden;
              }
              &.layout {
                left: ${freezenLeft + scrollLeft}px
                width: ${$canvas_width - size}px;
                visibility: visible;
              }
              &.layout-position {
                left: ${-size}px;
              }
            `);
              $(e).addClass(uuidInlineOne + " layout");
              $(e)
                .find("canvas")
                .addClass(uuidInlineOne + " layout-position");
            }
          } else {
            const uuidInlineOne = getComputedInlineClassStyling(`

            &.layout {
              left: ${x.left - width_diff + scrollLeft}px
              width: ${$canvas_width}px;
              visibility: visible;
            }
            &.layout-position {
              left: ${-size}px;
            }
          `);
            $(e).addClass(uuidInlineOne + " layout");
            $(e)
              .find("canvas")
              .addClass(uuidInlineOne + " layout-position");
          }
        }
      );
    } else {
      $("#luckysheet-cell-main .luckysheet-data-visualization-chart").each(
        function (i, e) {
          let x = $(e).position();
          let width = $(e).width();
          let height = $(e).height();

          let $canvas_width = $(e).find("canvas").width();
          let $canvas_height = $(e).find("canvas").height();

          let height_diff = $canvas_height - height;
          let width_diff = $canvas_width - width;
          const uuidInlineOne = getComputedInlineClassStyling(`

          &.layout {
            top: ${x.top - height_diff + scrollTop}px;
            height: ${$canvas_height}px;
            left: ${x.left - width_diff + scrollLeft}px;
            width: ${$canvas_width}px;
            visibility: visible;
          }
          &.layout-position {
            top: 0px;
            left: 0px;
          }
        `);
          $(e).addClass(uuidInlineOne + " layout");

          $(e)
            .find("canvas")
            .addClass(uuidInlineOne + " layout-position");
        }
      );
    }
  },
  scrollAdaptOfpostil: function () {
    let _this = this;

    let scrollTop = $("#luckysheet-cell-main").scrollTop();
    let scrollLeft = $("#luckysheet-cell-main").scrollLeft();

    if (
      _this.freezenhorizontaldata != null &&
      _this.freezenverticaldata != null
    ) {
      let freezenTop = _this.freezenhorizontaldata[0];
      let freezenLeft = _this.freezenverticaldata[0];

      let offTop = scrollTop - _this.freezenhorizontaldata[2];
      let offLeft = scrollLeft - _this.freezenverticaldata[2];

      $("#luckysheet-postil-showBoxs .luckysheet-postil-show").each(function (
        i,
        e
      ) {
        let id = $(e).attr("id");

        let r = id.split("luckysheet-postil-show_")[1].split("_")[0];
        let c = id.split("luckysheet-postil-show_")[1].split("_")[1];

        let postil = Store.flowdata[r][c].ps;

        let row = Store.visibledatarow[r],
          row_pre = r - 1 == -1 ? 0 : Store.visibledatarow[r - 1];
        let col = Store.visibledatacolumn[c],
          col_pre = c - 1 == -1 ? 0 : Store.visibledatacolumn[c - 1];

        let margeset = menuButton.mergeborer(Store.flowdata, r, c);
        if (!!margeset) {
          row = margeset.row[1];
          row_pre = margeset.row[0];

          col = margeset.column[1];
          col_pre = margeset.column[0];
        }

        let toX = col;
        let toY = row_pre;

        let postil_left = postil["left"] == null ? toX + 18 : postil["left"];
        let postil_top = postil["top"] == null ? toY - 18 : postil["top"];
        let postil_width =
          postil["width"] == null
            ? luckysheetPostil.defaultWidth
            : postil["width"];
        let postil_height =
          postil["height"] == null
            ? luckysheetPostil.defaultHeight
            : postil["height"];

        if (postil_top < 0) {
          postil_top = 2;
        }

        let size = luckysheetPostil.getArrowCanvasSize(
          postil_left,
          postil_top,
          toX,
          toY
        );
        let show = true;
        let show2 = true;

        if (r >= _this.freezenhorizontaldata[1]) {
          if (postil_top + postil_height < freezenTop) {
            const uuidInlineOne = getComputedInlineClassStyling(`

            &.layout-position {
              top: ${postil_top + offTop}px;
            }
            &.layout-position-one {
              top: ${size[1] + offTop}px;
            }
          `);
            $(e)
              .show()
              .find(".luckysheet-postil-show-main")
              .addClass(uuidInlineOne + " layout-position");
            $(e)
              .show()
              .find(".arrowCanvas")
              .addClass(uuidInlineOne + " layout-position-one");
          } else {
            if (postil_top < freezenTop + offTop) {
              if (postil_top + postil_height <= freezenTop + offTop) {
                show = false;
              } else {
                const uuidInlineOne = getComputedInlineClassStyling(`

                &.layout-position {
                  top: ${freezenTop + offTop}px;
                  height: ${
                    postil_height - (freezenTop + offTop - postil_top)
                  }px
                }
                &.layout-position-one {
                  margin-top: ${-(freezenTop + offTop - postil_top)}px;
                }
              `);
                $(e)
                  .show()
                  .find(".luckysheet-postil-show-main")
                  .addClass(uuidInlineOne + " layout-position");
                $(e)
                  .show()
                  .find(".formulaInputFocus")
                  .addClass(uuidInlineOne + " layout-position-one");
                $(e).show().find(".arrowCanvas").hide();

                show2 = false;
              }
            } else {
              const uuidInline = getComputedInlineClassStyling(`

                &.layout-position {
                  top: ${postil_top}px;
                  height: ${postil_height}px
                }
                &.layout-position-one {
                  margin-top: 0px;
                }
                &.layout-position-two {
                  top : ${size[1]}px;
                }
              `);
              $(e)
                .show()
                .find(".luckysheet-postil-show-main")
                .addClass(uuidInline + " layout-position");
              $(e)
                .show()
                .find(".formulaInputFocus")
                .addClass(uuidInline + " layout-position-one");
              $(e)
                .show()
                .find(".arrowCanvas")
                .addClass(uuidInline + " layout-position-two");
              // luckysheetPostil.buildPs(r, c, postil);
            }
          }
        } else {
          const uuidInline = getComputedInlineClassStyling(`

           
                &.layout-position-one {
                  top : ${postil_top + offTop}px;
                }
                &.layout-position-two {
                  top : ${size[1] + offTop}px;
                }
              `);
          $(e)
            .show()
            .find(".luckysheet-postil-show-main")
            .addClass(uuidInline + " layout-position-one");
          $(e)
            .show()
            .find(".arrowCanvas")
            .addClass(uuidInline + " layout-position-two");
        }

        if (c >= _this.freezenverticaldata[1]) {
          if (postil_left + postil_width < freezenLeft) {
            const uuidInline = getComputedInlineClassStyling(`

           
            &.layout-position-one {
              left : ${postil_left + offLeft}px;
            }
            &.layout-position-two {
              left : ${size[0] + offLeft}px;
            }
          `);
            $(e)
              .show()
              .find(".luckysheet-postil-show-main")
              .addClass(uuidInline + " layout-position-one");
            $(e)
              .show()
              .find(".arrowCanvas")
              .addClass(uuidInline + " layout-position-two");
          } else {
            if (postil_left < freezenLeft + offLeft) {
              if (postil_left + postil_width <= freezenLeft + offLeft) {
                show = false;
              } else {
                const uuidInline = getComputedInlineClassStyling(`

           
                &.layout-position-one {
                  left : ${freezenLeft + offLeft}px;
                  width: ${
                    postil_width - (freezenLeft + offLeft - postil_left)
                  }px;
                }
                &.layout-position-two {
                  margin-left : ${-(freezenLeft + offLeft - postil_left)}px;
                }
              `);
                $(e)
                  .show()
                  .find(".luckysheet-postil-show-main")
                  .addClass(uuidInline + " layout-position-one");
                $(e)
                  .show()
                  .find(".formulaInputFocus")
                  .addClass(uuidInline + " layout-position-two");
                $(e).show().find(".arrowCanvas").hide();

                show2 = false;
              }
            } else {
              const uuidInline = getComputedInlineClassStyling(`

           
              &.layout-position-one {
                left: ${postil_left}px;
                width: ${postil_width}px;
              }
              &.layout-position-two {
                margin-left :0px;
              } 
              &.layout-position-three {
                left :${size[0]}px;
              }
            `);
              $(e)
                .show()
                .find(".luckysheet-postil-show-main")
                .addClass(uuidInline + " layout-position-one");
              $(e)
                .show()
                .find(".formulaInputFocus")
                .addClass(uuidInline + " layout-position-two");
              $(e)
                .show()
                .find(".arrowCanvas")
                .addClass(uuidInline + " layout-position-three");
              // luckysheetPostil.buildPs(r, c, postil);
            }
          }
        } else {
          const uuidInline = getComputedInlineClassStyling(`

           
          &.layout-position-one {
            left: ${postil_left + offLeft}px;
          }
          &.layout-position-two {
            left :${size[0] + offLeft}px;
          }
        `);
          $(e)
            .show()
            .find(".luckysheet-postil-show-main")
            .addClass(uuidInline + " layout-position-one");
          $(e)
            .show()
            .find(".arrowCanvas")
            .addClass(uuidInline + " layout-position-two");
        }

        if (!show) {
          $(e).hide();
        }

        if (show && show2) {
          $(e).show().find(".arrowCanvas").show();
        }
      });
    } else if (_this.freezenhorizontaldata != null) {
      let freezenTop = _this.freezenhorizontaldata[0];
      let offTop = scrollTop - _this.freezenhorizontaldata[2];

      $("#luckysheet-postil-showBoxs .luckysheet-postil-show").each(function (
        i,
        e
      ) {
        let id = $(e).attr("id");

        let r = id.split("luckysheet-postil-show_")[1].split("_")[0];
        let c = id.split("luckysheet-postil-show_")[1].split("_")[1];

        let postil = Store.flowdata[r][c].ps;

        let row = Store.visibledatarow[r],
          row_pre = r - 1 == -1 ? 0 : Store.visibledatarow[r - 1];
        let col = Store.visibledatacolumn[c],
          col_pre = c - 1 == -1 ? 0 : Store.visibledatacolumn[c - 1];

        let margeset = menuButton.mergeborer(Store.flowdata, r, c);
        if (!!margeset) {
          row = margeset.row[1];
          row_pre = margeset.row[0];

          col = margeset.column[1];
          col_pre = margeset.column[0];
        }

        let toX = col;
        let toY = row_pre;

        let postil_left = postil["left"] == null ? toX + 18 : postil["left"];
        let postil_top = postil["top"] == null ? toY - 18 : postil["top"];
        let postil_width =
          postil["width"] == null
            ? luckysheetPostil.defaultWidth
            : postil["width"];
        let postil_height =
          postil["height"] == null
            ? luckysheetPostil.defaultHeight
            : postil["height"];

        if (postil_top < 0) {
          postil_top = 2;
        }

        let size = luckysheetPostil.getArrowCanvasSize(
          postil_left,
          postil_top,
          toX,
          toY
        );

        if (r >= _this.freezenhorizontaldata[1]) {
          if (postil_top + postil_height < freezenTop) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout-position-one {
              top: ${postil_top + offTop}px;
            }
            &.layout-position-two {
              top :${size[1] + offTop}px;
            }
          `);
            $(e)
              .show()
              .find(".luckysheet-postil-show-main")
              .addClass(uuidInline + " layout-position-one");
            $(e)
              .show()
              .find(".arrowCanvas")
              .addClass(uuidInline + " layout-position-two");
          } else {
            if (postil_top < freezenTop + offTop) {
              if (postil_top + postil_height <= freezenTop + offTop) {
                $(e).hide();
              } else {
                const uuidInline = getComputedInlineClassStyling(`
                &.layout-position-one {
                  top: ${freezenTop + offTop}px;
                  height:${postil_height - (freezenTop + offTop - postil_top)}px
                }
                &.layout-position-two {
                  margin-top :${-(freezenTop + offTop - postil_top)}px;
                }
              `);
                $(e)
                  .show()
                  .find(".luckysheet-postil-show-main")
                  .addClass(uuidInline + " layout-position-one");
                $(e)
                  .show()
                  .find(".formulaInputFocus")
                  .addClass(uuidInline + " layout-position-two");
                $(e).show().find(".arrowCanvas").hide();
              }
            } else {
              luckysheetPostil.buildPs(r, c, postil);
            }
          }
        } else {
          const uuidInline = getComputedInlineClassStyling(`
          &.layout-position-one {
            top: ${postil_top + offTop}px;
    
          }
          &.layout-position-two {
            margin-top :${size[1] + offTop}px;
          }
        `);
          $(e)
            .show()
            .find(".luckysheet-postil-show-main")
            .addClass(uuidInline + " layout-position-one");
          $(e)
            .show()
            .find(".arrowCanvas")
            .addClass(uuidInline + " layout-position-two");
        }
      });
    } else if (_this.freezenverticaldata != null) {
      let freezenLeft = _this.freezenverticaldata[0];
      let offLeft = scrollLeft - _this.freezenverticaldata[2];

      $("#luckysheet-postil-showBoxs .luckysheet-postil-show").each(function (
        i,
        e
      ) {
        let id = $(e).attr("id");

        let r = id.split("luckysheet-postil-show_")[1].split("_")[0];
        let c = id.split("luckysheet-postil-show_")[1].split("_")[1];

        let postil = Store.flowdata[r][c].ps;

        let row = Store.visibledatarow[r],
          row_pre = r - 1 == -1 ? 0 : Store.visibledatarow[r - 1];
        let col = Store.visibledatacolumn[c],
          col_pre = c - 1 == -1 ? 0 : Store.visibledatacolumn[c - 1];

        let margeset = menuButton.mergeborer(Store.flowdata, r, c);
        if (!!margeset) {
          row = margeset.row[1];
          row_pre = margeset.row[0];

          col = margeset.column[1];
          col_pre = margeset.column[0];
        }

        let toX = col;
        let toY = row_pre;

        let postil_left = postil["left"] == null ? toX + 18 : postil["left"];
        let postil_top = postil["top"] == null ? toY - 18 : postil["top"];
        let postil_width =
          postil["width"] == null
            ? luckysheetPostil.defaultWidth
            : postil["width"];
        let postil_height =
          postil["height"] == null
            ? luckysheetPostil.defaultHeight
            : postil["height"];

        if (postil_top < 0) {
          postil_top = 2;
        }

        let size = luckysheetPostil.getArrowCanvasSize(
          postil_left,
          postil_top,
          toX,
          toY
        );

        if (c >= _this.freezenverticaldata[1]) {
          if (postil_left + postil_width < freezenLeft) {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout-position-one {
              left: ${postil_left + offLeft}px;
      
            }
            &.layout-position-two {
              left :${size[0] + offLeft}px;
            }
          `);
            $(e)
              .show()
              .find(".luckysheet-postil-show-main")
              .addClass(uuidInline + " layout-position-one");
            $(e)
              .show()
              .find(".arrowCanvas")
              .addClass(uuidInline + " layout-position-two");
          } else {
            if (postil_left < freezenLeft + offLeft) {
              if (postil_left + postil_width <= freezenLeft + offLeft) {
                $(e).hide();
              } else {
                const uuidInline = getComputedInlineClassStyling(`
                &.layout-position-one {
                  left: ${freezenLeft + offLeft}px;
                  width: ${
                    postil_width - (freezenLeft + offLeft - postil_left)
                  }px;
          
                }
                &.layout-position-two {
                  margin-left :${-(freezenLeft + offLeft - postil_left)}px;
                }
              `);
                $(e)
                  .show()
                  .find(".luckysheet-postil-show-main")
                  .addClass(uuidInline + " layout-position-one");
                $(e)
                  .show()
                  .find(".formulaInputFocus")
                  .addClass(uuidInline + " layout-position-two");
                $(e).show().find(".arrowCanvas").hide();
              }
            } else {
              luckysheetPostil.buildPs(r, c, postil);
            }
          }
        } else {
          const uuidInline = getComputedInlineClassStyling(`
          &.layout-position-one {
            left: ${postil_left + offLeft}px;
          }
          &.layout-position-two {
            left :${size[0] + offLeft}px;
          }
        `);
          $(e)
            .show()
            .find(".luckysheet-postil-show-main")
            .addClass(uuidInline + " layout-position-one");
          $(e)
            .show()
            .find(".arrowCanvas")
            .addClass(uuidInline + " layout-position-two");
        }
      });
    } else {
      $("#luckysheet-postil-showBoxs .luckysheet-postil-show").each(function (
        i,
        e
      ) {
        let id = $(e).attr("id");

        let r = id.split("luckysheet-postil-show_")[1].split("_")[0];
        let c = id.split("luckysheet-postil-show_")[1].split("_")[1];

        let postil = Store.flowdata[r][c].ps;

        luckysheetPostil.buildPs(r, c, postil);
      });
    }
  },
  scrollAdaptOfdpicon: function () {
    let _this = this;

    let copy_r = luckysheetDropCell.copyRange["row"][1],
      copy_c = luckysheetDropCell.copyRange["column"][1];

    let apply_r = luckysheetDropCell.applyRange["row"][1],
      apply_c = luckysheetDropCell.applyRange["column"][1];

    let row_index, col_index;
    if (apply_r >= copy_r && apply_c >= copy_c) {
      row_index = apply_r;
      col_index = apply_c;
    } else {
      row_index = copy_r;
      col_index = copy_c;
    }

    if (
      _this.freezenhorizontaldata != null &&
      _this.freezenverticaldata != null
    ) {
      let freezen_rowindex = _this.freezenhorizontaldata[1];
      let offsetRow = luckysheet_searcharray(
        _this.freezenhorizontaldata[3],
        $("#luckysheet-cell-main").scrollTop() - _this.freezenhorizontaldata[2]
      );
      let freezen_colindex = _this.freezenverticaldata[1];
      let offsetColumn = luckysheet_searcharray(
        _this.freezenverticaldata[3],
        $("#luckysheet-cell-main").scrollLeft() - _this.freezenverticaldata[2]
      );

      if (row_index >= freezen_rowindex && col_index >= freezen_colindex) {
        if (
          row_index < freezen_rowindex + offsetRow - 1 ||
          col_index < freezen_colindex + offsetColumn - 1
        ) {
          $("#luckysheet-dropCell-icon").hide();
        } else {
          $("#luckysheet-dropCell-icon").show();
        }
      } else if (row_index >= freezen_rowindex) {
        if (row_index < freezen_rowindex + offsetRow - 1) {
          $("#luckysheet-dropCell-icon").hide();
        } else {
          let col = colLocationByIndex(col_index + offsetColumn)[1];

          const uuidInline = getComputedInlineClassStyling(`
          &.layout-position-one {
            left: ${col}px;
          }
      
        `);

          $("#luckysheet-dropCell-icon")
            .show()
            .addClass(uuidInline + " layout-position-one");
        }
      } else if (col_index >= freezen_colindex) {
        if (col_index < freezen_colindex + offsetColumn - 1) {
          $("#luckysheet-dropCell-icon").hide();
        } else {
          let row = rowLocationByIndex(row_index + offsetRow)[1];
          const uuidInline = getComputedInlineClassStyling(`
          &.layout-position-one {
            top: ${row}px;
          }
      
        `);
          $("#luckysheet-dropCell-icon")
            .show()
            .addClass(uuidInline + " layout-position-one");
        }
      } else {
        let row = rowLocationByIndex(row_index + offsetRow)[1],
          col = colLocationByIndex(col_index + offsetColumn)[1];

        const uuidInline = getComputedInlineClassStyling(`
          &.layout-position-one {
            left: ${col}px;
            top: ${row}px;
          }
        `);

        $("#luckysheet-dropCell-icon")
          .show()
          .addClass(uuidInline + " layout-position-one");
      }
    } else if (_this.freezenhorizontaldata != null) {
      let freezen_rowindex = _this.freezenhorizontaldata[1];
      let offsetRow = luckysheet_searcharray(
        _this.freezenhorizontaldata[3],
        $("#luckysheet-cell-main").scrollTop() - _this.freezenhorizontaldata[2]
      );

      if (row_index >= freezen_rowindex) {
        if (row_index < freezen_rowindex + offsetRow - 1) {
          $("#luckysheet-dropCell-icon").hide();
        } else {
          $("#luckysheet-dropCell-icon").show();
        }
      } else {
        let row = rowLocationByIndex(row_index + offsetRow)[1];
        const uuidInline = getComputedInlineClassStyling(`
        &.layout-position-one {
          top: ${row}px;
          }
        `);
        $("#luckysheet-dropCell-icon")
          .show()
          .addClass(uuidInline + " layout-position-one");
      }
    } else if (_this.freezenverticaldata != null) {
      let freezen_colindex = _this.freezenverticaldata[1];
      let offsetColumn = luckysheet_searcharray(
        _this.freezenverticaldata[3],
        $("#luckysheet-cell-main").scrollLeft() - _this.freezenverticaldata[2]
      );

      if (col_index >= freezen_colindex) {
        if (col_index < freezen_colindex + offsetColumn - 1) {
          $("#luckysheet-dropCell-icon").hide();
        } else {
          $("#luckysheet-dropCell-icon").show();
        }
      } else {
        let col = colLocationByIndex(col_index + offsetColumn)[1];
        const uuidInline = getComputedInlineClassStyling(`
        &.layout-position-one {
          left: ${col}px;
          }
        `);
        $("#luckysheet-dropCell-icon")
          .show()
          .addClass(uuidInline + " layout-position-one");
      }
    } else {
      let row = rowLocationByIndex(row_index)[1],
        col = colLocationByIndex(col_index)[1];
      const uuidInline = getComputedInlineClassStyling(`
        &.layout-position-one {
          left: ${col}px;
          top : ${row}px;
          }
        `);
      $("#luckysheet-dropCell-icon")
        .show()
        .addClass(uuidInline + " layout-position-one");
    }
  },
  scrollAdaptOffilteroptions: function () {
    let _this = this;

    if (
      _this.freezenhorizontaldata != null &&
      _this.freezenverticaldata != null
    ) {
      let freezen_rowindex = _this.freezenhorizontaldata[1];
      let freezen_top =
        _this.freezenhorizontaldata[0] + $("#luckysheet-cell-main").scrollTop();

      let freezen_colindex = _this.freezenverticaldata[1];
      let offsetColumn = luckysheet_searcharray(
        _this.freezenverticaldata[3],
        $("#luckysheet-cell-main").scrollLeft() - _this.freezenverticaldata[2]
      );

      $(
        "#luckysheet-filter-options-sheet" +
          Store.currentSheetIndex +
          " .luckysheet-filter-options"
      ).each(function (i, e) {
        let row_index = $(e).data("str");
        let top = row_index - 1 == -1 ? 0 : Store.visibledatarow[row_index - 1];

        let col_index = $(e).data("cindex");

        if (row_index >= freezen_rowindex && col_index >= freezen_colindex) {
          if (
            top < freezen_top ||
            col_index < freezen_colindex + offsetColumn
          ) {
            $(e).hide();
          } else {
            $(e).show();
          }
        } else if (row_index >= freezen_rowindex) {
          if (top < freezen_top) {
            $(e).hide();
          } else {
            let left = Store.visibledatacolumn[col_index + offsetColumn] - 20;
            const uuidInline = getComputedInlineClassStyling(`
            &.layout-position-one {
              left: ${left}px;
         
              }
            `);
            $(e)
              .show()
              .addClass(uuidInline + " layout-position-one");
          }
        } else if (col_index >= freezen_colindex) {
          if (col_index < freezen_colindex + offsetColumn) {
            $(e).hide();
          } else {
            const uuidInline = getComputedInlineClassStyling(`
            &.layout-position-one {
              top: ${top + $("#luckysheet-cell-main").scrollTop()}px;
         
              }
            `);
            $(e)
              .show()
              .addClass(uuidInline + " layout-position-one");
          }
        } else {
          let left = Store.visibledatacolumn[col_index + offsetColumn] - 20;
          const uuidInline = getComputedInlineClassStyling(`
          &.layout-position-one {
            left: ${left}px;
            top: ${top + $("#luckysheet-cell-main").scrollTop()}px;
       
            }
          `);
          $(e)
            .show()
            .addClass(uuidInline + " layout-position-one");
        }
      });
    } else if (_this.freezenhorizontaldata != null) {
      let freezen_rowindex = _this.freezenhorizontaldata[1];
      let freezen_top =
        _this.freezenhorizontaldata[0] + $("#luckysheet-cell-main").scrollTop();

      $(
        "#luckysheet-filter-options-sheet" +
          Store.currentSheetIndex +
          " .luckysheet-filter-options"
      ).each(function (i, e) {
        let row_index = $(e).data("str");
        let top = row_index - 1 == -1 ? 0 : Store.visibledatarow[row_index - 1];

        if (row_index >= freezen_rowindex) {
          if (top < freezen_top) {
            $(e).hide();
          } else {
            $(e).show();
          }
        } else {
          const uuidInline = getComputedInlineClassStyling(`
          &.layout-position-one {

            top: ${top + $("#luckysheet-cell-main").scrollTop()}px;
       
            }
          `);
          $(e)
            .show()
            .addClass(uuidInline + " layout-position-one");
        }
      });
    } else if (_this.freezenverticaldata != null) {
      let freezen_colindex = _this.freezenverticaldata[1];
      let offsetColumn = luckysheet_searcharray(
        _this.freezenverticaldata[3],
        $("#luckysheet-cell-main").scrollLeft() - _this.freezenverticaldata[2]
      );

      $(
        "#luckysheet-filter-options-sheet" +
          Store.currentSheetIndex +
          " .luckysheet-filter-options"
      ).each(function (i, e) {
        let col_index = $(e).data("cindex");

        if (col_index >= freezen_colindex) {
          if (col_index < freezen_colindex + offsetColumn) {
            $(e).hide();
          } else {
            $(e).show();
          }
        } else {
          let left = Store.visibledatacolumn[col_index + offsetColumn] - 20;
          const uuidInline = getComputedInlineClassStyling(`
          &.layout-position-one {

            left: ${left}px;
       
            }
          `);
          $(e)
            .show()
            .addClass(uuidInline + " layout-position-one");
        }
      });
    } else {
      $("#luckysheet-filter-options-sheet" + Store.currentSheetIndex).empty();
      createFilterOptions(
        Store.luckysheetfile[getSheetIndex(Store.currentSheetIndex)]
          .filter_select
      );
    }
  },
  /**
   *
   * @param {string} operate  "freezenRow"/ "freezenColumn"......
   * @param {Number | String} order 工作表索引；默认值为当前工作表索引
   * @param {Object} focus 冻结选区时的focus单元格行列值构成的对象；格式为{ row_focus:0, column_focus:0 }
   */
  saveFrozen: function (operate, order, focus = {}) {
    if (order == null) {
      order = getSheetIndex(Store.currentSheetIndex);
    }

    // New configuration attribute of sheet: frozen, which stores more semantic configuration for initialization and transmission to the backend. freezenhorizontaldata is still used as local data

    const select_save =
      Store.luckysheet_select_save[Store.luckysheet_select_save.length - 1];

    const row_focus =
      select_save["row_focus"] == null
        ? select_save["row"][0]
        : select_save["row_focus"];
    const column_focus =
      select_save["column_focus"] == null
        ? select_save["column"][0]
        : select_save["column_focus"];

    const range = {
      row_focus: focus.row_focus || row_focus,
      column_focus: focus.column_focus || column_focus,
    };

    const frozen = {
      freezenRow: {
        type: "row",
      },
      freezenColumn: {
        type: "column",
      },
      freezenRC: {
        type: "both",
      },
      freezenRowRange: {
        type: "rangeRow",
        range: range,
      },
      freezenColumnRange: {
        type: "rangeColumn",
        range: range,
      },
      freezenRCRange: {
        type: "rangeBoth",
        range: range,
      },
      freezenCancel: {
        type: "cancel",
      },
    };

    // store frozen
    Store.luckysheetfile[order]["frozen"] = frozen[operate];
  },
  frozenTofreezen: function () {
    // get frozen type
    let file = Store.luckysheetfile[getSheetIndex(Store.currentSheetIndex)];
    const frozen = file["frozen"];

    if (frozen == null) {
      return;
    }

    let freezen = null;

    // transform to freezen
    if (frozen.type === "row") {
      let scrollTop = 0;
      let row_st = luckysheet_searcharray(Store.visibledatarow, scrollTop);
      if (row_st == -1) {
        row_st = 0;
      }
      let top =
        Store.visibledatarow[row_st] - 2 - scrollTop + Store.columnHeaderHeight;
      let freezenhorizontaldata = [
        Store.visibledatarow[row_st],
        row_st + 1,
        scrollTop,
        luckysheetFreezen.cutVolumn(Store.visibledatarow, row_st + 1),
        top,
      ];

      freezen = {
        horizontal: {
          freezenhorizontaldata: freezenhorizontaldata,
          top: top,
        },
      };
    } else if (frozen.type === "column") {
      let scrollLeft = 0;
      let col_st = luckysheet_searcharray(Store.visibledatacolumn, scrollLeft);
      if (col_st == -1) {
        col_st = 0;
      }
      let left =
        Store.visibledatacolumn[col_st] - 2 - scrollLeft + Store.rowHeaderWidth;
      let freezenverticaldata = [
        Store.visibledatacolumn[col_st],
        col_st + 1,
        scrollLeft,
        luckysheetFreezen.cutVolumn(Store.visibledatacolumn, col_st + 1),
        left,
      ];

      freezen = {
        vertical: {
          freezenverticaldata: freezenverticaldata,
          left: left,
        },
      };
    } else if (frozen.type === "both") {
      let scrollTop = 0;
      let row_st = luckysheet_searcharray(Store.visibledatarow, scrollTop);
      if (row_st == -1) {
        row_st = 0;
      }
      let top =
        Store.visibledatarow[row_st] - 2 - scrollTop + Store.columnHeaderHeight;
      let freezenhorizontaldata = [
        Store.visibledatarow[row_st],
        row_st + 1,
        scrollTop,
        luckysheetFreezen.cutVolumn(Store.visibledatarow, row_st + 1),
        top,
      ];

      let scrollLeft = 0;
      let col_st = luckysheet_searcharray(Store.visibledatacolumn, scrollLeft);
      if (col_st == -1) {
        col_st = 0;
      }
      let left =
        Store.visibledatacolumn[col_st] - 2 - scrollLeft + Store.rowHeaderWidth;
      let freezenverticaldata = [
        Store.visibledatacolumn[col_st],
        col_st + 1,
        scrollLeft,
        luckysheetFreezen.cutVolumn(Store.visibledatacolumn, col_st + 1),
        left,
      ];

      freezen = {
        horizontal: {
          freezenhorizontaldata: freezenhorizontaldata,
          top: top,
        },
        vertical: {
          freezenverticaldata: freezenverticaldata,
          left: left,
        },
      };
    } else if (frozen.type === "rangeRow") {
      let scrollTop = 0;
      let row_st = luckysheet_searcharray(Store.visibledatarow, scrollTop);

      let row_focus = frozen.range["row_focus"];

      if (row_focus > row_st) {
        row_st = row_focus;
      }

      if (row_st == -1) {
        row_st = 0;
      }

      let top =
        Store.visibledatarow[row_st] - 2 - scrollTop + Store.columnHeaderHeight;
      let freezenhorizontaldata = [
        Store.visibledatarow[row_st],
        row_st + 1,
        scrollTop,
        luckysheetFreezen.cutVolumn(Store.visibledatarow, row_st + 1),
        top,
      ];

      freezen = {
        horizontal: {
          freezenhorizontaldata: freezenhorizontaldata,
          top: top,
        },
      };
    } else if (frozen.type === "rangeColumn") {
      let scrollLeft = 0;
      let col_st = luckysheet_searcharray(Store.visibledatacolumn, scrollLeft);

      let column_focus = frozen.range["column_focus"];

      if (column_focus > col_st) {
        col_st = column_focus;
      }

      if (col_st == -1) {
        col_st = 0;
      }

      let left =
        Store.visibledatacolumn[col_st] - 2 - scrollLeft + Store.rowHeaderWidth;
      let freezenverticaldata = [
        Store.visibledatacolumn[col_st],
        col_st + 1,
        scrollLeft,
        luckysheetFreezen.cutVolumn(Store.visibledatacolumn, col_st + 1),
        left,
      ];

      freezen = {
        vertical: {
          freezenverticaldata: freezenverticaldata,
          left: left,
        },
      };
    } else if (frozen.type === "rangeBoth") {
      let scrollTop = 0;
      let row_st = luckysheet_searcharray(Store.visibledatarow, scrollTop);

      let row_focus = frozen.range["row_focus"];

      if (row_focus > row_st) {
        row_st = row_focus;
      }

      if (row_st == -1) {
        row_st = 0;
      }

      let top =
        Store.visibledatarow[row_st] - 2 - scrollTop + Store.columnHeaderHeight;
      let freezenhorizontaldata = [
        Store.visibledatarow[row_st],
        row_st + 1,
        scrollTop,
        luckysheetFreezen.cutVolumn(Store.visibledatarow, row_st + 1),
        top,
      ];

      let scrollLeft = 0;
      let col_st = luckysheet_searcharray(Store.visibledatacolumn, scrollLeft);

      let column_focus = frozen.range["column_focus"];

      if (column_focus > col_st) {
        col_st = column_focus;
      }

      if (col_st == -1) {
        col_st = 0;
      }

      let left =
        Store.visibledatacolumn[col_st] - 2 - scrollLeft + Store.rowHeaderWidth;
      let freezenverticaldata = [
        Store.visibledatacolumn[col_st],
        col_st + 1,
        scrollLeft,
        luckysheetFreezen.cutVolumn(Store.visibledatacolumn, col_st + 1),
        left,
      ];

      freezen = {
        horizontal: {
          freezenhorizontaldata: freezenhorizontaldata,
          top: top,
        },
        vertical: {
          freezenverticaldata: freezenverticaldata,
          left: left,
        },
      };
    } else if (frozen.type === "cancel") {
      freezen = {
        horizontal: null,
        vertical: null,
      };
    }

    file["freezen"] = freezen;
  },
};

export default luckysheetFreezen;
