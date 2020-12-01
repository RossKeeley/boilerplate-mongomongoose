require('dotenv').config();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


var Schema = mongoose.Schema;

var personSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    age: Number,
    favoriteFoods: [String]
  });

var Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  var ross = new Person({
    name: 'Ross Keeley',
    age: 26,
    favoriteFoods: ['Steak', 'Potato gratin']
  });

  ross.save(function(err, data) {
    if(err) {
      console.log(err);
    } else {
      done(null, data)
    }
  });
};
var arrayOfPeople = [
  {name: 'Jennifer', age: 27, favoriteFoods: ['Rice'] },
  {name: 'Gabriela', age: 26, favoriteFoods: ['Pratas'] },
  {name: 'Ricardo', age: 25, favoriteFoods: ['Liver with some fava beans and a nice Chianti']}
];
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, people) {
    if (err) {
      console.log(err)
    } else {
      done(null, people)
    }
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, people) => {
    if (err) return console.log(err);
    done(null, people);
  });
};


const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, foodPerson) => {
    if (err) return console.log(err);
    done(null, foodPerson);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({_id: personId}, (err, idOfPerson) => {
    if (err) return console.log(err);
    done(null, idOfPerson);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, person) => {
    if (err) return console.log(err);
    person.favoriteFoods.push(foodToAdd);

    person.save((err, data) => {
      if (err) return console.log(err);
      done(null, data);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, { new: true }, (err, updatedDoc) => {
    if (err) return console.log(err);
    done(null, updatedDoc);
    })
};


const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, personToRemove) => {
    if(err) return console.log(err);
    done(null, personToRemove);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, removalInfo) => {
    if (err) return console.log(err);
    done(null, removalInfo);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch}).sort({name: 'asc'}).limit(2).select('-age').exec((err, searchResults) => {
    console.log(searchResults);
    done(err, searchResults);
  });
};



exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
