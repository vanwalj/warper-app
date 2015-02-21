/**
 * Created by Jordan on 2/20/2015.
 */

module.exports = {
    server: {
        port: process.env.PORT
    },
    db: {
        uri: process.env.DB_URI || process.env.CLEARDB_DATABASE_URL
    },
    facebook: {
        appId: process.env.FB_APP_ID,
        appSecret: process.env.FB_APP_SECRET
    },
    aws: {
        accessKey: process.env.AWS_AKEY,
        secretKey: process.env.AWS_SKEY,
        s3Bucket: process.env.AWS_S3_BUCKET
    }
};