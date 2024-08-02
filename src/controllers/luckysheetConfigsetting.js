const luckysheetConfigsetting = {
  autoFormatw: false,
  accuracy: undefined,
  total: 0,

  allowCopy: true,
  showtoolbar: true,
  showinfobar: true,
  showsheetbar: true,
  showstatisticBar: true,
  pointEdit: false,
  pointEditUpdate: null,
  pointEditZoom: 1,

  userInfo: false,
  userMenuItem: [],
  myFolderUrl: null,
  functionButton: null,

  showConfigWindowResize: true,
  enableAddRow: true,
  addRowCount: 100,
  enableAddBackTop: true,
  enablePage: true,
  pageInfo: null,

  editMode: false,
  beforeCreateDom: null,
  workbookCreateBefore: null,
  workbookCreateAfter: null,
  remoteFunction: null,
  fireMousedown: null,
  plugins: [],
  forceCalculation: false, //强制刷新公式，公式较多会有性能问题，慎用

  defaultColWidth: 73,
  defaultRowHeight: 19,

  defaultTextColor: "#000",
  defaultCellColor: "#fff",
  cspNonce: "",
};

function generateRandomHexString(numBytes) {
  const bytes = crypto.getRandomValues(new Uint8Array(numBytes));
  const array = Array.from(bytes);
  const hexPairs = array.map(b => b.toString(16).padStart(2, "0"));
  return hexPairs.join("");
}
export const getComputedInlineStyling = inline => {
  var s = document.createElement("style");
  const id = generateRandomHexString(20);
  const nonce = $("meta[property='csp-nonce']").attr("content");
  s.setAttribute("nonce", nonce);
  s.innerHTML = `#${id}{
  ${inline}
  }`;
  document.head.appendChild(s);
  return id;
};

export const getComputedInlineClassStyling = inline => {
  var s = document.createElement("style");
  const id = generateRandomHexString(20);
  const nonce = $("meta[property='csp-nonce']").attr("content");
  s.setAttribute("nonce", nonce);
  s.innerHTML = `.${id}{
  ${inline}
  }`;
  document.head.appendChild(s);
  return id;
};

export default luckysheetConfigsetting;
