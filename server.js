var express = require('express');
var nodemailer = require('nodemailer');
var app = express();
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
 const axios = require('axios');
const fetch = require('node-fetch');
var async = require("async");
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const {check,validationResult} = require('express-validator');
const session = require('express-session');
app.set('view engine', 'ejs');
const path = require('path');
app.use(express.static(path.join(__dirname,'public')))
app.use(session({secret: 'komarti',saveUninitialized: true,resave: true}));
app.use(function(req, res, next) {
  res.locals.req = req;
  res.locals.sess = req.session;
  next();
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));



var url = "mongodb://localhost:27017/moviesdb";
MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});


MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
  if (err) throw err;
  var dbo = db.db("moviesdb");



dbo.collection('city_theatres').find({}).count().then(function(result)
                {
                  
                     if( result == 0 )
                     {
                           

  var myobj = [
   {
    city: "Mumbai" ,
    theatres:["Maratha Mandir Theatre","Regal Theatre","Royal Opera House","Tata Theatre","INOX"] 
   },

   {
    city: "Bengaluru",
    theatres: ["Pushpanjali Theatre","Sampige Theatre","Santosh Theatre","PVR Cinemas","Oorvashi Theatre","INOX"]
   },

   {
    city: "Hyderabad" ,
    theatres:["PVR Cinemas","Prasads Multiplex","Gokul Theatre","Sri Bhramaramba Theatre","PVR Cinemas","Carnival Cinemas"] 
   },
   {
    city:"Ahmedabad",
    theatres: ["Cinepolis","Cinemax","PVR Acropolis","Miraj city pulse"]
   },

   {
    city: "Chandigarh" ,
    theatres: ["Neelam Cinema", "Pikkadilly Cinemas", "PVR Centra Mall", "Wave Cinemas"]
   },

   {
    city: "Chennai",
    theatres: ["Ganapathy Ram theatre", "AGS Cinemas","PVR Cinemas","Anna Theatre", "M.M. Theatre"]
   },
   {
    city: "Tadepalligudem" ,
    theatres: ["Lakshmi Narayana Theatre","Sesha Mahal","Ranga Mahal","Balaji Theatre"]
   },

   {
    city: "Tirupati",
    theatres: ["Krishna Teja Group Theatres","PGR Cinemas","Sandhya Theatre","Carnival Cinemas"]
   },

   {
    city: "Vijayawada" ,
    theatres: ["Sreenivasam Theatre","Cinepolis","Apsara Theatre","Capital Theatre","INOX"]
   },
   {
    city: "Tanuku" ,
    theatres: ["Lakshmi Theatre","V Max Theatre","Sri Chitra Theatre","Sri Kanakadurga 4K DOLBY ATMOS"]
   },
   {
    city: "Thiruvananthapuram" ,
    theatres: ["Aries Plex SL Cinemas","Kalabhavan Theatre","Sree Padmanabha Theatre","Carnival Cinemas","PVR Kripa Cinemas"]
   },
   {
    city: "Kolkata" ,
    theatres: ["Minerva Theatre","Rabindra Sadan","Exide more"]
   },
   


   ]

  dbo.collection("city_theatres").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    
  });



                    }
       
                });


});













