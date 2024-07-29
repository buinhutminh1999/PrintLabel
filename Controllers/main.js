/*
Source code được phát triển bởi BuiNhutMinh
*/
import SanPham from "../Modal/Product.js";
import Validation from "./Validation.js";
import DanhSachSanPham from "./DanhSachSanPham.js";

const validation = new Validation();
const dssp = new DanhSachSanPham();
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
      toggleFullScreen();
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
    <td>${inpKTL} Chỉ - ${KTLG} g</td>
    <td>${inpKLH} Chỉ - ${KLHG} g</td>
    <td>${inpKLV} Chỉ - ${KLVG} g</td>
    <td>${inpCH}</td>
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
    return ` <div class="label">
    <br>
  <div class="content__left">
    <p>NPP: DNTN TV Phương Thảo</p>
    <p>2297 Trần Hưng Đạo, Mỹ Thới, LXAG</p>
    <p>NSX: CTY TNHH TV MỸ THÀNH MUM-1337 Trần Hưng Đạo, Mỹ Long, LXAG</p>
    <p>TCCS 04:2024/M.TH</p>
    <p>Xuất xứ: Việt Nam</p>
  </div>
  <div class="content__right">
    <p>${item.inpType} - HLV: ${item.inpHLV}</p>
  <p>TKL: ${item.inpKTL} Chỉ (${item.KTLG} g)</p>
 <p>KLH: ${item.inpKLH} Chỉ (${item.KLHG} g)</p>
  <p >KLV: ${item.inpKLV} Chỉ (${item.KLVG} g)</p>
  <p>CH: ${item.inpCH}</p>
  </div>
   </div>`;
  });

  document.querySelector(".labelProDuct").innerHTML = newArr.join("");

  getLocal();
};

window.printAll = printAll;

export default printAll;

const setLocal = () => {
  localStorage.setItem("DSSP", JSON.stringify(dssp.mangDS));
};

const getLocal = () => {
  if (localStorage.getItem("DSSP") != null) {
    dssp.mangDS = JSON.parse(localStorage.getItem("DSSP"));
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
    let sp = new SanPham(
      inpType,
      inpHLV,
      inpKTL.replace(/\s/g, ""),
      math.round(inpKTL * 3.75, 2),
      inpKLH.replace(/\s/g, ""),
      math.round(inpKLH * 3.75, 2),
      inpCH.replace(/\s/g, ""),
      math.round(inpKTL - inpKLH, 3),
      math.round((inpKTL - inpKLH) * 3.75, 2),
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
  document.querySelector(".themSP").innerHTML = `

  <button onclick="updateSP(${id})" type="button">Lưu</button>
  
 <button type="button" onclick="huyBoHD()">Hủy bỏ</button>`;

  for (const element in dssp.mangDS[id]) {
    if (
      element !== "inpKLV" &&
      element !== "KTLG" &&
      element !== "KLHG" &&
      element !== "KLVG"
    )
      document.getElementById(element).value = dssp.mangDS[id][element]; //obj: dssp.mangDS[id] [element]:gọi đến key của đt ]
  }
};

window.xemSP = xemSP;

const huyBoHD = () => {
  getMyEle(
    ".themSP"
  ).innerHTML = `<button onclick = "themSP()" type="button" id ="btnThem" >Thêm sản phẩm</> `;
};

window.huyBoHD = huyBoHD;

let updateSP = (id) => {
  let objUpdate = {};
  let productVal = getMyEleAll(".formProduct");
  for (const element of productVal) {
    let { id, value } = element;
    objUpdate = { ...objUpdate, [id]: value };
  }
  let { inpType, inpHLV, inpKTL, inpKLH, inpCH, inpKLV, idProDuct } = objUpdate;
  let spNew = new SanPham(
    inpType,
    inpHLV,
    inpKTL.replace(/\s/g, ""),
    math.round(inpKTL * 3.75, 2),
    inpKLH.replace(/\s/g, ""),
    math.round(inpKLH * 3.75, 2),
    inpCH.replace(/\s/g, ""),
    math.round(inpKTL - inpKLH, 3),
    math.round((inpKTL - inpKLH) * 3.75, 2),
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

const clearData = () => {
  let allProduct = getMyEleAll(".formProduct");
  for (const element of allProduct) {
    if (element.id === "inpCH") {
      document.getElementById("inpCH").value = ".000";
    } else if (element.id === "inpHLV") {
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
