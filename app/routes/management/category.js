module.exports = function (app) {

  var methodOverride = require('method-override'); //used to manipulate POST

  var Category = require('../../models/category');

  // var requireUser = require('../../controllers/require-user');

  app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))


  // ALL ///////////////////////////////////////////////////////////////////////
  app.get('/management/categories/', app.auth, function (req, res) {
    //GET all categories
    res.render('management/categories/index', {
          title: 'Category Management'
    });
  });

  // NEW ///////////////////////////////////////////////////////////////////////
  app.get('/management/categories/add', app.auth, function (req, res) {
    res.render('management/categories/add', { title: 'Add New Category' });
  });

  // NEW - POST ////////////////////////////////////////////////////////////////
  app.post('/management/categories/add', app.auth, function (req, res) {
    // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
    var name = req.body.category;

    //call the create function for our database
    Category.create({
      name : name
    }, function (err, category) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      } else {
        //Blob has been created
        console.log('POST creating new category: ' + category);
        res.format({
            //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
          html: function(){
              // If it worked, set the header so the address bar doesn't still say /adduser
              res.location("management/categories");
              // And forward to success page
              res.redirect("/management/categories");
          },
          //JSON response will show the newly created category
          json: function(){
              res.json(category);
          }
        });
      }
    })
  });


  // SHOW ///////////////////////////////////////////////////////////////////////
  app.get('/management/categories/:id', app.auth, function (req, res, next) {
    console.log("request id : "+req.params.id);

    Category.findById(req.params.id, function (err, category) {
      if (err) {
        // Pass error if no request id found
        var myerr = new Error('Record not found!');
        return next(myerr);
      } else {
        console.log(category);
        console.log('GET Retrieving ID: ' + category._id);
        res.format({
          html: function(){
              res.render('management/categories/show', {
                "title" : 'Category details',
                "category" : category
              });
          },
          json: function(){
              res.json(category);
          }
        });
      }
    });
  });

  // EDIT ///////////////////////////////////////////////////////////////////////
  app.get('/management/categories/:id/edit', app.auth, function (req, res, next) {
    //search for the category within Mongo
    Category.findById(req.params.id, function (err, category) {
      if (err) {
        // Pass error if no id found
        var myerr = new Error('Record not found!');
        return next(myerr);
      } else {
        //Return the category
        console.log('GET Retrieving ID: ' + category._id);
        res.format({
            //HTML response will render the 'edit.jade' template
            html: function(){
                  res.render('management/categories/edit', {
                    title: 'Edit of ' + category._id,
                    "category" : category
                  });
            },
             //JSON response will return the JSON output
            json: function(){
                  res.json(category);
            }
        });
      }
    });
  });

  app.put('/management/categories/:id/edit', app.auth, function (req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.category;

    //find the document by ID
    Category.findById(req.params.id, function (err, category) {
      //update it
      category.update({
        name : name
      }, function (err, categoryID) {
        if (err) {
          res.send("There was a problem updating the information to the database: " + err);
        }
        else {
          //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
          res.format({
            html: function(){
                  res.redirect("/management/categories/" + category._id);
            },
             //JSON responds showing the updated values
            json: function(){
                  res.json(category);
            }
          });
         }
      })
    });
  });

  app.delete('/management/categories/:id/edit', app.auth, function (req, res, next) {
    //find category by ID
    Category.findById(req.params.id, function (err, category) {
      if (err) {
        // Pass error
        var myerr = new Error('Record not found!');
        return next(myerr);
      } else {
        //remove it from Mongo
        category.remove(function (err, category) {
          if (err) {
            // Pass error
            var myerr = new Error('Unable to delete record!');
            return next(myerr);
          } else {
            //Returning success messages saying it was deleted
            console.log('DELETE removing ID: ' + category._id);
            res.format({
                //HTML returns us back to the main page, or you can create a success page
                html: function(){
                      res.redirect("/management/categories");
                },
                 //JSON returns the item with the message that is has been deleted
                json: function(){
                      res.json({message : 'deleted',
                           item : category
                      });
                }
            });
          }
        });
      }
    });
  });

}
