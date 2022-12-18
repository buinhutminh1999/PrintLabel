export default class DanhSachSanPham {
    constructor() { }
    mangDS = [];

    themSP(sv) {
        this.mangDS.push(sv);
    }

    timViTri(id) {
        let viTri = -1;
        viTri = this.mangDS.findIndex((item) => {
            return item.id == id
        })
        return viTri
    }

}
