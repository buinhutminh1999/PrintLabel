// import Product from '../Modal/Product.js'
// import DanhSachSanPham from '../Controllers/DanhSachSanPham.js'

const validation = new Validation()
const dssp = new DanhSachSanPham()

let getMyEleAll = (select) => {
  return document.querySelectorAll(select)
}

let renderSP = (mang) => {
  let count = 0;
  let newArr = mang.map((item, index) => {
    let { inpType, inpKTL, inpKLH, inpCH, inpHLV } = item
    return `<tr>
    <td>${++count}</td>
    <td>${inpType}</td>
    <td>${inpKTL}</td>
    <td>${inpKLH}</td>
    <td>${inpCH}</td>
    <td>${inpHLV}</td>
    <td class="d-flex">
    <button onclick="xemSP(${index})" id="xemSPChiTiet"><i class="fa-solid fa-eye"></i></button>
    <button onclick="xoaSP(${index})"><i class="fa-solid fa-trash"></i></button>
    </td>
    </tr>`
  })
  document.getElementById('tblDanhSachSP').innerHTML = newArr.join('') + `<tr>
  <td class="text-right" colspan="7">
  <div class="d-flex align-items-center justify-content-end">
  <button onclick="deleteall()">Xóa tất cả</button>
  <a  href="./View/printlabel.html" target="_blank" class="printALL">In tất cả</a>
  </div>
  </td>
  </tr>`
}

let printAll = () => {
  let newArr = dssp.mangDS.map((item) => {
    return ` <div class="label">
    <br>
  <div class="content__left">
    <p>TV Phương Thảo</p>
    <p>2297 Trần Hưng Đạo, Mỹ Thới, LXAG</p>
  </div>
  <div class="content__right">
    <p>${item.inpType}</p>
  <p>TKL: ${item.inpKTL}  KLH: ${item.inpKLH}</p>
  <p>KLV: </p>
  <p>CH: ${item.inpCH}  HLV: ${item.inpHLV}</p>
  </div>
   </div>`
  })
  document.querySelector('.labelProDuct').innerHTML = newArr.join('')
  getLocal()
  window.print()
}

let setLocal = () => {
  localStorage.setItem('DSSP', JSON.stringify(dssp.mangDS))
}

let getLocal = () => {
  if (localStorage.getItem('DSSP') != null) {
    dssp.mangDS = JSON.parse(localStorage.getItem('DSSP'))
    renderSP(dssp.mangDS)
  }
}

getLocal()


let themSP = () => {
  let productVal = {}

  let allProduct = getMyEleAll('.formProduct')
  console.log(allProduct)

  for (const element of allProduct) {
    let { id, value } = element
    productVal = { ...productVal, [id]: value }
  }
  console.log(productVal)
  let { inpType, inpKTL, inpKLH, inpCH, inpHLV, idProDuct } = productVal
  let isValid = true
  isValid &= validation.kiemtraType()
  if (isValid) {
    let sp = new SanPham(inpType, inpKTL.replace(/\s/g, ""), inpKLH.replace(/\s/g, ""), inpCH.replace(/\s/g, ""), inpHLV.replace(/\s/g, ""), idProDuct.replace(/\s/g, ""));
    dssp.themSP(sp)
    // console.log(dssp.mangDS)
    renderSP(dssp.mangDS)
    setLocal()
    randomInput()
  }
}

let xoaSP = (id) => {
  dssp.mangDS.splice(id, 1)
  setLocal()
  getLocal()
}

let xemSP = (id) => {
  document.querySelector('.themSP').innerHTML = `<button onclick="updateSP()" type="button">Lưu</button>`
  for (const element in dssp.mangDS[id]) {
    document.getElementById(element).value = dssp.mangDS[id][element]
  }
}

let updateSP = () => {
  let objUpdate = {}
  let productVal = getMyEleAll('.formProduct')
  for (const element of productVal) {
    let { id, value } = element
    objUpdate = { ...objUpdate, [id]: value }
  }
  let { inpType, inpKTL, inpKLH, inpCH, inpHLV, idProDuct } = objUpdate;
  let updateSP = new SanPham(inpType, inpKTL, inpKLH, inpCH, inpHLV, idProDuct)
  console.log(typeof idProDuct)

  for (const index in dssp.mangDS) {
    if (idProDuct == dssp.mangDS[index].idProDuct) {
      dssp.mangDS[index] = updateSP
    }
    document.querySelector('.themSP').innerHTML = `<button onclick="themSP()" type="button" id="btnThem">Thêm sản phẩm</button>`
    clearData()
    randomInput()
    setLocal()
    renderSP(dssp.mangDS)
  }
}

let randomInput = () => {
  document.querySelector('#idProDuct').value = Math.random()
  document.querySelector('#idProDuct').disabled = true
}

randomInput()

let clearData = () => {
  let allValue = getMyEleAll('.formProduct')
  for (const element of allValue) {
    let { id, value } = element
    document.getElementById(id).value = ''
  }
}

let deleteall = () => {
  if (confirm('Dữ liệu đã được thêm sẽ được xóa hết. Nhấn Yes để XÓA hoặc CANCEL để hủy hành động này.')) {
    dssp.mangDS = [];
    setLocal();
    getLocal()
    return true
  }
  return false
}