app.get('/', function(req, res) {
    var sess = req.session;
        (async () => {
          try {
            var rest = await axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=b195f787962173c1ee91ddc986379adc&region=IN&page=1')
    rest = rest.data
   //const rest1 = await fetch('https://api.themoviedb.org/3/movie/794362?api_key=b195f787962173c1ee91ddc986379adc&append_to_response=credits').then(response => response.json());
   //const rest2 = await fetch('http://api.themoviedb.org/3/movie/794362/casts?api_key=b195f787962173c1ee91ddc986379adc').then(response => response.json());
    var upcoming = await axios.get('https://api.themoviedb.org/3/movie/upcoming?api_key=b195f787962173c1ee91ddc986379adc&region=IN&page=1');
    upcoming = upcoming.data   

   
   
   var now_dates1 = rest.dates.minimum
   sess.now_dates1 = now_dates1
   var now_dates2 = rest.dates.maximum
   sess.now_dates2 = now_dates2
   var up_dates1 = upcoming.dates.minimum
   sess.up_dates1 = up_dates1
   var up_dates2 = upcoming.dates.maximum
   sess.up_dates2 = up_dates2
   var total_pages = rest.total_pages
   var total_pages2 = upcoming.total_pages
   sess.total_pages = total_pages;
   sess.total_pages2 = total_pages2;
   var a = new Array(total_pages);
   var a2 = new Array(total_pages2);
   for(var i=0; i<total_pages;i++){
       a[i] = i+1
       
   }

   for(i=0; i<total_pages2;i++){
       a2[i] = i+1
       
   }
   

   var page_count = Object.keys(rest.results).length  
   var page_count2 = Object.keys(upcoming.results).length 
    var alert1 = "some alert" 
    var alert2 = "some alert"
    var id = []
    var id2 = []
   var a2 = [];
   var title= []
   var release_Date = []
   var popularity = []
   var overview= []
   var a3  = []
 var  title2 = []
var  release_Date2 = []
var  popularity2 = []
 var  overview2 = []
   for(var i=0; i<page_count;i++){
    if(rest.results[i]['poster_path'] !== null){
       a2.push(rest.results[i]['poster_path'])
       title.push(rest.results[i]['title'])
       release_Date.push(rest.results[i]['release_date'])
       popularity.push(rest.results[i]['popularity'])
       overview.push(rest.results[i]['overview'])
       id.push(rest.results[i]['id'])
       
    }
   } 



    for(var i=0; i<page_count2;i++){
    if(upcoming.results[i]['poster_path'] !== null){
       a3.push(upcoming.results[i]['poster_path'])
       title2.push(upcoming.results[i]['title'])
       release_Date2.push(upcoming.results[i]['release_date'])
       popularity2.push(upcoming.results[i]['popularity'])
       overview2.push(upcoming.results[i]['overview'])
       id2.push(upcoming.results[i]['id'])
    }
   } 
  
   res.render('pages/htmlfile',{
                                 
                                link1:a ,
                                 alert1,
                                 alert2,
                                 img: a2, title: title, release_Date: release_Date, popularity: popularity, overview: overview ,id: id,
                                 img2: a3,title2: title2, release_Date2: release_Date2, popularity2: popularity2, overview2: overview2, id2: id2
                            })   
                 }                    
catch (error) {
   res.redirect('/')
  }
})(); 
});








app.get('/page/:type2/:id', function(req, res) {
 sess = req.session;
 
        (async () => {
          try{
    var pno = req.params.id
 
    var type2 = req.params.type2
    var t2 = type2

    

   if(req.method == 'GET' && pno == 0){
    var movie  = req.query.search
    pno = pno + 1
   
    sess.movie = movie
    }
    
      if(type2 == "up")
           {
           var rest = await axios('https://api.themoviedb.org/3/movie/upcoming?api_key=b195f787962173c1ee91ddc986379adc&region=IN'+'&page='+pno);
           rest = rest.data
            }
            else if(type2 == "now"){
           var rest = await axios('https://api.themoviedb.org/3/movie/now_playing?api_key=b195f787962173c1ee91ddc986379adc&region=IN'+'&page='+pno);
              rest = rest.data
              }
              else{
                   movie = sess.movie
                   var rest = await axios('https://api.themoviedb.org/3/search/movie?api_key=b195f787962173c1ee91ddc986379adc&query='+movie+'&page='+pno);
                rest = rest.data
              }
    
   
  var total_pages2 = rest.total_pages
sess.total_pages2 = total_pages2;
var a2 = new Array(total_pages2);
for(i=0; i<total_pages2;i++){
       a2[i] = i+1
       
   }
   var page_count2 = Object.keys(rest.results).length 
 
  var alert1 = "some alert" 
    var alert2 = "some alert"
 var id2 = []
 var type = []
 var a3  = []
 var  title2 = []
var  release_Date2 = []
var  popularity2 = []
 var  overview2 = []

    for(var i=0; i<page_count2;i++){
    if(rest.results[i]['poster_path'] !== null){
       a3.push(rest.results[i]['poster_path'])
       title2.push(rest.results[i]['title'])
       release_Date2.push(rest.results[i]['release_date'])
       if(rest.results[i]['release_date'] >= sess.now_dates1 && rest.results[i]['release_date'] <= sess.now_dates2)
       {
        type.push("now")
       }
       else if(rest.results[i]['release_date'] >= sess.up_dates1)
       {
        type.push("up")
       }
       else
       {
        type.push("search")
       }
       popularity2.push(rest.results[i]['popularity'])
       overview2.push(rest.results[i]['overview'])
       id2.push(rest.results[i]['id'])
    }
   } 

    res.render('pages/htmlfile2',{
                               totalpg:total_pages2,pno: pno,
                               link1:a2 ,
                                 alert1,
                                 alert2,
                                 img: a3,title: title2, id: id2, type2:type2, type:type
                            })
                           
   
 
    
 }                    
catch (error) {
    console.log(error);
  }
})(); 
});



























