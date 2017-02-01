var express = require('express');
var multer  = require('multer');
var ext = require('file-extension');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');

var config = require('./config');

var s3 = new aws.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey
})

var storage = multerS3({
  s3 : s3,
  bucket: 'giorgiogram',
  acl: 'public-read', //access control list - son todos los archivos que se podrán establecer como públicos
  metadata: function(req, file, cb) {
    cb(null, {fieldName: file.fieldname})  
  },
  key: function(req, file, cb) {
    cb(null, + Date.now() + '.' + ext(file.originalname))
  }
})

 
var upload = multer({ storage: storage }).single('picture');


var app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {title: 'Platzigram'});
})

app.get('/signup', function (req, res) {
  res.render('index', {title: 'Platzigram - Signup'});
})

app.get('/signin', function (req, res) {
  res.render('index', {title: 'Platzigram - Signin'});
})

app.get('/api/pictures', function(req, res){
	  var pictures = [
    {
      user: {
        username: 'giopetrucci',
        avatar: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/13315394_1029570050425016_4557232382542158134_n.jpg?oh=8d4adfd76329db6ab15f326c17adcb49&oe=58B7D322'
      },
      url: 'office.jpg',
      likes: 0,
      liked: false,
      createdAt: new Date().getTime()
    },
    {
      user: {
        username: 'giopetrucci',
        avatar: 'https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/13315394_1029570050425016_4557232382542158134_n.jpg?oh=8d4adfd76329db6ab15f326c17adcb49&oe=58B7D322'
      },
      url: 'let.jpg',
      likes: 1,
      liked: false,
      createdAt: new Date().setDate(new Date().getDate() - 10)
    }
  ];
  setTimeout(function() {
  	res.send(pictures);
  }, 100)
});

app.post('/api/pictures', function(req, res){
	upload(req, res, function (err){
		if (err){
			return res.send(500, "Error uploading file");
		}
		res.send('File uploaded');
	})
})

app.listen(3000, function (err) {
  if (err) return console.log('Hubo un error'), process.exit(1);

  console.log('Platzigram escuchando en el puerto 3000');
})
