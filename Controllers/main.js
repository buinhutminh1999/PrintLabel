/*
Source code được phát triển bởi BuiNhutMinh
*/

const validation = new Validation();
const dssp = new DanhSachSanPham();
let currentEditId = null;

const parseDecimal = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const normalized = val.toString().trim().replace(/,/g, ".");
  const num = Number(normalized);
  return isNaN(num) ? 0 : num;
};

const formatDecimal = (val) => {
  if (val === null || val === undefined || val === "") return "0";
  return val.toString().trim().replace(/\./g, ",");
};

const formatGram = (val) => {
  const num = parseDecimal(val);
  return num.toFixed(3).replace(".", ",");
};

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

window.toggleFullScreen = toggleFullScreen;
document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentEditId !== null) {
        updateSP(currentEditId);
      } else if (document.getElementById("btnThem")) {
        themSP();
      }
    }
  },
  false
);

const getMyEle = (select) => {
  return document.querySelector(select);
};

const getMyEleAll = (select) => {
  return document.querySelectorAll(select);
};

const renderSP = (mang) => {
  console.log("mang", mang);
  if (dssp.mangDS.length == 0) {
    // nếu dữ liệu trống trả về dữ liệu trống
    getMyEle(
      "#tblDanhSachSP"
    ).innerHTML = `<tr><td colspan="7">Dữ liệu trống</td></tr>`;
    getMyEle("#tfDanhSachSP").innerHTML = "";
  } else {
    let count = 0;
    let newArr = mang.map((item, index) => {
      let { inpType, inpHLV, inpKTL, KTLG, inpKLH, KLHG, inpCH, inpKLV, KLVG } =
        item;

      return `<tr onclick="xemSP(${index})">
    <td>${++count}</td>
    <td>${inpType}</td>
    <td>${inpHLV}</td>
    <td>${formatDecimal(inpKTL)} Chỉ - ${formatDecimal(KTLG)} g</td>
    <td>${formatDecimal(inpKLH)} Chỉ - ${formatDecimal(KLHG)} g</td>
    <td>${formatDecimal(inpKLV)} Chỉ - ${formatDecimal(KLVG)} g</td>
    <td>${formatNumberWithCommas(inpCH)}</td>
    <td >
    <button onclick="xoaSP(${index})"><i class="fa-solid fa-trash"></i></button>
    </td>
    </tr>`;
    });
    getMyEle("#tfDanhSachSP").innerHTML = `<tr>
    <td class="text-right" colspan="8">
    <div class="d-flex align-items-center justify-content-end">
    <button onclick="deleteall()">Xóa tất cả</button>
    <a href="./View/printlabel.html" target="_blank" class="printALL">In tất cả</a>
    </div>
    </td>
    </tr>`;
    getMyEle("#tblDanhSachSP").innerHTML = newArr.join("");
  }
};

const printAll = () => {
  let newArr = dssp.mangDS.map((item) => {
    const chFormatted = formatNumberWithCommas(item.inpCH);
    const tienCong = chFormatted ? `${chFormatted} VNĐ` : "0 VNĐ";
    const ktlChi = formatDecimal(item.inpKTL || 0);
    const klhChi = formatDecimal(item.inpKLH || 0);
    const klvChi = formatDecimal(item.inpKLV || 0);
    return ` <div class="label">
  <div class="content__left">
    <p class="product__title">${item.inpType}</p>
    <p class="row-line"><span>KLT: ${formatGram(item.KTLG)} g</span><span>(${ktlChi} Chỉ)</span></p>
    <p class="row-line"><span>KLH: ${formatGram(item.KLHG)} g</span><span>(${klhChi} Chỉ)</span></p>
    <p class="row-line"><span>KLV: ${formatGram(item.KLVG)} g</span><span>(${klvChi} Chỉ)</span></p>
    <p class="row-line row-bottom"><span>TC: ${tienCong}</span><span>HLV: ${item.inpHLV}</span></p>
  </div>
  <div class="content__right">
    <p class="nsx__title">NSX: DNTN TV PHƯƠNG THẢO</p>
    <p>ĐC: 2297 Trần Hưng Đạo, Khóm An Hưng,</p>
    <p>P. Mỹ Thới, T. An Giang, Việt Nam</p>
    <p>TCCS 01:2026/PT</p>
    <p class="row-line"><span>Xuất xứ: Việt Nam</span><span>MKH: PTHAO</span></p>
  </div>
   </div>`;
  });

  document.querySelector(".labelProDuct").innerHTML = newArr.join("");

  getLocal();
};

