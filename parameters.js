/**
 * Created by Jordan on 2/20/2015.
 */

module.exports = {
    server: {
        port: process.env.PORT
    },
    db: {
        uri: process.env.DB_URI
    },
    facebook: {
        appId: "728886097224292",
        appSecret: "b663fb56899f27c40b56e5cab1c8a713"
    },
    aws: {
        accessKey: 'AKIAIU4B5MUGDIPVGGTA',
        secretKey: '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',
        s3Bucket: "warper"
    }
};