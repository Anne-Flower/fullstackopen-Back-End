require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");

    const args = process.argv;
    const password = args[2];
    const name = args[3];
    const number = args[4];

    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    const Person = mongoose.model("Person", personSchema);

    if (name && number) {
      const person = new Person({
        name: name,
        number: number,
      });

      return person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
      });
    } else {
      Person.find({}).then((result) => {
        console.log("phonebook:");
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
      });
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

  module.exports = mongoose.model('Person', personSchema)