app.get('/signup', function(req, res) {
    res.render('pages/signup');
});

app.post('/signup_check', urlencodedParser ,  [
    check('Fullname', 'Enter your Fullname')
        .trim()
        .exists()
        .isLength({ min: 1 }),


    check('email').notEmpty().withMessage('Email Address required').normalizeEmail().isEmail().withMessage('must be a valid email'),


   check('password').trim().notEmpty().withMessage('Password required')
  .isLength({ min: 5 }).withMessage('password must be minimum 5 length')
  .matches(/(?=.*?[A-Z])/).withMessage('At least one Uppercase')
  .matches(/(?=.*?[a-z])/).withMessage('At least one Lowercase')
  .matches(/(?=.*?[0-9])/).withMessage('At least one Number')
  .not().matches(/^$|\s+/).withMessage('White space not allowed')
  .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('At least one special character'),




    check('confirm_password', 'Passwords do not match') 
        .custom((value,{req, loc, path}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        }),

    check('phone', 'Enter valid phone number') 
        .trim()
        .custom((value,{req, loc, path}) => {
            if (value < 6000000000 || value > 9999999999 ) {
                throw new Error("Enter valid phone number");
            } else {
                return value;
            }
        })
], (req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()) 
    {
        const alert = errors.array()
        res.render('pages/signup', {
            alert,
            data: req.body
        })


    }

   
    else{


                MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
                  if (err) throw err;
                  var dbo = db.db("moviesdb");

                   dbo.collection("users").findOne({email: req.body.email}).then(function(result)
                {
                     if( result !== null )
                     {
                          
                          const alert2 = "email not exist"
                          res.render('pages/signup',{
                                 msg:'Email already exists',
                                 alert2,
                                 data: req.body
                            })
                     }

                     else
                     {
                        sess = req.session;
                        if(sess.mid)
                        {
                        var  url1 = "/booking/"+sess.mid
                        }
                        else
                          var url1 = "/"
                        var myobj = {  
                                 Fullname: req.body.Fullname, 
                                 email: req.body.email, 
                                 password: req.body.password, 
                                 phone: req.body.phone 
                              };

                          sess.email = req.body.email;
                          sess.Fullname = req.body.Fullname;
                          sess.phone = req.body.phone;
                         

                           dbo.collection("users").insertOne(myobj, function(err, res) {
                             if (err) throw err;
                             console.log("1 user inserted into databse");
                              db.close();
                           });
                           res.redirect(url1)
                    }
                     
                });


                 
                });
                
    }
    

});



app.get('/login', function(req, res) {
  
    res.render('pages/login');
});



app.post('/login_submit', urlencodedParser , function(req, res) {
    
   
    sess = req.session
    var email = req.body.email
    var password = req.body.password
    if(sess.mid)
    {
     var  url1 = "/booking/"+sess.mid
    }
    else
      var url1 = "/"
    
    console.log(url1)

    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) 
       {
                  if (err) throw err;
                  var dbo = db.db("moviesdb");
                     
                     var result = dbo.collection("users").findOne({email: email, password: password }).then(function(result)
                {
                     if( result !== null )
                     {
                          console.log('user successfully logged in')
                          sess = req.session;
                          sess.email = email;
                          sess.Fullname = result.Fullname;
                          sess.phone = result.phone;
                          
                          res.redirect(url1)
                      }

                     
                     else{
                        console.log('wrong email/password entered')
                        const alert2 = "wrong email/password entered"
                        res.render('pages/login',{
                                 msg:'wrong email/password entered',
                                 alert2,
                                 data: req.body
                            })
                     }

                     db.close()
                     
                });

                     
                 
        });
});






