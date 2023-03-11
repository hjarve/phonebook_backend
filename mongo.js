const mongoose = require('mongoose');

if (process.argv.length<3) {
    console.log('give password as argument');
    process.exit(1);
};

const password = process.argv[2];

const url =
`mongodb+srv://fullstack2023:${password}@cluster0.7rckb5s.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

const getPersons = () => {
    console.log('phonebook');
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close();
    })
};


if (process.argv[3]){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });
    person.save().then(result => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
});
} else {
    getPersons();
}


