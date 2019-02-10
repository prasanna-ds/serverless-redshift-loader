let AWS = require('aws-sdk')
let pg = require('pg')
let async = require('async')
let Redshift = require('node-redshift')

let config;

switch (process.env.NODE_ENV) {
    case 'production':
        config = require('./Config/production.json')
        break
    case 'staging':
        config = require('./Config/staging.json')
        break
}

exports.handler = function(event,context,callback) {
    console.log("Received a S3 event")
    var bucket = event.Records[0].s3.bucket.name
    var key = event.Records[0].s3.object.key
    console.log(`This is my bucket ${bucket}`)
    console.log(`This is my key ${key}`)

    let sql

    switch (key) {
        case key.includes('address'):
            sql = require('./sql/address/address.sql')
            break
        case key.includes('agency'):
            sql = require('./sql/agency/agency.sql')
            break
        case key.includes('flats'):
            sql = require('./sql/flats/flats.sql')
            break
    }

    async.waterfall([
        function createTable(callback){
            let client = {
                user: config.user,
                database: config.database,
                password: config.password,
                port: port,
                host: host
            }
            var redshift = new Redshift(client, {rawConnection: true});

            redshift.rawQuery(sql,{raw:true})
            .then(function(data) {
                console.log("table created if not exixts")
            })
            .catch(function(err) {
                console.log(err)
                callback(err)
            })
        },
        function loadTable(callback){
            let client = new pg.Client(config.connectionString);
            client.connect(function(err) {
              if(err) {
                return console.error('could not connect to postgres', err);
              }

              let tableName = key.split('\/').pop()
              let s3_file = 's3://' + bucket + '/' + key

              let copyCmd = 'copy' +  tableName + 'from \'' + s3_file + '\' +credentials \'aws_access_key_id=' 
              + (process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID)
              + ';aws_secret_access_key=' 
              + (process.env.AWS_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY)
              + '\''
              + ' csv',
              + ' gzip',
              + ' ignoreheader 1',
              + ' delimiter as \'\\t\'',
              + ' truncatecolumns',
              + ' ignoreblanklines',
              + ' statupdate on'
              + ' maxerror 0';
        
              client.query(copyCmd, function(err, result) {
                if(err) {
                    console.error('error running query', err);
                    callback(err)
                }
                logger.info("no errors, seem to be successful!");
                client.end();
              });
            });
        }],function (err) {
            if (err) {    
                console.log('Error loading table', err)
                callback(err)
            }
            let message = "successfully loaded redshift table"
            callback(null,message)
        }
        )
}