app.get('/movie/:type/:id', function(req, res) {
 sess = req.session;
 
        (async () => {
          try{
    var mid = req.params.id
    var type = req.params.type
    sess.type = type
    console.log(mid)
    sess.mid = mid
    var rest = await axios.get('https://api.themoviedb.org/3/movie/'+mid+'?api_key=b195f787962173c1ee91ddc986379adc&append_to_response=credits');
    rest = rest.data
    var imdb_id = rest.imdb_id
    var original_language = rest.original_language
    sess.original_language = original_language
    var rest2 = await axios.get('http://www.omdbapi.com/?i='+imdb_id+'&apikey=efa3894f');
    var imdb_rating = rest2.data.imdbRating
    var rest3 = await axios.get('https://api.themoviedb.org/3/movie/'+mid+'/videos?api_key=b195f787962173c1ee91ddc986379adc&language='+original_language)
    rest3 = rest3.data
    
   if( rest3.results.length !== 0  ){
   var videokey = rest3.results[0]['key']
  }
    var poster = rest.poster_path
    sess.poster = poster
    var poster2 = rest.backdrop_path
    var title =  rest.title
    sess.title = title
    var date = rest.release_date
    var year = date.substring(0,4)
   var date2=new Date(date);
   date2=new Date(date2.setDate(date2.getDate()-1));
   date2 = date2.toISOString();
   date2 = date2.substring(0,10)



    if(rest.production_countries.length > 0){
      var country = rest.production_countries[0]['iso_3166_1']
    }
    else{
      var country = ""
    }
    var genres_size =  Object.keys(rest.genres).length 
    var genres = []
    var language = []
    var cast = []
    for(i=0;i<genres_size;i++)
    {
       genres.push(rest.genres[i].name)
    }
    var runtime = rest.runtime
    var hours = Math.floor(runtime / 60);          
    var minutes = runtime % 60;
    var runtime = hours + "h "+minutes+" m";
    var tagline = rest.tagline
    var overview = rest.overview
    
    var spoken_languages = Object.keys(rest.spoken_languages).length 
    for(i=0;i<spoken_languages;i++){
       language[i] = rest.spoken_languages[i].english_name
    }
   
    var crew = Object.keys(rest.credits.crew).length 
    var cast1 = Object.keys(rest.credits.cast).length
    if(cast1 > 3)
    cast1 = 3 
  if(crew > 0){
    for(i=0;i<crew;i++)
    {
      if(rest.credits.crew[i].job == "Director")
        var director = rest.credits.crew[i].name
      if(rest.credits.crew[i].job == "Producer")
        var producer = rest.credits.crew[i].name
      if(rest.credits.crew[i].job == "Editor")
        var editor = rest.credits.crew[i].name
    }
  }
    if(cast1 > 0){
    for(i=0;i<cast1;i++)
    {
      cast[i] = rest.credits.cast[i].name
    }
  }
    
    
    res.render('pages/moviedetails',{mid:mid,poster: poster, poster2:poster2, title: title, 
                                     date:date, date2:date2, year:year , country:country , genres: genres,
                                     runtime:runtime, tagline:tagline, overview: overview,
                                     imdb_rating:imdb_rating, imdb_id: imdb_id, language: language, original_language: original_language, 
                                     director: director, producer: producer , editor: editor , cast:cast,
                                     videokey: videokey, type: type








                                   })
                           
   
 
    
 }                    
catch (error) {
    //res.redirect('/movie/'+mid)
    console.log("error")
  }
})(); 
});





app.get('/booking/:id', function(req, res) {
sess = req.session;
 
        (async () => {

          poster = sess.poster
          id = sess.mid
          title = sess.title

  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
              var cities = []
              var theatres = []
              var reserv_seats = []
              var dict = {}
              var dbo = db.db("moviesdb");
var result = dbo.collection("city_theatres").find({}).toArray(function(err,result){

 
            for(i=0;i<result.length;i++)
            {
              cities.push(result[i].city)
            }
          
          for(i=0;i<result.length;i++)
          {
               
               dict[result[i].city] = result[i].theatres
               console.log(dict[result[i].city][1])

          }

          

          console.log(dict)
         
          var dateerr
          
          
            dict = JSON.stringify(dict)

 reserv_seats = JSON.stringify(reserv_seats)
            sess.dict = dict
          sess.cities = cities
          alert1 = "alert1"
          res.render('pages/booking',{
  poster: poster, title: title, id: id,cities:cities,dict:dict,dateerr,reserv_seats,alert1,select_time: 0,theatre:-1,data: req.body
}) 

          })
            

            
            

})



})();

});


