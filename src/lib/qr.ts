export function generateQrLink(url:string){
    return `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=500x500`
}