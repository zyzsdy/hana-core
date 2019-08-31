const Hana = require("..").default;

if (process.argv.length <= 2) {
    console.log("Convert the input Japanese sentence to a Romaji.\nHelp: node romaji.js [Japanese sentence.]");
} else if (process.argv.length > 3) {
    console.log("Unable to receive more than one parameter.");
} else {
    let sentence = process.argv[2];
    new Hana().init((err, _, self) => {
        console.log(self.convert(sentence));
    });
}