app.post('/booking/:id', urlencodedParser , function(req, res) {
sess = req.session;
var title = sess.title
var seats = []
var sess = req.session
var dict = sess.dict
dict = JSON.parse(dict) 
var dateerr
var city = req.body.select_city
sess.city = city
var theatre = req.body.select_theatre
var theatre1 = theatre
theatre1 = dict[city][theatre]
sess.theatre = theatre1
var date = req.body.select_date
sess.date = date
if(date == "")
dateerr = "enter date"
var time = req.body.select_time
sess.time = time
console.log(title,city,theatre1,date,time)




MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
                 
                  var dbo = db.db("moviesdb");

                  var result = dbo.collection("users_transactions").find({title: title, city: city, theatre: theatre1, date: date, time:time,status:"CONFIRMED"}).toArray(function(err,result){
  if (err) throw err;
var reserv_seats = []
          var temp_seats = []
for(i=0;i<result.length;i++)
{
    if(result[i].seats !== null)
    {
      //console.log(result[i].seats)
      temp_seats.push(result[i].seats)
    }
    
}


for(i=0;i<temp_seats.length;i++)
    {
      if(typeof temp_seats[i] == "string")
        reserv_seats.push(temp_seats[i])
      else
      {
        for(j=0;j<temp_seats[i].length;j++)
      {
        reserv_seats.push(temp_seats[i][j])
      }
      }
      
    }
    
    
 reserv_seats = JSON.stringify(reserv_seats)
 console.log(reserv_seats)
 const alert1 = "returning values"

            res.render('pages/booking',{
  id: sess.mid,cities:sess.cities,dict:sess.dict,reserv_seats:reserv_seats,alert1,dateerr,theatre:theatre,select_time: time,data: req.body
}) 
             

})
                 
                });

})





app.get('/logout', urlencodedParser , function(req, res) {
       var x = req.session.Fullname
       console.log(x+' has logged out')
       req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
})



app.post('/send_movie', urlencodedParser , function(req, res) {

var sess = req.session
var seats = req.body.seats
sess.seats = seats
if(typeof seats == "string")
{
  var price = Array(seats).length
  sess.price = price
}

else
{
  var price = seats.length
  sess.price = price
}

console.log(seats,price)
res.render('pages/foods')

})


app.get('/foods', function(req, res) {

res.render('pages/foods')

})



app.post('/foods', urlencodedParser , function(req, res) {

var sess = req.session;
console.log("recieved");
var extra_orders = []
var extra_orders2 = []
var orders_name = req.body.orders_name;
sess.orders_name = orders_name
var orders_quantity = req.body.orders_quantity;
sess.orders_quantity = orders_quantity
var orders_price = req.body.orders_price;
sess.orders_price = orders_price
var extra_price = req.body.extra_price;
sess.extra_price = extra_price
var total_price = (sess.price*250)+Number(extra_price)
sess.total_price = total_price
console.log(orders_name)
console.log(orders_quantity)
console.log(orders_price)
console.log(extra_price)
console.log(total_price)

if(typeof orders_name !== "undefined")
{

if(typeof orders_name !== "string")
{
for(i=0;i<orders_name.length;i++)
{
   extra_orders.push(orders_name[i])
   extra_orders.push(orders_quantity[i])
   extra_orders.push(orders_price[i])
}

sess.extra_orders = extra_orders
}

else
{
   extra_orders.push(orders_name)
   extra_orders.push(orders_quantity)
   extra_orders.push(orders_price)
   sess.extra_orders = extra_orders
}


}


if(typeof orders_name !== "undefined")
{
if(typeof orders_name !== "string")
{
for(i=0;i<extra_orders.length;i=i+3)
{
  var j = i+3
  extra_orders2.push(extra_orders.slice(i,j))
}
sess.extra_orders2 = extra_orders2
}
else
{
  extra_orders2.push(extra_orders)
  sess.extra_orders2 = extra_orders2
}
}










res.render('pages/payment')

})

