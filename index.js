const express = require('express');
const app = express();
const port = 3000;
const expressMbs = require('express-handlebars');
const { createPagination } = require("express-handlebars-paginate");

//cau hinh thu muc static
app.use(express.static(__dirname + '/html'));

//cau hinh su dung view template:
app.engine(
    "hbs",
    expressMbs.engine({
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials",
        extname: "hbs",
        defaultLayout: "layout",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
        },
        helpers: {
            createPagination,
            formatDate: (date) => {
                return new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
            }
        }
    })
);
app.set("view engine", "hbs");

app.get("/", (req, res) => {
    res.redirect("/blogs")
})
app.use("/blogs", require("./routes/blogRouter"));


app.listen(port, () => {
    console.log(`example run listen on port ${port}`);
})
