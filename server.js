// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const shortid = require('shortid');

db.defaults({ books: [] })
  .write()

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.send('Welcome to bookstore!')
});

app.get('/books', (req, res) => {
  res.render('index', {
    books: db.get('books').value()
  });
});

app.get('/books/create', (req, res) => {
  res.render('create');
});

app.get('/books/:id/update', (req, res) => {
  let id = req.params.id;

  res.render('update', {
    id: id
  });
});

app.get('/books/:id/delete', (req, res) => {
  let id = req.params.id;
  
  db.get('books').remove({ id: id }).write();
  res.redirect('/books');
});

app.post('/books/create', (req, res) => {
  req.body.id = shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books');
});

app.post('/books/update', (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  
  db.get('books').find({ id: id }).assign({ title: title }).write();
  res.redirect('/books');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