app.post('/payment', urlencodedParser , function(req, res) {

var sess  = req.session
  var cardHolderName = req.body.cardHolderName
  var cardNumber = req.body.cardNumber
  var month_exp = req.body.m_exp
  var year_exp = req.body.y_exp
  var cvv = req.body.cvv
  console.log(cardHolderName)
  console.log(cardNumber)
  console.log(month_exp)
  console.log(year_exp)
  console.log(cvv)
  cardNumber = cardNumber.split("-").join("").trim()

   var visa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/
   var master = /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/
   var rupay = /^6[0-9]{15}$/

   var match1 = visa.exec(cardNumber)
   var match2 = master.exec(cardNumber)
   var match3 = rupay.exec(cardNumber)
   
    if(!match1 && !match2 && !match3)
  {
     var msg1 = "Please enter valid card number";
     var alert2 = "invalid"
     res.render('pages/payment',{msg1,alert2 , data: req.body})
  }
  
  else
  {
      sess.status = "CONFIRMED";
      MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
                 
                  var dbo = db.db("moviesdb");
                    
                        var myobj = {  
                                 user  : sess.Fullname,
                                 email : sess.email,
                                 No_of_seats : sess.price,
                                 seats : sess.seats, 
                                 title: sess.title,
                                 city: sess.city,
                                 theatre: sess.theatre,
                                 poster: sess.poster,
                                 date: sess.date,
                                 time: sess.time,
                                 extra_orders: sess.extra_orders2,
                                 extra_orders_array: sess.extra_orders,
                                 Total_price_paid: sess.total_price,
                                 status:"CONFIRMED",
                                 Date_of_booking: Date()
                              };

                        
                        var myobj2 = {

                          user  : sess.Fullname,
                          email : sess.email,
                          title : sess.title,
                          Total_price_paid: sess.total_price,
                          status: "CONFIRMED",
                          transaction_date: Date()
                          
                        }

                        


                         

                           dbo.collection("users_transactions").insertOne(myobj, function(err, res) {
                             if (err) throw err;
                             console.log("1 transaction inserted into databse");
                              
                           });
                          

                          dbo.collection("billing").insertOne(myobj2, function(err, res) {
                             if (err) throw err;
                              db.close();
                           });
                           
                    
res.redirect('/success')
                     
             


                 
                });
  }

  });

app.get('/settings', function(req, res) {

var sess = req.session;
var bill_title = []
var bill_Total_price_paid = []
var bill_status = []
var bill_transaction_date = []
var bill_total_rows

MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
                 
                  var dbo = db.db("moviesdb");

                    dbo.collection("billing").find({email: sess.email,user: sess.Fullname}).toArray(function(err,result)
                {

                   bill_total_rows = result.length  
                   
                   for(i=0;i< bill_total_rows;i++)
                   {

                        bill_title.push(result[i].title)
                        bill_Total_price_paid.push(result[i].Total_price_paid)
                        bill_status.push(result[i].status)
                        var str = result[i].transaction_date
                        str = str.replace("GMT+0530 (India Standard Time)","")
                        bill_transaction_date.push(str)

                   }
                    sess = req.session;
                    sess.bill_title = bill_title
    sess.bill_Total_price_paid = bill_Total_price_paid
    sess.bill_status = bill_status
    sess.bill_transaction_date = bill_transaction_date
    sess.bill_total_rows = bill_total_rows


res.render('pages/settings',{
       Fullname: sess.Fullname,
       email:sess.email,
       phone:sess.phone,
       pro_updated: "false", pass_updated: "false",
       msg4:""
     })

                })

                  })





})


