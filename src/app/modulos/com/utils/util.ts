// import { File as FilePlugin, FileEntry } from '@ionic-native/file/ngx';

export var asyncLocalStorage = {
    setItem: function (key, value) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, value);
        });
    },
    getItem: function (key) {
        return Promise.resolve().then(function () {
            return JSON.parse(localStorage.getItem(key));
        });
    },
    removeItem: function (key) {
        return Promise.resolve().then(function () {
            localStorage.removeItem(key);
        });
    }
};


export class Util {
    static fechaComponentADate(valor: any): Date {
        let isoDate = (valor.year == null ? '00' : valor.year.text) +
            '-' + (valor.month == null ? '00' : (valor.month.value < 10 ? '0' + valor.month.value : valor.month.value)) +
            '-' + (valor.day == null ? '00' : valor.day.text) +
            'T' + (valor.hour == null ? '00' : valor.hour.text) +
            ':' + (valor.minute == null ? '00' : valor.minute.text);
        return new Date(isoDate);
    }

    static arrayAString(separador: string, array: any[]): string {
        if (array.length > 0) {
            let valorArray: string = "";
            array.forEach(element => {
                valorArray += element + separador;
            });
            valorArray = valorArray.substring(0, valorArray.length - 1);
            return valorArray;
        } else {
            return null;
        }
    }

    static dataURLtoFile(dataurl: string, filename: string): Promise<File> {
        return new Promise((resolve, reject) => {
            fetch(dataurl).then(r => r.blob()).then(blobFile => {
                var file = Util.blobToFile(blobFile, filename);
                resolve(file);
            });
        });
    }

    static blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;
        //Cast to a File() type
        return <File>theBlob;
    }

    static readBlobFile(file: File): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                let array = new Uint8Array(<ArrayBuffer>reader.result);
                resolve(new Blob([array]));
            };
            reader.readAsArrayBuffer(file);
        });
    }

    static getExtension(file: string) {
        let strSplit = file.split(".");
        let ext = strSplit.length > 1 ? strSplit[1] : null;
        return ext;
    }

    static getSeleccionArbol(field: string, tree: any[], list: any[], attributes?: string[]) {
        tree.forEach(node => {
            if (node[field] != null && node[field].length > 0) {
                Util.getSeleccionArbol(field, node[field], list, attributes);
            }
            if (node['selected'] == true) {
                let obj = { id: node.id };
                if (attributes != null)
                    attributes.forEach(att => {
                        obj[att] = node[att];
                    });
                list.push(obj);
            }
        });
    }

    static cargarSeleccionArbol(field: string, tree: any[], list: any[], compareWith: string) {
        for (let element of list) {
            let nodo = Util.buscarEnArbol(tree, field, compareWith, element);
            if (nodo != null)
                nodo['selected'] = true;
        }
    }

    static buscarEnArbol(tree: any[], field: string, compareWith: string, compareElement: any, parent?: any) {
        for (let node of tree) {
            if (node[compareWith] == compareElement[compareWith]) {
                if (parent != null) parent['expanded'] = true;
                return node;
            } else if (node[field] != null && node[field].length > 0) {
                let n = Util.buscarEnArbol(node[field], field, compareWith, compareElement, node);
                if (n != null) {
                    if (parent != null) parent['expanded'] = true;
                    return n;
                }
            }
        }
    }


    public static colors = [
        "#DC143C",
        "#CD5C5C",
        "#FF69B4",
        "#FFC0CB",
        "#FF7F50",
        "#FF4500",
        "#FFD700",
        "#FFE4B5",
        "#EE82EE",
        "#9370DB",
        "#7B68EE",
        "#3CB371",
        "#20B2AA",
        "#40E0D0",
        "#4682B4",
        "#87CEEB",
        "#00BFFF",
        "#4169E1",
    ];
    public static randomColor() {
        return Util.colors[Math.floor(Math.random() * Util.colors.length)];
    }
}