window.printAll = printAll;

const formatNumberWithCommas = (val) => {
  if (val === null || val === undefined) return "";
  let raw = val.toString().replace(/\D/g, "");
  if (!raw) return "";
  raw = raw.replace(/^0+(?=\d)/, "");
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const setLocal = () => {
  localStorage.setItem("DSSP", JSON.stringify(dssp.mangDS));
};

const getLocal = () => {
  if (localStorage.getItem("DSSP") != null) {
    const rawList = JSON.parse(localStorage.getItem("DSSP"));
    dssp.mangDS = rawList.map((item) => {
      const ktlNum = parseDecimal(item.inpKTL);
      const klhNum = parseDecimal(item.inpKLH);
      return {
        ...item,
        inpKTL: formatDecimal(item.inpKTL || "0"),
        KTLG: formatDecimal(math.round(ktlNum * 3.75, 3)),
        inpKLH: formatDecimal(item.inpKLH || "0"),
        KLHG: formatDecimal(math.round(klhNum * 3.75, 3)),
        inpCH: formatNumberWithCommas(item.inpCH || ""),
        inpKLV: formatDecimal(math.round(ktlNum - klhNum, 3)),
        KLVG: formatDecimal(math.round((ktlNum - klhNum) * 3.75, 3)),
      };
    });
    setLocal();
    renderSP(dssp.mangDS);
  }
};

getLocal();

const themSP = () => {
  let productVal = {};

  let allProduct = getMyEleAll(".formProduct");
  console.log(allProduct);

  for (const element of allProduct) {
    let { id, value } = element;
    productVal = { ...productVal, [id]: value };
  }
  let { inpType, inpHLV, inpKTL, inpKLH, inpCH, idProDuct } = productVal; // giá trị của obj
  let isValid = true;
  isValid &= validation.kiemtraType();
  if (isValid) {
    const ktlNum = parseDecimal(inpKTL);
    const klhNum = parseDecimal(inpKLH);
    let sp = new SanPham(
      inpType,
      inpHLV,
      formatDecimal(inpKTL.replace(/\s/g, "") || "0"),
      formatDecimal(math.round(ktlNum * 3.75, 3)),
      formatDecimal(inpKLH.replace(/\s/g, "") || "0"),
      formatDecimal(math.round(klhNum * 3.75, 3)),
      formatNumberWithCommas((inpCH || "").trim()),
      formatDecimal(math.round(ktlNum - klhNum, 3)),
      formatDecimal(math.round((ktlNum - klhNum) * 3.75, 3)),
      idProDuct.replace(/\s/g, "")
    );
    console.log("sp", sp);
    dssp.themSP(sp);
    renderSP(dssp.mangDS);
    clearData();
    setLocal();
    randomInput();
  }
};

window.themSP = themSP;

const xoaSP = (id) => {
  dssp.mangDS.splice(id, 1);
  setLocal();
  getLocal();
};

window.xoaSP = xoaSP;

const xemSP = (id) => {
  currentEditId = id;
  document.querySelector(".themSP").innerHTML = `

  <button onclick="updateSP(${id})" type="button">Lưu</button>
  
 <button type="button" onclick="huyBoHD()">Hủy bỏ</button>`;

  for (const element in dssp.mangDS[id]) {
    if (
      element !== "inpKLV" &&
      element !== "KTLG" &&
      element !== "KLHG" &&
      element !== "KLVG"
    ) {
      const el = document.getElementById(element);
      if (el) {
        const val = dssp.mangDS[id][element] || "";
        if (element === "inpCH") {
          el.value = formatNumberWithCommas(val);
        } else if (element === "inpKTL" || element === "inpKLH") {
          el.value = formatDecimal(val);
        } else {
          el.value = val;
        }
      }
    }
  }
};

window.xemSP = xemSP;

const huyBoHD = () => {
  currentEditId = null;
  getMyEle(
    ".themSP"
  ).innerHTML = `<button onclick = "themSP()" type="button" id ="btnThem" >Thêm sản phẩm</> `;
};

window.huyBoHD = huyBoHD;

let updateSP = (id) => {
  currentEditId = null;
  let objUpdate = {};
  let productVal = getMyEleAll(".formProduct");
  for (const element of productVal) {
    let { id, value } = element;
    objUpdate = { ...objUpdate, [id]: value };
  }
  let { inpType, inpHLV, inpKTL, inpKLH, inpCH, inpKLV, idProDuct } = objUpdate;
  const ktlNum = parseDecimal(inpKTL);
  const klhNum = parseDecimal(inpKLH);
  let spNew = new SanPham(
    inpType,
    inpHLV,
    formatDecimal(inpKTL.replace(/\s/g, "") || "0"),
    formatDecimal(math.round(ktlNum * 3.75, 3)),
    formatDecimal(inpKLH.replace(/\s/g, "") || "0"),
    formatDecimal(math.round(klhNum * 3.75, 3)),
    formatNumberWithCommas((inpCH || "").trim()),
    formatDecimal(math.round(ktlNum - klhNum, 3)),
    formatDecimal(math.round((ktlNum - klhNum) * 3.75, 3)),
    idProDuct.replace(/\s/g, "")
  );

  // ví dụ code cũ để cập nhật được thì cho dssp.mangds[vitri] = update (update là obj)
  for (const index in dssp.mangDS[id]) {
    // muốn hiểu code thế nào thì so sánh cách cũ rồi thay thế code mới
    dssp.mangDS[id] = spNew;
  }
  document.querySelector(
    ".themSP"
  ).innerHTML = `<button onclick = "themSP()" type = "button" id = "btnThem" >Thêm sản phẩm</button>`;
  clearData();
  randomInput();
  setLocal();
  renderSP(dssp.mangDS);
};
window.updateSP = updateSP;
const randomInput = () => {
  document.querySelector("#idProDuct").value = Math.random();
  document.querySelector("#idProDuct").disabled = true;
};

randomInput();

const setupDecimalInputs = () => {
  ["inpKTL", "inpKLH"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", (e) => {
      const input = e.target;
      const oldVal = input.value;
      const oldCursor = input.selectionStart || 0;

      // Đổi dấu chấm thành dấu phẩy và chỉ giữ số cùng tối đa 1 dấu phẩy
      let cleaned = oldVal.replace(/\./g, ",").replace(/[^0-9,]/g, "");
      const parts = cleaned.split(",");
      if (parts.length > 2) {
        cleaned = parts[0] + "," + parts.slice(1).join("");
      }

      if (cleaned !== oldVal) {
        const diff = cleaned.length - oldVal.length;
        input.value = cleaned;
        const newCursor = Math.max(0, oldCursor + diff);
        input.setSelectionRange(newCursor, newCursor);
      }
    });
  });
};