app.post('/settings_script', urlencodedParser ,  [
    check('Fullname', 'Enter your Full Name')
        .trim()
        .exists()
        .isLength({ min: 1 }),


    check('email').notEmpty().withMessage('Email Address required').normalizeEmail().isEmail().withMessage('must be a valid email'),

 check('phone', 'Enter valid phone number') 
        .trim()
        .custom((value,{req, loc, path}) => {
            if (value < 6000000000 || value > 9999999999 ) {
                throw new Error("Enter valid phone number");
            } else {
                return value;
            }
        })
], function(req, res) {

 var sess = req.session;
 const errors = validationResult(req)
    if(!errors.isEmpty()) 
    {
        const alert = errors.array()
        res.render('pages/settings', {
            alert,
            data: req.body,
            pro_updated: "false", pass_updated: "false",
            msg4:""
        })


    }

    else
    {
      var Fullname = req.body.Fullname
      var email = req.body.email
      var phone = req.body.phone
      

      MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
                 
                  var dbo = db.db("moviesdb");
                    
                    dbo.collection("users").findOne({email: req.body.email}).then(function(result)
                {
                     if( result !== null && sess.email !== req.body.email )
                     {
                          
                          const alert2 = "email not exist"
                          res.render('pages/settings',{
                                 msg:'Email already exists',
                                 alert2,
                                 data: req.body,
                                 pro_updated: "false", pass_updated: "false",
                                 msg4:""
                            })
                     }
                   
                   else
                   {

                   var result = dbo.collection("users").findOneAndUpdate({ "email" : sess.email }, {$set: {"Fullname" : req.body.Fullname, "email": req.body.email,"phone":req.body.phone}}).then(function(result)
                  
                {
                  
                    sess.Fullname = Fullname;
                    sess.email = email;
                    sess.phone = phone;
                    

                console.log(sess.Fullname,sess.email,sess.phone)

                     res.render('pages/settings',{
       Fullname: sess.Fullname,
       email:sess.email,
       phone:sess.phone,
       pro_updated: "true",
       pass_updated: "false",
       msg4:""
     })
                    
                     
                                         
                });

                 }
              })

                });
      
      
     
    }


})




app.post('/settings_script2', urlencodedParser ,function(req, res) {

var sess = req.session;

var email = sess.email

 MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
                 
                  var dbo = db.db("moviesdb");
 dbo.collection("users").deleteOne( { "email" : email} );
 dbo.collection("users_transactions").deleteMany( { "email" : email} );
console.log(sess.Fullname+" has deleted account successfully");
res.redirect('/logout')

})

})






app.post('/settings_script3', urlencodedParser ,function(req, res) {

var sess = req.session
var pass1 = req.body.pass1
var pass2 = req.body.pass2
var pass3 = req.body.pass3

var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{5,}$/

if(!regex.test(pass2))
{
   res.render('pages/settings',{
                       msg5:'Please enter valid New Password',
                       Fullname: sess.Fullname,
                       email:sess.email,
                       phone:sess.phone,
                       pro_updated: "false", pass_updated: "false",
                       msg4:"security"

                     })
}

else
{
 MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
                 
                  var dbo = db.db("moviesdb");

if(pass1!== undefined && pass2 !== undefined && pass3!== undefined)
{

                    var result = dbo.collection("users").findOne({email: sess.email}).then(function(result)
                {
                          if(pass1 == result.password)
                          {

                           if(pass2 == pass3){

                              var result = dbo.collection("users").findOneAndUpdate({ "email" : sess.email }, {$set: {"password" : pass2}}).then(function(result)
                {
                    console.log("password changed successfully")
                     db.close()
                     res.render('pages/settings',{
                       Fullname: sess.Fullname,
                       email:sess.email,
                       phone:sess.phone,
                       pro_updated: "false", pass_updated: "true",
                       msg4:"security"

                     })
                     
                });

                           }

                           else{
                                  
                                   res.render('pages/settings',{
                                 msg3:'new passwords do not match',
                                 Fullname: sess.Fullname,
                                 email:sess.email,
                                 phone:sess.phone,
                                 pro_updated: "false", pass_updated: "false",
                                 msg4:"security"
                                 
                            })
                           }
                      }

                      else{
                           

                           res.render('pages/settings',{
                                 msg3:'wrong old password',
                                 Fullname: sess.Fullname,
                                 email:sess.email,
                                 phone:sess.phone,
                                 pro_updated: "false", pass_updated: "false",
                                 msg4:"security"
                                 
                            })

                  }     
                     
                });

}


})

}

})



app.get('/success', function(req, res) {

res.render('pages/success',{download: "ok",mail_status:"no"})

})

app.get('/download', function(req, res) {
var sess = req.session;
res.render('pages/download_ticket')

})






