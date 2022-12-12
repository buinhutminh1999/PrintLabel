
/*
Source code được phát triển bởi BuiNhutMinh
*/ 
const validation = new Validation()
const dssp = new DanhSachSanPham()

const getMyEleAll = (select) => {
  return document.querySelectorAll(select)
}

const getMyEle = (select) => {
  return document.querySelector(select)
}


// const checkMangRong = () => { 
//   let mang = dssp.mangDS
//   if(mang == 0){
//     getMyEle('#tfDanhSachSP').style = 'display:none'
//   }else{
//     getMyEle('#tfDanhSachSP').style = 'display:block'
//     return `<tr>
//     <td class="text-right" colspan="7">
//     <div class="d-flex align-items-center justify-content-end">
//     <button onclick="deleteall()">Xóa tất cả</button>
//     <a href="./View/printlabel.html" target="_blank" class="printALL">In tất cả</a>
//     </div>
//     </td>
//     </tr>`
//   }
 
//  }


const renderSP = (mang) => {

  let count = 0;
  let newArr = mang.map((item, index) => {
    let { inpType, inpKTL, inpKLH, inpCH, inpKLV } = item
    return `<tr id="test">
    <td>${++count}</td>
    <td>${inpType}</td>
    <td>${inpKTL}</td>
    <td>${inpKLH}</td>
    <td>${inpKLV}</td>
    <td>${inpCH}</td>
    <td class="d-flex">
    <button onclick="xemSP(${index})" id="xemSPChiTiet"><i class="fa-solid fa-eye"></i></button>
    <button onclick="xoaSP(${index})"><i class="fa-solid fa-trash"></i></button>
    </td>
    </tr>`
  })
  
  // let check = checkMangRong()
  
  getMyEle('#tfDanhSachSP').innerHTML = `<tr>
     <td class="text-right" colspan="7">
     <div class="d-flex align-items-center justify-content-end">
     <button onclick="deleteall()">Xóa tất cả</button>
     <a href="./View/printlabel.html" target="_blank" class="printALL">In tất cả</a>
     </div>
     </td>
     </tr>`
  getMyEle('#tblDanhSachSP').innerHTML = newArr.join('')
}

const printAll = () => {

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
  <p>KLV: ${item.inpKLV}</p>
  <p>CH: ${item.inpCH}
  </div>
   </div>`
  })
  document.querySelector('.labelProDuct').innerHTML = newArr.join('')
  getLocal()
  window.print()
}

const setLocal = () => {
  localStorage.setItem('DSSP', JSON.stringify(dssp.mangDS))
}

const getLocal = () => {
  if (localStorage.getItem('DSSP') != null) {
    dssp.mangDS = JSON.parse(localStorage.getItem('DSSP'))
    renderSP(dssp.mangDS)
    
  }
}

getLocal()


const themSP = () => {
  let productVal = {}

  let allProduct = getMyEleAll('.formProduct')
  console.log(allProduct)

  for (const element of allProduct) {
    let { id, value } = element
    productVal = { ...productVal, [id]: value }
  }
  let { inpType, inpKTL, inpKLH, inpCH, inpKLV, idProDuct } = productVal// giá trị của obj
  let isValid = true
  isValid &= validation.kiemtraType()
  if (isValid) {
    let sp = new SanPham(inpType, inpKTL.replace(/\s/g, ""), inpKLH.replace(/\s/g, ""), inpCH.replace(/\s/g, ""), inpKLV.replace(/\s/g, ""), idProDuct.replace(/\s/g, ""));
    dssp.themSP(sp)
    renderSP(dssp.mangDS)
    clearData()
    setLocal()
    randomInput()
  }
}

const xoaSP = (id) => {
  if(dssp.mangDS.length == 1){
    getMyEle('#tblDanhSachSP').innerHTML = `<tr><td colspan="7">Dữ liệu trống</td></tr>`
    getMyEle('#tfDanhSachSP').innerHTML = ''
    dssp.mangDS = []
    setLocal()
  }else{
    dssp.mangDS.splice(id, 1)
    document.querySelector("#tblDanhSachSP").deleteRow(id);//xóa table
    setLocal()
    getLocal()
  }
 
}

const xemSP = (id) => {
  document.querySelector('.themSP').innerHTML = `<button onclick="updateSP(${id})" type="button">Lưu</button>`
  for (const element in dssp.mangDS[id]) {
    document.getElementById(element).value = dssp.mangDS[id][element] //obj: dssp.mangDS[id] [element]:gọi đến key của đt ]
  }
}

const updateSP = (id) => {
  let objUpdate = {}
  let productVal = getMyEleAll('.formProduct')
  for (const element of productVal) {
    let { id, value } = element
    objUpdate = { ...objUpdate, [id]: value }
  }
  let { inpType, inpKTL, inpKLH, inpCH, inpKLV, idProDuct } = objUpdate;
  let updateSP = new SanPham(inpType, inpKTL, inpKLH, inpCH, inpKLV, idProDuct)
  console.log(updateSP)

  // ví dụ code cũ để cập nhật được thì cho dssp.mangds[vitri] = update (update là obj)
  for (const index in dssp.mangDS[id]) { // muốn hiểu code thế nào thì so sánh cách cũ rồi thay thế code mới 
    dssp.mangDS[id] = updateSP
  }

  document.querySelector('.themSP').innerHTML = `<button onclick="themSP()" type="button" id="btnThem">Thêm sản phẩm</button>`
  clearData()
  randomInput()
  setLocal()
  renderSP(dssp.mangDS)
}

const randomInput = () => {
  document.querySelector('#idProDuct').value = Math.random()
  document.querySelector('#idProDuct').disabled = true
}

randomInput()

const clearData = () => {
  let allProduct = getMyEleAll('.formProduct')
  for (const element of allProduct ) {
    document.getElementById(element.id).value = ''
  }
}

const deleteall = () => {
  if (confirm('Dữ liệu đã được thêm sẽ được xóa hết. Nhấn Yes để XÓA hoặc CANCEL để hủy hành động này.')) {
    dssp.mangDS = [];
    getMyEle('#tblDanhSachSP').innerHTML = `<tr><td colspan="7">Dữ liệu trống</td></tr>`
    getMyEle('#tfDanhSachSP').innerHTML = ''
    setLocal();
    return true
  }
  return false
  
}