setupDecimalInputs();

const setupMoneyInput = () => {
  const inpCH = document.getElementById("inpCH");
  if (!inpCH) return;

  inpCH.addEventListener("input", (e) => {
    const input = e.target;
    const oldVal = input.value;
    const oldCursor = input.selectionStart || 0;
    const digitsBeforeCursor = (oldVal.slice(0, oldCursor).match(/\d/g) || []).length;

    const formatted = formatNumberWithCommas(oldVal);
    input.value = formatted;

    // Giữ vị trí con trỏ thông minh khi tự thêm dấu phẩy
    let newCursor = 0;
    let digitsCount = 0;
    while (newCursor < formatted.length && digitsCount < digitsBeforeCursor) {
      if (/\d/.test(formatted[newCursor])) {
        digitsCount++;
      }
      newCursor++;
    }
    input.setSelectionRange(newCursor, newCursor);
  });
};

setupMoneyInput();

const clearData = () => {
  let allProduct = getMyEleAll(".formProduct");
  for (const element of allProduct) {
    if (element.id === "inpHLV") {
      document.getElementById("inpHLV").value = "610";
    } else {
      document.getElementById(element.id).value = "";
    }
  }
};

const deleteall = () => {
  if (
    confirm(
      "Dữ liệu đã được thêm sẽ được xóa hết. Nhấn Yes để XÓA hoặc CANCEL để hủy hành động này."
    )
  ) {
    dssp.mangDS = [];
    getMyEle(
      "#tblDanhSachSP"
    ).innerHTML = `<tr> <td colspan="7">Dữ liệu trống</td></tr> `;
    getMyEle("#tblDanhSachSP").innerHTML = "";
    setLocal();
    return true;
  }
  return false;
};

window.deleteall = deleteall;
