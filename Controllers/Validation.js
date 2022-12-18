export default class Validation {
  constructor(){}
    kiemtraType = () => { 
    if(document.getElementById('inpType').selectedIndex == 0 || document.getElementById('inpType').value == '' ){
        document.querySelector('.valid8').style.display = 'block'
        document.querySelector('#inpType').style = 'border-color: #dc3545;'
        alert('Quên chọn Loại sản phẩm rồi kìa')
       return false
 }
 document.querySelector('.valid8').style.display = 'none'
 document.querySelector('#inpType').style = 'border-color: '
 return true
}
}
