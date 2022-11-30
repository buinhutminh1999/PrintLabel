function DanhSachSanPham() {

    this.mangDS = [];

    this.themSP = function (sv) {

        this.mangDS.push(sv);
    }

    this.timViTri = function(id) {
        let viTri = -1;
        viTri = this.mangDS.findIndex((item) => {
            return item.id == id
        })
        return viTri
    }

}