app.get('/my_bookings', function(req, res) {

 var sess = req.session;
 MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
                 
 var dbo = db.db("moviesdb");

 var result = dbo.collection("users_transactions").find({user:sess.Fullname,email:sess.email}).toArray(function(err,result)

 {
      var date_of_booking = []
      var date_of_booking1 = []
      var title2 = []
      var no_of_seats = []
      var total = []
      var status = []
      var total_rows = result.length
      
      for(i=0;i<total_rows;i++)
      {
        var str = result[i].Date_of_booking
        str = str.replace("GMT+0530 (India Standard Time)","")
        date_of_booking.push(str)
        date_of_booking1.push(result[i].Date_of_booking)
        title2.push(result[i].title)
        no_of_seats.push(result[i].No_of_seats)
        total.push(result[i].Total_price_paid)
        status.push(result[i].status)
      }
      
      console.log(date_of_booking);
      console.log(title2)
      console.log(no_of_seats)

       
       sess.extra_orders  = ""
       sess.title  = ""
       sess.date  = ""
       sess.time  = ""
       sess.total_price  = ""
       sess.seats  = ""
       sess.price  = ""
       sess.city  = ""
       sess.theatre  = ""
       sess.poster = ""
       sess.status = ""
       sess.date_of_booking = date_of_booking
       sess.date_of_booking1 = date_of_booking1
       sess.total_rows = total_rows
       sess.title2 = title2
       sess.no_of_seats = no_of_seats
       sess.total = total
       sess.status = status
res.render('pages/my_bookings',{date_of_booking,date_of_booking1,title2,no_of_seats,total,status,total_rows,download:"no"})


 })

})


})

app.post('/ticket', urlencodedParser ,function(req, res) {

var sess = req.session;

var date_of_booking = req.body.date_of_booking
var type= req.body.type
console.log(type)
console.log(date_of_booking)
MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
                 
                  var dbo = db.db("moviesdb");
                    
                    if(type == "download")
                    {
                      console.log(sess.email,sess.Fullname)
                    dbo.collection("users_transactions").findOne({email : sess.email, user: sess.Fullname, Date_of_booking: date_of_booking }).then(function(result)
                    {
                    
                     sess.extra_orders = result.extra_orders_array
                     sess.title =  result.title
                     sess.date =  result.date
                     sess.time =  result.time
                     sess.total_price =  result.Total_price_paid
                     sess.seats =  result.seats
                     sess.price =  result.No_of_seats
                     sess.city =  result.city
                     sess.theatre =  result.theatre
                     sess.poster = result.poster
                     sess.status = result.status
                      
                    
         

       

      res.render('pages/my_bookings',{date_of_booking: sess.date_of_booking,
                                      date_of_booking1: sess.date_of_booking1,
                                      title2: sess.title2,
                                      no_of_seats: sess.no_of_seats,
                                      total: sess.total,
                                      total_rows: sess.total_rows,
                                      status: sess.status,
                                      download:"ok"
                                    })


})
}
else
{
       dbo.collection("users_transactions").findOneAndUpdate({ email : sess.email, user: sess.Fullname, Date_of_booking: date_of_booking}, {$set: {"status" : "CANCELLED"}}).then(function(result)
                {})

       dbo.collection("users_transactions").findOne({email : sess.email, user: sess.Fullname, Date_of_booking: date_of_booking }).then(function(result)
                    {
                      console.log(result.Total_price_paid)

                       var myobj2 = {

                          user  : sess.Fullname,
                          email : sess.email,
                          title : result.title,
                          Total_price_paid: result.Total_price_paid,
                          status: "CANCELLED",
                          transaction_date: Date()

                        }
                           dbo.collection("billing").insertOne(myobj2, function(err, res) {
                            
                           });
                          
                           res.redirect('/my_bookings')










                    })
}






})
})





app.post('/mail', urlencodedParser ,function(req, res) {

var sess = req.session
var mail = req.body.email
sess.to_mail = mail
res.render('pages/mail.ejs',{download: "ok"});

})




app.post('/mailsender', urlencodedParser,  (req, res) => {
	
  var sess = req.session
  var data = req.body.pdf_data
  var mail = sess.to_mail
  
  var mail_status;

  let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'MovieTicks12@gmail.com',
    pass: 'MovieTicks123@'
  }
});



  let message = {
        from: 'movieticks@gmail.com',
        to: mail,
        subject: 'Recent Booking of your movie ticket',
        //text: 'That was easy!',
        attachments: [
            {
                
                filename: 'ticket.pdf',
                path: data                  
            }
        ]
    };


transporter.sendMail(message, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    res.render('pages/success',{download:"ok", mail_status:"sent"})
     
  }
});



});





app.get('/about_us', function(req, res) {


res.render('pages/about_us');

})






























app.listen(8080);




   