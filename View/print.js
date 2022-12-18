import printAll from "../Controllers/main.js";

    printAll()
    //window.onafterprint khi bắt đầu in thì làm 1 việc gì đó
    window.onafterprint = window.close;
    window.print();