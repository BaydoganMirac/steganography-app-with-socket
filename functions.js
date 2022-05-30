const JIMP = require('jimp');
exports.encodeImage  = (img,message, id, forWho)=>{
    JIMP.read('./upload/'+img, (err, image) => {
        console.log(message)
        for(var i = 0; i < image.bitmap.width; i++) {
            for(var j = 0; j < image.bitmap.height; j++) {
                if (i < 1 && j < message.length)
                {
                    var pixel = image.getPixelColor(i, j);
                    var r = message[j].charCodeAt(0);
                    console.log(r)
                    var g = JIMP.intToRGBA(pixel).g;
                    var b = JIMP.intToRGBA(pixel).b;
                    var a = JIMP.intToRGBA(pixel).a;
                    var newPixel = JIMP.rgbaToInt(r, g, b, a);
                    image.setPixelColor(newPixel, i, j);
                }


                if (i == image.bitmap.width - 1 && j == image.bitmap.height - 1)
                {
                    var r = message.length;
                    var g = JIMP.intToRGBA(pixel).g;
                    var b = JIMP.intToRGBA(pixel).b;
                    var a = JIMP.intToRGBA(pixel).a;
                    var messageLengthPixel = JIMP.rgbaToInt(r, g, b, a)
                    image.setPixelColor(messageLengthPixel, i, j);
                }
            }
        }

        image.write('./upload/-'+id+'-'+forWho+'-'+img);
        return true;
    });
}
exports.decodeImage =  (encodeImage, res) =>{
    var message = '';
    JIMP.read('./upload/'+encodeImage, (err, image) => {
        var messageLength = JIMP.intToRGBA(image.getPixelColor(image.bitmap.width - 1, image.bitmap.height - 1)).r;
        console.log(messageLength)
        for(var i = 0; i < image.bitmap.width; i++) {
            for(var j = 0; j < image.bitmap.height; j++) {
                if (i < 1 && j < messageLength)
                {
                    var pixel = image.getPixelColor(i, j);
                    var r = JIMP.intToRGBA(pixel).r;
                    console.log(String.fromCharCode(r));
                    message += String.fromCharCode(r);
                }
            }
        }
        console.log(message)
        return res.json({msg: message});
    });
}